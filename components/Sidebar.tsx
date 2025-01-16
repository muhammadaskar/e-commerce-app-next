// components/Sidebar.tsx

'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {

    const router = useRouter();

    const handleLogout = () => {
        // Hapus cookies
        Cookies.remove('auth-token');
        Cookies.remove('role');
        Cookies.remove('userId');
        Cookies.remove('warehouseId');

        // Redirect ke halaman login
        router.push('/auth/login');
    };

    return (
        <div className="flex flex-col w-64 h-full bg-gray-800 text-white shadow-lg md:block hidden">
            {/* Logo or Title */}
            <div className="flex items-center justify-center py-6 bg-gray-900">
                <span className="text-2xl font-semibold">MyApp</span>
            </div>

            {/* Menu */}
            <div className="flex flex-col py-4 space-y-2">
                <Link
                    href="/dashboard/orders"
                    className="text-white hover:bg-gray-700 py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Orders
                </Link>
                <Link
                    href="/dashboard/stocks"
                    className="text-white hover:bg-gray-700 py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Stocks
                </Link>
                <Link
                    href="/dashboard/transfer/received"
                    className="text-white hover:bg-gray-700 py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Stock Received
                </Link>
                <Link
                    href="/dashboard/transfer/request"
                    className="text-white hover:bg-gray-700 py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Stock Requests
                </Link>
                <button
                    onClick={handleLogout}
                    className="text-white text-left hover:bg-gray-700 py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
