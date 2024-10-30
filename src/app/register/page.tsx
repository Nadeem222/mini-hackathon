"use client";

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { auth } from "../firebase/firebase";
import Link from 'next/link'

const RegisterPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("password do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            localStorage.setItem(
                "registrationData",
                JSON.stringify({
                    firstName,
                    lastName,
                    gender,
                    email,
                })
            );

            setMessage("registration successful! please check your email for verification");

            setFirstName("");
            setEmail("");
            setLastName("");
            setGender("");
            setPassword("");
            setConfirmPassword("");
            router.push('/login')

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("AN unknown error occurred");
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-600 to-black justify-center items-center flex min-h-screen">
            <div className="w-full max-w-md bg-gray-800 p-8 border border-gray-700 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-8 text-white">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex flex-row space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="text-sm font-medium mb-2 text-gray-300">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="lastName" className="text-sm font-medium mb-2 text-gray-300">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                            />
                        </div>
                    </div>
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
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="gender" className="text-sm font-medium mb-2 text-gray-300">gender</label>
                        <select

                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="border outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-600 border-gray-500 text-white px-2.5 py-2 w-full"
                        >
                            <option value="">select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">other</option>
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
                <p
                    className="text-sm font-medium text-gray-300 text-center mt-4"
                >Already have an account?{" "}
                    <Link href="/login" className="text-blue-700 hover:underline">login here</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;
