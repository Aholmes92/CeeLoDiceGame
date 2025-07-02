"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function PlayerProfile() { 
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res= await axios.get('/api/users/me');
                setUser(res.data);
            } catch (error: any) {
                console.error("Failed to get user:", error.message);
                router.push('/login');
            }
        };

        fetchUser();
    }, []); 

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            router.push('/login')
        } catch (error:any) {
            console.log(error.message);
        }
    };

    const winPct = user?.gamesPlayed ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) + "%" : "0%";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <p className="text-4xl">
                Roller: <span className="p-2 ml-2 rounded">{user?.username || "Loading..."}</span>
            </p>
            <hr />
            <h2 className="text-xl font-bold mb-2">Game Stats</h2>
            <p><strong>Win %:</strong> {winPct}</p>
            <p><strong>Games Won:</strong> {user?.gamesWon || 0}</p>
            <p><strong>Games Played:</strong> {user?.gamesPlayed || 0}</p>
            <a href="/play">
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:font-bold">
                Play Cee-Lo
                </button>
            </a>
            <hr />
            <button
            onClick= {logout}
            className="m-2 px-4 py-2 rounded bg-white-500 hover:bg-red-700 hover:text-white font-bold">Logout</button>
        </div> 
    )
}

