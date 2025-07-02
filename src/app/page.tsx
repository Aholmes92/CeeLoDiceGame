'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-slate-100 to-slate-300 text-center">
      <h1 className="text-5xl font-bold text-blue-800 mb-6">Let's Play Cee-Lo 🎲</h1>
      
      <p className="max-w-xl text-lg text-gray-700 mb-10">
        Cee-Lo is a fast-paced dice game where players roll three dice to beat the computer.
        <br /><br />
        Roll a 4-5-6 to win instantly, 1-2-3 to lose. Triples are strong, and pairs give you a "point."
        Highest score wins!
      </p>

      <button
        onClick={goToLogin}
        className="px-6 py-3 text-white bg-blue-600 rounded shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200"
      >
        Log In to Play!
      </button>
    </div>
  );
}