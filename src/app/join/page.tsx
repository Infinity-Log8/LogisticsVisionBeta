"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Users, ArrowRight, Mail } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Please enter an invite code.");
      return;
    }
    router.push('/join/' + trimmed);
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col">
      <header className="flex items-center gap-3 px-8 py-5">
        <Truck className="text-orange-500" size={28} />
        <span className="text-white text-xl font-bold tracking-tight">Logistics Vision</span>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full p-5">
              <Users className="text-orange-400" size={36} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">Join a Workspace</h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your invitation code below, or ask your team admin to send you an invite link.
          </p>
          <div className="bg-[#1f2937] border border-gray-700 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Invitation Code</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setError(""); }}
                  placeholder="e.g. abc123xyz"
                  className="w-full bg-[#111827] border border-gray-600 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-4 flex gap-3">
              <Mail className="text-orange-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-200 mb-1">Have an invite link?</p>
                <p className="text-xs text-gray-400">
                  If you received an invitation link via email, click it directly and you will be taken to the right page automatically.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Want to create a new workspace?{" "}
              <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition">Register here</Link>
            </p>
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-600 text-xs">
        &copy; Logistics Vision. All rights reserved.
      </footer>
    </div>
  );
}
