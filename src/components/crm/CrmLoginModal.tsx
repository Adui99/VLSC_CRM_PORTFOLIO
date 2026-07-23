"use client";

import { useState } from "react";
import { useCrmStore } from "@/store/useCrmStore";
import { Key, Envelope, ArrowRight, Lock } from "@phosphor-icons/react";

export default function CrmLoginModal() {
  const { login, theme } = useCrmStore();
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");

  const isLight = theme === "light";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email);
    if (!success) {
      setError("Tài khoản không tồn tại hoặc đã bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên KTD Team.");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isLight ? "bg-slate-950/70 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border transition-all ${
        isLight 
          ? "bg-white border-slate-200 text-slate-950" 
          : "bg-zinc-900 border-zinc-800 text-zinc-50"
      }`}>
        
        {/* Header with KTD Team Logo (No border frame) */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="KTD Team Logo" 
              className="w-14 h-14 object-contain"
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight">KTD Team Portal</h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">
            Hệ thống Quản lý CRM Nội bộ - KTD Team
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-extrabold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Email Tài Khoản
            </label>
            <div className="relative flex items-center">
              <Envelope size={18} className="absolute left-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all ${
                  isLight 
                    ? "bg-slate-50 border-slate-200 text-slate-950 placeholder:text-slate-400" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Mật Khẩu Access
            </label>
            <div className="relative flex items-center">
              <Key size={18} className="absolute left-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all ${
                  isLight 
                    ? "bg-slate-50 border-slate-200 text-slate-950" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-100"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3.5 rounded-xl font-black bg-amber-500 text-slate-950 hover:bg-amber-600 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            Đăng Nhập Hệ Thống
            <ArrowRight size={18} weight="bold" />
          </button>
        </form>

        {/* Security Notice Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-semibold">
          <Lock size={14} weight="bold" className="text-amber-500" />
          <span>Khu vực truy cập nội bộ được bảo vệ bởi KTD Team</span>
        </div>

      </div>
    </div>
  );
}
