"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Truck } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
                  const idToken = await credential.user.getIdToken();
                                await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
                                              router.push("/dashboard");
                                                  } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setError("sent:Password reset email sent. Check your inbox.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white p-12">
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-4">
                <Truck size={48} />
                <h1 className="text-4xl font-bold">Logistics Vision</h1>
            </div>
            <p className="text-xl mb-12">Track smarter. Deliver faster.</p>
            <div className="grid grid-cols-1 gap-6 text-left">
                <div className="bg-white/20 p-6 rounded-lg">
                    <p className="text-3xl font-bold">12,400+</p>
                    <p>Shipments Tracked</p>
                </div>
                <div className="bg-white/20 p-6 rounded-lg">
                    <p className="text-3xl font-bold">340+</p>
                    <p>Active Routes</p>
                </div>
                <div className="bg-white/20 p-6 rounded-lg">
                    <p className="text-3xl font-bold">98.2%</p>
                    <p>On-Time Delivery</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-[#0f0f1a] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className={`p-4 rounded-md text-center ${error.startsWith("sent:") ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              {error.startsWith("sent:") ? error.substring(5) : error}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent text-white hover:bg-white/10 hover:text-white border-white/30"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.4 69.4c-24.5-23.5-58.3-38.2-97.6-38.2-83.8 0-152.2 68.3-152.2 152.2s68.4 152.2 152.2 152.2c97.9 0 135.2-70.4 141.2-106.3H248v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path></svg>
            }
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f0f1a] px-2 text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
                className="bg-transparent border-white/30 text-white"
              />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password"  className="text-gray-400">Password</Label>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-orange-500 hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                className="bg-transparent border-white/30 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading || googleLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-orange-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
