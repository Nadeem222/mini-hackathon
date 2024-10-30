"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../firebase/firebase";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { log } from "console";
import { useOutsideClick } from "../hooks/useOutsideClick"; // Import the custom hook

const DashboardPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(`${userData.firstName} ${userData.lastName}`);
                } else {
                    router.push('/login');
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    const handleChangePassword = () => {
        router.push('/passwordchange');
    };

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 bg-gradient-to-b from-gray-600 to-black">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col justify-between h-full p-4">
                    <div>
                        <h2 className="text-white text-xl mb-4">Dashboard</h2>
                        <nav>
                            <ul>
                                <li className="text-white py-2 hover:bg-gray-700 rounded">Home</li>
                                <li className="text-white py-2 hover:bg-gray-700 rounded">Profile</li>
                                <li className="text-white py-2 hover:bg-gray-700 rounded">Settings</li>
                            </ul>
                        </nav>
                    </div>
                    <div>
                        {/* You can add more links or buttons here */}
                    </div>
                </div>
            </div>

            <div className="flex-1 ml-64">
                <nav className="bg-gray-800 p-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            <span className="text-white text-xl ml-2">Dashboard</span>
                        </div>
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center text-white">
                                <img src="path_to_user_image" alt="User" className="w-8 h-8 rounded-full" />
                                <span className="ml-2">{userName}</span>
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <div className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleChangePassword}>
                                        Change Password
                                    </div>
                                    <div className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                <main className="flex flex-col items-center font-bold mb-6">
                    {userName && (
                        <h1 className="text-4xl font-bold mb-6">
                            Welcome, {userName}
                        </h1>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
