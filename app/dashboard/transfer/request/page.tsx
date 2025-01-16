// pages/dashboard/StockTransferReceived.tsx
"use client";

import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StockTransferRequest {
    stockTransferId: string;
    quantity: number;
    reason: string;
    sourceWarehouse: Warehouse;
    destinationWarehouse: Warehouse;
    product: Product;
    status: string;
    createdAt: string;
}

interface Warehouse {
    warehouseId: string;
    name: string;
}

interface Product {
    productId: string;
    name: string;
}

const StockTransferRequest = () => {
    const [stocksTransferReceived, setStocksTransferReceived] = useState<StockTransferRequest[]>([]);

    useEffect(() => {
        const fetchStockTransferRequest = async () => {
            const warehouseId = localStorage.getItem('warehouseId');
            const authToken = localStorage.getItem('authToken');
            if (warehouseId && authToken) {
                fetch(`${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE}/stock-transfers/by-source-warehouse/${warehouseId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setStocksTransferReceived(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching StockTransferRequest:', error);
                    });
            } else {
            }
        };

        fetchStockTransferRequest();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Stock</h1>
                <p className="mt-4 text-lg text-gray-600">List Stock Transfer Request</p>

                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-black font-bold">Transfer ID</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Source</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Status</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Quantity</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Created At</th>
                                {/* <th className="px-6 py-3 text-left text-black font-bold">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {stocksTransferReceived.map((order) => (
                                <tr key={order.stockTransferId} className="border-b border-gray-300">
                                    <td className="px-6 py-4 text-black">{order.stockTransferId}</td>
                                    <td className="px-6 py-4 text-black">{order.destinationWarehouse.name}</td>
                                    <td className="px-6 py-4 text-black">{order.status}</td>
                                    <td className="px-6 py-4 text-black">{order.quantity}</td>
                                    <td className="px-6 py-4 text-black">{new Date(order.createdAt).toLocaleString()}</td>
                                    {/* <td>
                                        <Link
                                            href={`/dashboard/StockTransferRequest/${order.stockTransferId}`}
                                            className="text-blue-500 hover:text-blue-700 font-semibold"
                                        >
                                            View Detail
                                        </Link>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockTransferRequest;
