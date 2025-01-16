'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

interface Product {
    productId: string;
    sku: string;
    name: string;
    imageUrl: string;
}

interface Item {
    id: string;
    product: Product;
    quantity: number;
    price: number;
    subTotal: number;
}

interface ShippingAddress {
    street: string;
    postalCode: string;
    city: string;
    latitude: string;
    longitude: string;
}

interface Order {
    orderId: string;
    userId: string;
    cartId: string | null;
    totalPrice: number;
    items: Item[];
    shippingAddress: ShippingAddress;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
    const [orderId, setOrderId] = useState<string | null>(null);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentProof, setPaymentProof] = useState<string | null>(null); // Store the base64 string of the file

    useEffect(() => {
        const fetchOrder = async () => {
            const unwrappedParams = await params;
            setOrderId(unwrappedParams.orderId); // Ensure orderId is set after unwrapping params
        };

        fetchOrder();
    }, [params]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Token is missing. Please log in.');
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/${orderId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const orderData: Order = await response.json();
                setOrder(orderData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const handlePayment = async () => {
        setIsModalOpen(true);
    };

    const handleSubmitPaymentProof = async () => {
        if (!paymentProof) {
            alert('Please upload a payment proof before submitting.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE}/upload-proof`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    orderId,
                    paymentProof,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload payment proof.');
            }

            setOrder((prevOrder) => {
                if (!prevOrder) {
                    return prevOrder;
                }

                return {
                    ...prevOrder,
                    orderStatus: 'PENDING',
                };
            });

            alert('Payment proof uploaded successfully!');
            setIsModalOpen(false); // Menutup modal setelah berhasil
        } catch (error: any) {
            console.error('Error submitting payment proof:', error.message);
            alert(`Error: ${error.message}`);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            alert('Please select a file');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                setPaymentProof(reader.result as string);
            }
        };
        reader.onerror = () => {
            alert('Failed to read the file');
        };

        reader.readAsDataURL(file);
    };

    const handleConfirmOrder = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    orderId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to confirm order.');
            }

            setOrder((prevOrder) => {
                if (!prevOrder) {
                    return prevOrder;
                }

                return {
                    ...prevOrder,
                    orderStatus: 'CONFIRMED',
                };
            });

            alert('Order confirmed successfully!');
        } catch (error: any) {
            console.error('Error confirming order:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    if (loading) {
        return <p className="text-center mt-10 text-lg text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-lg text-red-600">Error: {error}</p>;
    }

    if (!order) {
        return <p className="text-center mt-10 text-lg text-gray-600">Order not found.</p>;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h1>

                    {/* Order Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Order Information</h2>
                        <p className="text-gray-700">
                            <strong>Order ID:</strong> {order.orderId}
                        </p>
                        <p className="text-gray-700">
                            <strong>Status:</strong> {order.orderStatus}
                        </p>
                        <p className="text-gray-700">
                            <strong>Total Price:</strong> Rp {order.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-700">
                            <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-gray-700">
                            <strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}
                        </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-700">
                                <strong>Street:</strong> {order.shippingAddress.street}
                            </p>
                            <p className="text-gray-700">
                                <strong>City:</strong> {order.shippingAddress.city}
                            </p>
                            <p className="text-gray-700">
                                <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-gray-700">
                                <strong>Latitude:</strong> {order.shippingAddress.latitude}
                            </p>
                            <p className="text-gray-700">
                                <strong>Longitude:</strong> {order.shippingAddress.longitude}
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                        <div className="mt-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-2"
                                >
                                    <div>
                                        <div className='flex'>
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-24 h-24 rounded-md object-cover"
                                            />
                                            <div>
                                                <p className="text-gray-800 font-medium">
                                                    {item.product.productId}
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-gray-700"> {item.product.sku}</p>

                                            </div>
                                        </div>
                                        {
                                            order.orderStatus === 'SHIPPED' && (
                                                <button
                                                    onClick={handleConfirmOrder}
                                                    className="mt-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5"
                                                >
                                                    Confirm Order</button>
                                            )
                                        }
                                    </div>

                                    <div className="text-right">
                                        <p className="text-gray-700">Quantity: {item.quantity}</p>
                                        <p className="text-gray-700">Price: Rp {item.price.toLocaleString()}</p>
                                        <p className="text-gray-700 font-semibold">
                                            Subtotal: Rp {item.subTotal.toLocaleString()}
                                        </p>
                                        {order.orderStatus === 'AWAITING_PAYMENT' && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={handlePayment}
                                                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                                >
                                                    Pay Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 className="text-2xl font-semibold mb-4">Upload Payment Proof</h2>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mb-4"
                                />
                                {paymentProof && (
                                    <div className="mb-4">
                                        <img src={paymentProof} alt="Payment Proof Preview" className="w-full h-auto" />
                                    </div>
                                )}
                                <button
                                    onClick={handleSubmitPaymentProof}
                                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    Submit Payment Proof
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-2 text-gray-700 hover:text-gray-900"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}