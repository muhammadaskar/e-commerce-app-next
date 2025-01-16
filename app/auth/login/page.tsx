'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from "react";

export default function Login() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Cookies.set('auth-token', data.token, {
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                });

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('email', email);
                const role = data.role;

                if (role === "WAREHOUSE_ADMIN") {
                    const warehouseId = data.warehouseId;
                    localStorage.setItem('warehouseId', warehouseId);

                    if (role === "SUPER_ADMIN" || role === "WAREHOUSE_ADMIN") {
                        router.push('/dashboard');
                    }
                } else if (role === "CUSTOMER") {
                    router.push('/products');
                } else {
                    alert('Role does not exist');
                    return;
                }

                Cookies.set('role', role, {
                    'path': '/',
                    'secure': true,
                    sameSite: 'strict',
                });
            } else {
                alert(data.message || 'Login gagal, periksa kembali email dan password Anda.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Terjadi kesalahan. Coba lagi nanti.');
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-black"
                                placeholder="your@email.com"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-black"
                                placeholder="••••••••"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div>

                        <button className="w-full bg-indigo-600 hover:bg-indigo-900 text-white font-medium py-2.5 rounded-lg transition-colors"
                            onClick={(event: any) => handleLogin(event)}>
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</a>
                    </div>
                </div>
            </div>
        </>
    );
}