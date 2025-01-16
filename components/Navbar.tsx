// components/Navbar.tsx

import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-white text-2xl font-semibold">
                        <Link href="/">MyApp</Link>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <Link
                            href="/products"
                            className="text-white hover:text-gray-400 transition duration-300 ease-in-out"
                        >
                            Products
                        </Link>
                        <Link
                            href="/orders"
                            className="text-white hover:text-gray-400 transition duration-300 ease-in-out"
                        >
                            Orders
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-white focus:outline-none"
                            aria-label="Open menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden bg-gray-800 text-white py-4 space-y-4">
                <Link
                    href="/products"
                    className="block text-center hover:text-gray-400 transition duration-300 ease-in-out"
                >
                    Products
                </Link>
                <Link
                    href="/orders"
                    className="block text-center hover:text-gray-400 transition duration-300 ease-in-out"
                >
                    Orders
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
