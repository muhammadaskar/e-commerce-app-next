// pages/dashboard.tsx

import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Konten Utama */}
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                <p className="mt-4 text-lg text-gray-600">Welcome to the Dashboard</p>

                {/* Content Section */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Orders Overview</h2>
                        <p className="mt-2 text-gray-600">Quick view of all orders.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Stock Overview</h2>
                        <p className="mt-2 text-gray-600">Quick view of current stock levels.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Stock Transfers</h2>
                        <p className="mt-2 text-gray-600">View all recent stock transfers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
