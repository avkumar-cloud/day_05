"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const {login} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
       const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if(!res.ok){
        setError(data.error || "Invalid email or password");
        return;
    }

      login(data.token, data.name)
      router.push("/chat"); 
    } catch (error) {
        setError("Something went wrong, please try again")
    }
    finally{
        setLoading(false)
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Chat
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
        disabled = {loading}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Logging in.." : "Login"}
        </button>
            {
            error && (
                <p className="text-red-500 text-sm text-center mt-3">{error}</p>
                )
            }
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
