'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Order {
    orderId: string;
    orderStatus: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const authToken = localStorage.getItem('authToken');
        if (userId && authToken) {
            fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                });
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    const handleDetailClick = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h2>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-left font-bold text-black">Order ID</th>
                                <th className="py-2 px-4 text-left font-bold text-black">Status</th>
                                <th className="py-2 px-4 text-left font-bold text-black">Created At</th>
                                <th className="py-2 px-4 text-left font-bold text-black">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="py-2 px-4 text-black">{order.orderId}</td>
                                    <td className="py-2 px-4 text-black">{order.orderStatus}</td>
                                    <td className="py-2 px-4 text-black">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="py-2 px-4 text-black">
                                        <button
                                            className="bg-indigo-600 text-white py-1 px-4 rounded-lg hover:bg-indigo-900"
                                            onClick={() => handleDetailClick(order.orderId)} // Tombol untuk membuka halaman detail
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
