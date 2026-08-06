"use client";

import { useState, useEffect } from "react";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { User, Envelope, Key, Image as ImageIcon, CheckCircle, ArrowCounterClockwise, Sparkle, Warning } from "@phosphor-icons/react";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
];

export default function CrmUserSettings() {
  const { currentUser, updateUserProfile, theme } = useCrmStore();
  const isLight = theme === "light";

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || PRESET_AVATARS[0],
    password: "",
    confirmPassword: "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || PRESET_AVATARS[0],
        password: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleReset = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || PRESET_AVATARS[0],
        password: "",
        confirmPassword: "",
      });
      setSavedSuccess(false);
      setErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg("New Password and Confirm Password do not match. Please verify.");
      return;
    }

    updateUserProfile({
      email: formData.email,
      avatar: formData.avatar,
    });

    setSavedSuccess(true);
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
        isLight ? "bg-white border-slate-200/60 shadow-sm shadow-slate-200/40" : "bg-zinc-900/80 border-zinc-800/60 shadow-sm shadow-black/20"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-zinc-950 font-bold shadow-xs">
              <User size={30} weight="bold" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-zinc-50"}`}>
                Account & Profile Settings
              </h2>
              <p className={`text-sm mt-1 font-medium ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                Customize your personal staff avatar, name, email, and security settings.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Sparkle size={14} /> Optional Customizations
          </span>
        </div>
      </div>

      {/* Success Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle size={20} weight="bold" />
          Profile settings updated successfully!
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm font-bold flex items-center gap-2">
          <Warning size={20} weight="bold" />
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-3xl border space-y-8 transition-colors ${
        isLight ? "bg-white border-slate-200/60 shadow-sm shadow-slate-200/40" : "bg-zinc-900/80 border-zinc-800/60 shadow-sm shadow-black/20"
      }`}>
        
        {/* Avatar Customization */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
            Profile Avatar
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={formData.avatar}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-500/30 shadow-md"
            />

            <div className="flex-1 w-full space-y-3">
              <span className={`text-xs font-semibold ${isLight ? "text-slate-800" : "text-zinc-300"}`}>Choose from Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      formData.avatar === url 
                        ? "border-amber-500 ring-2 ring-amber-500/40 scale-105 shadow-xs" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Custom Image URL Input */}
              <div className="relative flex items-center pt-2">
                <ImageIcon size={17} className="absolute left-3.5 text-slate-400" />
                <input
                  type="url"
                  placeholder="Or paste custom image URL..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/60 font-medium ${
                    isLight ? "bg-slate-50/50 border-slate-200/80 text-slate-800 hover:border-slate-300" : "bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-zinc-700"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-zinc-800/40" />

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Full Name — System Locked */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                Full Name
              </label>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                System Field
              </span>
            </div>
            <div className="relative flex items-center">
              <User size={17} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                disabled
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border font-medium cursor-not-allowed select-none ${
                  isLight
                    ? "bg-slate-50/60 border-slate-200/60 text-slate-500"
                    : "bg-zinc-950/60 border-zinc-800/60 text-zinc-500"
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Email Address
            </label>
            <div className="relative flex items-center">
              <Envelope size={17} className="absolute left-3.5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/60 font-medium ${
                  isLight ? "bg-slate-50/50 border-slate-200/80 text-slate-800 hover:border-slate-300" : "bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-zinc-700"
                }`}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              New Password (Optional)
            </label>
            <div className="relative flex items-center">
              <Key size={17} className="absolute left-3.5 text-slate-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to keep current password"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/60 font-medium ${
                  isLight ? "bg-slate-50/50 border-slate-200/80 text-slate-800 hover:border-slate-300" : "bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-zinc-700"
                }`}
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <Key size={17} className="absolute left-3.5 text-slate-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/60 font-medium ${
                  isLight ? "bg-slate-50/50 border-slate-200/80 text-slate-800 hover:border-slate-300" : "bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-zinc-700"
                }`}
              />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/40">
          <button
            type="button"
            onClick={handleReset}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLight 
                ? "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700 hover:border-slate-300" 
                : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200"
            }`}
          >
            <ArrowCounterClockwise size={15} /> Cancel Changes
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer transition-colors shadow-xs"
          >
            Save Profile Changes
          </button>
        </div>

      </form>

    </div>
  );
}
