"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email:"",
        password:"",
        username:"",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("api/users/signup", user);
            console.log("Success!", response.data);
            router.push("/login");
        } catch (error: any) {
            console.log("Signup Unsuccessful", error.message);
            alert("Something went wrong. Please try again");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }

    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center
        min-h-screen py-2">
            <h1 className="text-center text-2xl">{loading ? "Loading" : "Sign Up!"}</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <input className="p-2 border rounded-lg"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="username" />
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
                onClick={onSignup}
                className="p-2 m-2 border rounded-lg">{buttonDisabled ? "Fill Out Form" : "Sign Up!"}</button>
                <Link href="/login">Already signed up? Login here.</Link>
        </div>
    )
}