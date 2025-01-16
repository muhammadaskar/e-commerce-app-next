// pages/dashboard/Stocks/[stockId].tsx

"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';


interface StockDetail {
    stockId: string;
    quantity: number;
    product: Product;
}

interface Product {
    productId: string;
    name: string;
    imageUrl: string;
    price: number;
}

interface StockJournal {
    stockJournalId: string;
    changeType: string;
    quantity: number;
    reason: string;
    warehouse: {
        warehouseId: string;
        name: string;
    };
    product: {
        productId: string;
        name: string;
    };
    createdAt: string;
}

const StockDetailPage = ({ params }: { params: Promise<{ stockId: string }> }) => {
    const [stockId, setstockId] = useState<string | null>(null);
    const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [quantity, setQuantity] = useState<string>(''); // Initialize with empty string
    const [stockJournals, setStockJournals] = useState<StockJournal[]>([]);

    useEffect(() => {
        const fetchStock = async () => {
            const unwrappedParams = await params;
            setstockId(unwrappedParams.stockId); // Ensure stockId is set after unwrapping params
        };

        fetchStock();
    }, [params]);

    useEffect(() => {
        if (stockId) {
            // Fetch Stock details from API (replace with your actual API call)
            const fetchStockDetail = async () => {
                const warehouseId = localStorage.getItem('warehouseId');
                const authToken = localStorage.getItem('authToken');
                if (warehouseId && authToken) {
                    fetch(`${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE}/stock/${stockId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            setStockDetail(data);

                            // Fetch stock journals
                            const journalResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE}/stock-journals/${data.product.productId}/${warehouseId}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${authToken}`,
                                    },
                                }
                            );
                            const journalData = await journalResponse.json();
                            setStockJournals(journalData);
                        })
                        .catch((error) => {
                            console.error('Error fetching Stock details:', error);
                        });
                }

            };
            fetchStockDetail();
        }
    }, [stockId]);




    if (!stockDetail) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-3xl font-semibold text-gray-800">Loading Stock Details...</h1>
                </div>
            </div>
        );
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setQuantity(stockDetail.quantity.toString());
    };

    const handleSaveClick = () => {
        // Save the new quantity to the API
        const warehouseId = localStorage.getItem('warehouseId');
        const authToken = localStorage.getItem('authToken');
        const productId = stockDetail.product.productId;
        if (warehouseId && authToken) {
            fetch(`${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    warehouseId: warehouseId,
                    productId: productId,
                    quantity: parseInt(quantity),
                })
            })
                .then((response) => response.json())
                .then(() => {
                    // Refresh the page
                    setIsEditing(false);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error updating stock quantity:', error);
                });
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Hapus angka 0 di depan jika input lebih dari 1 digit
        const sanitizedValue = value.replace(/^0+(?=\d)/, '');
        setQuantity((sanitizedValue));
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Stock Detail: {stockDetail.stockId}</h1>
                <Image
                    src={stockDetail.product.imageUrl}
                    alt={stockDetail.product.name}
                    className="mt-2 max-w-full bStock rounded-md"
                    width={200}
                    height={200}
                />
                <div>
                    {isEditing ? (
                        <div className="flex items-center mt-4">
                            <p className="text-lg text-gray-600">Quantity:</p>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="text-lg text-gray-600 border border-gray-300 rounded-md p-2"
                            />
                            <button onClick={handleSaveClick} className="ml-2 text-green-600">
                                <FaSave />
                            </button>
                            <button onClick={handleCancelClick} className="ml-2 text-red-600">
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center mt-4">
                            <p className="text-lg text-gray-600">Quantity: {stockDetail.quantity}</p>
                            <button onClick={handleEditClick} className="ml-2 text-blue-600">
                                <FaPencilAlt />
                            </button>
                        </div>
                    )}
                </div>
                <p className="mt-2 text-lg text-gray-600">Product Name: {stockDetail.product.name}</p>
                <p className="mt-2 text-lg text-gray-600">Product Price: Rp.{stockDetail.product.price}</p>

                {/* Stock Journal List */}
                <h2 className="mt-6 text-2xl font-semibold text-gray-800">Stock Journal</h2>
                <table className="table-auto w-full mt-4 border border-gray-300 bg-white rounded-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border text-left text-black">Date</th>
                            <th className="px-4 py-2 border text-left text-black">Change Type</th>
                            <th className="px-4 py-2 border text-left text-black">Quantity</th>
                            <th className="px-4 py-2 border text-left text-black">Reason</th>
                            <th className="px-4 py-2 border text-left text-black">Warehouse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockJournals.map((journal) => (
                            <tr key={journal.stockJournalId}>
                                <td className="px-4 py-2 border text-black">{new Date(journal.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-2 border text-black">{journal.changeType}</td>
                                <td className="px-4 py-2 border text-black">{journal.quantity}</td>
                                <td className="px-4 py-2 border text-black">{journal.reason}</td>
                                <td className="px-4 py-2 border text-black">{journal.warehouse.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockDetailPage;
