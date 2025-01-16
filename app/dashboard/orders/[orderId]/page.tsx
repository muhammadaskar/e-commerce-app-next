// pages/dashboard/orders/[orderId].tsx

"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

interface OrderDetail {
    orderId: string;
    userId: string;
    totalPrice: number;
    orderStatus: string;
    createdAt: string;
    shippingAddress: {
        street: string;
        postalCode: string;
        city: string;
    };
    items: {
        id: string;
        product: {
            productId: string;
            sku: string;
            name: string;
            imageUrl: string;
        };
        quantity: number;
        price: number;
        subTotal: number;
    }[];
}

interface PaymentDetails {
    paymentId: string;
    orderId: string;
    amount: number;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    orderStatus: string;
    paymentProof: string; // Base64 image
}

const OrderDetailPage = ({ params }: { params: Promise<{ orderId: string }> }) => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetails | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const unwrappedParams = await params;
            setOrderId(unwrappedParams.orderId); // Ensure orderId is set after unwrapping params
        };

        fetchOrder();
    }, [params]);

    useEffect(() => {
        if (orderId) {
            // Fetch order details from API (replace with your actual API call)
            const fetchOrderDetail = async () => {
                const warehouseId = localStorage.getItem('warehouseId');
                const authToken = localStorage.getItem('authToken');
                if (warehouseId && authToken) {
                    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/${orderId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            setOrderDetail(data);
                        })
                        .catch((error) => {
                            console.error('Error fetching order details:', error);
                        });
                }
            };

            const fetchPaymentDetails = async (paymentId: string) => {
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/by-order-id/${paymentId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            setPaymentDetail(data);
                        })
                        .catch((error) => {
                            console.error('Error fetching payment details:', error);
                        });
                }
            }

            fetchOrderDetail();
            fetchPaymentDetails(orderId);
        }
    }, [orderId]);

    const handleApprovePayment = async () => {

        if (!paymentDetail) {
            return;
        }

        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ paymentId: paymentDetail.paymentId })
            })
                .then((response) => response.json())
                .then(() => {
                    // Refresh the page
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error approving payment:', error);
                });
        }
    };

    const handleShipOrder = async () => {
        if (!orderDetail) {
            return;
        }

        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/ship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ orderId: orderDetail.orderId })
            })
                .then((response) => response.json())
                .then(() => {
                    // Refresh the page
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error shipping order:', error);
                });
        }
    };

    if (!orderDetail || !paymentDetail) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-3xl font-semibold text-gray-800">Loading Order Details...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Order Detail: {orderDetail.orderId}</h1>
                <p className="mt-4 text-lg text-gray-600">Status: {orderDetail.orderStatus}</p>
                <p className="mt-4 text-lg text-gray-600">Total Price: RP.{orderDetail.totalPrice}</p>
                <p className="mt-4 text-lg text-gray-600">Order Date: {new Date(orderDetail.createdAt).toLocaleString()}</p>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
                    <p className="mt-2 text-gray-600">{orderDetail.shippingAddress.street}</p>
                    <p className="text-gray-600">{orderDetail.shippingAddress.city}, {orderDetail.shippingAddress.postalCode}</p>
                </div>

                <h2 className="mt-6 text-xl font-semibold text-gray-800">Order Items</h2>
                <ul className="mt-4">
                    {orderDetail.items.map((item, index) => (
                        <li key={index} className="text-gray-600">
                            <div className="flex">
                                <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-24 h-24 rounded-md object-cover"
                                />
                                <div>

                                    <div>Product SKU: {item.product.sku}</div>
                                    <div>Quantity: {item.quantity}</div>
                                    <div>Price: Rp.{item.price}</div>
                                    <div>SubTotal: Rp.{item.subTotal}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {orderDetail.orderStatus === 'PROCESSED' && (
                    <div className="mt-6">
                        <div className="flex space-x-4">
                            <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-900">
                                Cancel Order
                            </button>
                            <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-900" onClick={handleShipOrder}>
                                Ship Order
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Payment Details */}
            <div className="bg-gray-100 p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800">Payment Details</h2>
                <p className="mt-4 text-lg text-gray-600">Payment ID: {paymentDetail.paymentId}</p>
                <p className="mt-2 text-lg text-gray-600">Amount: Rp.{paymentDetail.amount}</p>
                <p className="mt-2 text-lg text-gray-600">Payment Status: {paymentDetail.paymentStatus}</p>
                <p className="mt-2 text-lg text-gray-600">Order Status: {paymentDetail.orderStatus}</p>
                <p className="mt-2 text-lg text-gray-600">Payment Created At: {new Date(paymentDetail.createdAt).toLocaleString()}</p>
                <p className="mt-2 text-lg text-gray-600">Payment Updated At: {new Date(paymentDetail.updatedAt).toLocaleString()}</p>

                {paymentDetail.paymentProof && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800">Payment Proof</h3>
                        <Image
                            src={paymentDetail.paymentProof}
                            alt="Payment Proof"
                            className="mt-2 max-w-full border rounded-md"
                            width={500}
                            height={500}
                        />
                    </div>
                )}

                {paymentDetail.paymentStatus === 'UNDER_REVIEW' && (
                    <div className="mt-6">
                        <div className="flex space-x-4">
                            <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-900">
                                Reject Payment
                            </button>
                            <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-900" onClick={handleApprovePayment}>
                                Approve Payment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;
