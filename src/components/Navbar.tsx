"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        ChatApp
      </Link>

      <div className="flex items-center gap-4">
        {!user.token ? (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">
              Hi, {user.name}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
