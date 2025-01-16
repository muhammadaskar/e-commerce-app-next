// pages/dashboard/stock.tsx
"use client";

import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
    orderId: string;
    stocktatus: string;
    createdAt: string;
}

interface Stock {
    stockId: string;
    quantity: number;
    product: Product;
}

interface Product {
    productId: string;
    name: string;
}

const Stock = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);

    // Mock function to fetch stock (simulasi API)
    useEffect(() => {
        const fetchstock = async () => {
            // Simulasi data order (harusnya diambil dari API)
            const warehouseId = localStorage.getItem('warehouseId');
            const authToken = localStorage.getItem('authToken');
            if (warehouseId && authToken) {
                fetch(`${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE}/${warehouseId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setStocks(data.stocks);
                        // setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching stock:', error);
                        // setLoading(false);
                    });
            } else {
                // router.push('/auth/login');
            }
        };

        fetchstock();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Stock</h1>
                <p className="mt-4 text-lg text-gray-600">List stock</p>

                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-black font-bold">Stock ID</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Product Id</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Product Name</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Quantity</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock.stockId} className="border-b border-gray-300">
                                    <td className="px-6 py-4 text-black">{stock.stockId}</td>
                                    <td className="px-6 py-4 text-black">{stock.product.productId}</td>
                                    <td className="px-6 py-4 text-black">{(stock.product.name)}</td>
                                    <td className="px-6 py-4 text-black">{(stock.quantity)}</td>
                                    {/* Add Detail button */}
                                    <td>
                                        {/* Add Detail button */}
                                        <Link
                                            href={`/dashboard/stocks/${stock.stockId}`}
                                            className="text-blue-500 hover:text-blue-700 font-semibold"
                                        >
                                            View Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stock;
