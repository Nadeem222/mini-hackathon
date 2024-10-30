"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, use, useState } from "react";
import { auth, firestore } from "../firebase/firebase";
import { getDoc , doc, setDoc} from "firebase/firestore";
import Link from "next/link";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if(user.emailVerified){
                const registrationData = localStorage.getItem("registrationData");
                const {
                    firstName = "",
                    lastName = "",
                    gender = ""
                } = registrationData ? JSON.parse(registrationData) : {};

                const userDoc = await getDoc(doc(firestore , "users" , user.uid ))
                if(!userDoc.exists()){
                    await setDoc(doc(firestore , "users" , user.uid),{
                        firstName,
                        lastName,
                        gender,
                        email: user.email,
                    });
                }
                router.push("/dashboard"); // Redirect to dashboard on successful login
            }else{
                setError("please verify your email before loggin in.")
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-600 to-black justify-center items-center flex min-h-screen">
            <div className="w-full max-w-md bg-gray-800 p-8 border border-gray-700 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-8 text-white">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium mb-2 text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-medium mb-2 text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Log In
                    </button>
                </form>
                    <p
                    className="text-sm font-medium text-gray-300 text-center mt-4"
                    >Don't have an account?{" "}
                    <Link href="/register" className="text-blue-700 hover:underline">Register here</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
