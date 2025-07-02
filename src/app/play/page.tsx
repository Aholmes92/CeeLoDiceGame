'use client';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useRouter } from "next/navigation";
import axios from "axios";


function rollDie() {
 return Math.floor(Math.random() * 6) + 1;
}


function getScore(dice: number[]) {
 const [a, b, c] = [...dice].sort();
 if (a === 4 && b === 5 && c === 6) return { result: 'Win', score: 1000 };
 if (a === 1 && b === 2 && c === 3) return { result: 'Lose', score: -1000 };
 if (a === b && b === c) return { result: 'Trip', score: 500 + a };
 if (a === b) return { result: 'Point', score: c };
 if (b === c) return { result: 'Point', score: a };
 if (a === c) return { result: 'Point', score: b };
 return { result: 'No Score', score: 0 };
}


function DiceDisplay({ dice, rolling }: { dice: number[], rolling: boolean }) {
 return (
   <div className="flex justify-center gap-2">
     {dice.map((num, idx) => (
       <img
         key={idx}
         src={`/dice/die${num}.png`}
         alt={`Die ${num}`}
         className={classNames("w-18 h-18", { 'animate-spin-slow': rolling })}
       />
     ))}
   </div>
 );
}


export default function CeeLoPage() {
 const [userDice, setUserDice] = useState([1, 1, 1]);
 const [computerDice, setComputerDice] = useState([1, 1, 1]);
 const [userScore, setUserScore] = useState<any>(null);
 const [computerScore, setComputerScore] = useState<any>(null);
 const [winner, setWinner] = useState('');
 const [rolling, setRolling] = useState(false);
 const [gameOver, setGameOver] = useState(false);


 const rollDice = () => [rollDie(), rollDie(), rollDie()];


 const handleRoll = () => {
   setRolling(true);
   setTimeout(() => {
     const user = rollDice();
     const userResult = getScore(user);
     let computer, compResult;
     do {
       computer = rollDice();
       compResult = getScore(computer);
     } while (compResult.score === 0);


     setUserDice(user);
     setComputerDice(computer);
     setUserScore(userResult);
     setComputerScore(compResult);


     const outcome = userResult.score > compResult.score ? 'User' :
                     userResult.score < compResult.score ? 'Computer' : 'Tie';
     setWinner(outcome);
     setGameOver(true);
     setRolling(false);


     // Track stats locally
     const stats = JSON.parse(localStorage.getItem('ceeloStats') || '{"wins":0,"games":0}');
     stats.games += 1;
     if (outcome === 'User') stats.wins += 1;
     localStorage.setItem('ceeloStats', JSON.stringify(stats));
   }, 1000);
 };


 const newGame = () => {
   setUserDice([1, 1, 1]);
   setComputerDice([1, 1, 1]);
   setUserScore(null);
   setComputerScore(null);
   setWinner('');
   setGameOver(false);
 };


const router = useRouter();

const endSession = async () => {
  try {
    const stats = JSON.parse(localStorage.getItem('ceeloStats') || '{"wins":0,"games":0}');
    
    // Only send the request if there's something to sync
    if (stats.games > 0) {
      const res = await axios.post('/api/users/stats', {
        wins: stats.wins,
        games: stats.games,
      });

      if (res.status === 200) {
        console.log("Stats synced:", res.data);
        localStorage.removeItem('ceeloStats'); // Clear stats after ending session
      } else {
        console.warn("Failed to sync stats", res.data);
      }
    }

    router.push('/profile');
  } catch (error: any) {
    console.error("Error syncing stats:", error.message);
  }
};


 return (
   <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-slate-100 to-slate-300 text-center">
     <h1 className="text-2xl font-bold mb-8">Play Cee-Lo</h1>
     <DiceDisplay dice={userDice} rolling={rolling} />
     <p className="p-6 font-bold text-blue-800 mb-6">Your score: {userScore?.result}</p>


     <DiceDisplay dice={computerDice} rolling={rolling} />
     <p className="p-6 font-bold text-blue-800 mb-6">Computer score: {computerScore?.result}</p>


     {gameOver && <h2 className="font-bold my-4 text-blue-800 mb-6">{winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}</h2>}


     <div className="mt-4">
       <button
         className="px-4 py-2 bg-blue-600 text-white rounded hover:font-bold"
         onClick={gameOver ? newGame : handleRoll}
         disabled={rolling}
       >
         {gameOver ? "Play Again" : "Roll Dice"}
       </button>
       <a href='/profile'>
       <button
           className="m-2 px-4 py-2 rounded bg-white-500 hover:bg-red-700 hover:text-white font-bold mt-4 text-black"
           onClick= {endSession}>End Session
       </button></a>
     </div>
   </div>
 );
}

