// pages/dashboard/orders.tsx
"use client";

import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
    orderId: string;
    orderStatus: string;
    createdAt: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    // Mock function to fetch orders (simulasi API)
    useEffect(() => {
        const fetchOrders = async () => {
            // Simulasi data order (harusnya diambil dari API)
            const warehouseId = localStorage.getItem('warehouseId');
            const authToken = localStorage.getItem('authToken');
            if (warehouseId && authToken) {
                fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/warehouse/${warehouseId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setOrders(data);
                        // setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching orders:', error);
                        // setLoading(false);
                    });
            } else {
                // router.push('/auth/login');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Orders</h1>
                <p className="mt-4 text-lg text-gray-600">List orders</p>

                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-black font-bold">Order ID</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Status</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Order At</th>
                                <th className="px-6 py-3 text-left text-black font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId} className="border-b border-gray-300">
                                    <td className="px-6 py-4 text-black">{order.orderId}</td>
                                    <td className="px-6 py-4 text-black">{order.orderStatus}</td>
                                    <td className="px-6 py-4 text-black">{new Date(order.createdAt).toLocaleString()}</td>
                                    {/* Add Detail button */}
                                    <td>
                                        {/* Add Detail button */}
                                        <Link
                                            href={`/dashboard/orders/${order.orderId}`}
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

export default Orders;
