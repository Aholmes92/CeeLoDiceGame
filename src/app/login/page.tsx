"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email:"",
        password:"",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("api/users/login", user);
            console.log("Login Successful", response.data);
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            alert("Login failed. Please check your email and password and try again.");
            setUser({ email: '', password: '' });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center
        min-h-screen py-2">
            <h1 className="text-center text-2xl">{loading ? "Processing" : "Login"}</h1>
            <hr />
            <label htmlFor="email">Email</label>
            <input className="p-2 border rounded-lg"
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email" />
            <label htmlFor="password">Password</label>
            <input className="p-2 border rounded-lg"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password" />
            <button 
                onClick={onLogin}
                className="p-2 m-2 border rounded-lg">Login!</button>
                <Link href="/signup">Sign up here.</Link>
        </div>
    )
}