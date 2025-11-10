"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.services";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.register(form);
      if (res.success) {
        toast.success("Account created successfully 🎉");
        setTimeout(() => router.push("/auth/login"), 1000);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong during registration.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_50%)] animate-pulse"></div>

      {/* Form */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl w-full max-w-md p-10 space-y-8 text-white">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-3">
            <Image
              src="/wings-trans.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          <h1 className="text-3xl font-bold tracking-wide">WINGSFORLYHAN</h1>
          <p className="text-sm text-zinc-400">Create your account</p>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 text-white placeholder:text-zinc-400 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 text-white placeholder:text-zinc-400 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/5 text-white placeholder:text-zinc-400 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-300 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-zinc-400 pt-3 space-y-1">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => router.push("/auth/login")}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
