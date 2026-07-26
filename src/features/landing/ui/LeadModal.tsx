"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useModalStore } from "@/shared/store/useModalStore";
import { useCrmStore } from "@/features/crm/store/useCrmStore";
import { useState } from "react";
import { isCorporateEmail } from "@/features/crm/utils/calculateLeadScore";

export default function LeadModal() {
  const { isOpen, closeModal } = useModalStore();
  const addLead = useCrmStore((state) => state.addLead);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    company: "",
    role: "Staff",
    companySize: "1-10",
    services: [] as string[],
    message: "" 
  });

  const isCorp = isCorporateEmail(formData.email);

  const WORK_SERVICES_OPTIONS = [
    "Thiết kế Website & WebGL",
    "Thiết kế Landing Page",
    "Redesign & Tối ưu UI/UX",
    "Bảo trì & Nâng cấp Hệ thống",
    "Tích hợp CRM & Automation",
  ];

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      const newServices = exists
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

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

      // Sync lead directly to CRM store (auto scoring happens in store)
      addLead({
        name: formData.name,
        email: formData.email,
        emailType: isCorp ? "company" : "personal",
        phone: formData.phone,
        company: formData.company,
        role: formData.role,
        companySize: formData.companySize,
        services: formData.services,
        message: formData.message,
        source: "Landing Page Modal",
        dealValue: formData.services.length > 0 ? formData.services.length * 8000 : 15000,
        status: "new"
      });

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", role: "Staff", companySize: "1-10", services: [], message: "" });
      
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
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative pointer-events-auto"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={24} weight="bold" />
              </button>

              <h2 className="text-3xl font-bold text-zinc-50 mb-2">Đăng ký Tư vấn</h2>
              <p className="text-zinc-400 mb-6 text-sm">Điền thông tin bên dưới để nhận báo giá & tư vấn giải pháp từ KTD Team.</p>

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
                  <h3 className="text-xl font-bold text-zinc-50">Đã gửi thành công!</h3>
                  <p className="text-zinc-400">Đội ngũ chuyên gia sẽ liên hệ lại với bạn sớm nhất.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  {/* Họ tên & SĐT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Họ và tên <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        required
                        type="text" 
                        placeholder="Nguyen Van A"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Số điện thoại / Zalo <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        required
                        type="tel" 
                        placeholder="0987654321"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Tên doanh nghiệp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">
                          Email <span className="text-red-500 font-bold">*</span>
                        </label>
                        {/* Render ONLY corporate email badge */}
                        {isCorp && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs">
                            🏢 Email Công ty
                          </span>
                        )}
                      </div>
                      <input 
                        required
                        type="email" 
                        placeholder={isCorp ? "name@company.com" : "name@gmail.com"}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Tên Doanh nghiệp <span className="text-zinc-500 text-[11px] font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Acme Corporation"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Services Interested In (Multi-select synced with Selected Works) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Dịch vụ / Hạng mục quan tâm <span className="text-zinc-500 text-[11px] font-normal">(Tick chọn 1 hoặc nhiều)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {WORK_SERVICES_OPTIONS.map((service) => {
                        const isChecked = formData.services.includes(service);
                        return (
                          <label
                            key={service}
                            onClick={() => toggleService(service)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
                              isChecked
                                ? "bg-amber-500/15 border-amber-500/60 text-amber-300"
                                : "bg-zinc-950 border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="accent-amber-500 rounded cursor-pointer"
                            />
                            <span>{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chức vụ & Quy mô */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Chức vụ <span className="text-zinc-500 text-[11px] font-normal">(Optional)</span></label>
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="CEO/Director">CEO / Founder / Giám đốc</option>
                        <option value="Manager">Manager / Trưởng phòng</option>
                        <option value="Staff">Nhân viên / Khác</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Quy mô Doanh nghiệp <span className="text-zinc-500 text-[11px] font-normal">(Optional)</span></label>
                      <select 
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="1-10">1 - 10 nhân sự</option>
                        <option value="11-50">11 - 50 nhân sự</option>
                        <option value="50+">Trên 50 nhân sự</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Lời nhắn / Nhu cầu chi tiết <span className="text-zinc-500 text-[11px] font-normal">(Optional)</span></label>
                    <textarea 
                      rows={3}
                      placeholder="Mô tả nhu cầu triển khai CRM, báo giá, hoặc hệ thống hiện tại của bạn..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>
                  
                  <button 
                    disabled={status === "loading"}
                    type="submit"
                    className="mt-2 bg-amber-500 text-zinc-950 font-extrabold py-3.5 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    {status === "loading" ? "Đang gửi..." : "Đăng ký Nhận Báo giá & Tư vấn"}
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
