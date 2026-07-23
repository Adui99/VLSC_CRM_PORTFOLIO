"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useModalStore } from "@/store/useModalStore";
import { useCrmStore } from "@/store/useCrmStore";
import { useState } from "react";

export default function LeadModal() {
  const { isOpen, closeModal } = useModalStore();
  const addLead = useCrmStore((state) => state.addLead);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxemmrMl182B1Wag6mJ7Jcoa5ZpUwsJA7EsPhPHokFYXooZeGRjOwt9XAPxgG_PlMDaTg/exec";
      
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        }
      }).catch((err) => console.error("GAS error:", err));

      // Sync lead directly to CRM store
      addLead({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: "Landing Page Modal",
        dealValue: 15000,
        status: "new"
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      setTimeout(() => {
        closeModal();
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative pointer-events-auto"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={24} weight="bold" />
              </button>

              <h2 className="text-3xl font-bold text-zinc-50 mb-2">Let's talk</h2>
              <p className="text-zinc-400 mb-8">Drop me a line and I'll get back to you as soon as possible.</p>

              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-50">Message Sent!</h3>
                  <p className="text-zinc-400">Thanks for reaching out.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300">Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>
                  
                  <button 
                    disabled={status === "loading"}
                    type="submit"
                    className="mt-4 bg-amber-500 text-zinc-950 font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
