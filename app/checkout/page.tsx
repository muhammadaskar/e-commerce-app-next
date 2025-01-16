'use client';

import Navbar from '@/components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
    productId: string;
    sku: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface ShippingAddress {
    street: string;
    postalCode: string;
    city: string;
    latitude: string;
    longitude: string;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    subTotal: number;
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');

    const [product, setProduct] = useState<Product | null>(null);
    const [address, setAddress] = useState<ShippingAddress | null>(null);
    const [quantity, setQuantity] = useState(1); // Default quantity 1
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProductAndAddress = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Token is missing. Please log in.');
                }

                const userId = localStorage.getItem('userId'); // Replace with dynamic user ID

                // Fetch product details
                const productResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE}/${productId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const productData: Product = await productResponse.json();
                setProduct(productData);

                // Fetch shipping addresses
                const addressResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_USER_SERVICE}/${userId}/list-address`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!addressResponse.ok) {
                    throw new Error('Failed to fetch shipping addresses');
                }

                const addresses: {
                    id: string;
                    userId: string;
                    address: ShippingAddress;
                    primary: boolean;
                }[] = await addressResponse.json();



                // Find primary address
                const primaryAddress = addresses.find((addr) => addr.primary);

                if (!primaryAddress) {
                    throw new Error('Primary address not found');
                }

                setAddress(primaryAddress.address);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndAddress();
    }, [productId]);

    const handleQuantityChange = (value: number) => {
        if (value < 1) return; // Prevent quantity below 1
        setQuantity(value);
    };

    const calculateTotalPrice = () => {
        return product ? product.price * quantity : 0;
    };

    const handleConfirmOrder = async () => {
        if (!product || !address) {
            console.error('Product or address data is missing.');
            return;
        }

        const orderItems: OrderItem[] = [
            {
                productId: product.productId,
                quantity,
                price: product.price,
                subTotal: product.price * quantity,
            },
        ];

        const orderData = {
            cartId: '', // Replace with dynamic cart ID if available
            totalPrice: calculateTotalPrice(), // Add shipping cost
            shippingMethod: 'JNE', // Replace with dynamic shipping method if needed
            shippingCost: 1000,
            items: orderItems,
            shippingAddress: address,
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token is missing. Please log in.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create order');
            }

            const order = await response.json();
            router.push(`/orders/${order.orderId}`);
        } catch (error: any) {
            if (error.message === "No warehouse with sufficient stock found") {
                alert("No warehouse with sufficient stock found");
            }
        }
    };

    // if (loading) {
    //     return <p className="text-center mt-10 text-lg text-gray-600">Loading...</p>;
    // }

    // if (error) {
    //     return <p className="text-center mt-10 text-lg text-red-600">Error: {error}</p>;
    // }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

                    {/* Product Details */}
                    {product && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
                            <div className="flex items-center mt-4">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-24 h-24 rounded-md object-cover"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="text-gray-700 text-lg font-medium">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                                    <p className="text-gray-900 text-lg font-semibold mt-2">
                                        Rp {product.price.toLocaleString()}
                                    </p>
                                    {/* Edit Quantity */}
                                    <div className="mt-4 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(Number(e.target.value) || 1)
                                            }
                                            className="w-12 text-center mx-2 border rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-gray-700 mt-2">
                                        <strong>Total:</strong> Rp {calculateTotalPrice().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Address */}
                    {address && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-700">
                                    <strong>Street:</strong> {address.street}
                                </p>
                                <p className="text-gray-700">
                                    <strong>City:</strong> {address.city}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Postal Code:</strong> {address.postalCode}
                                </p>
                                <p className="text-gray-700" hidden>
                                    <strong>Postal Code:</strong> {address.latitude}
                                </p>
                                <p className="text-gray-700" hidden>
                                    <strong>Postal Code:</strong> {address.longitude}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Confirm Order Button */}
                    <button
                        type="button"
                        onClick={handleConfirmOrder}
                        className="mt-6 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </>
    );
}
