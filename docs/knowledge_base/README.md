# Knowledge Base — AI Chatbot Tư vấn

## Mục đích

Bộ tài liệu này phục vụ làm **Knowledge Base (RAG)** và **System Prompt (cho Gemma v4/v3)** cho AI chatbot tư vấn khách hàng tiềm năng trên Landing Page.

- **Đối tượng**: Khách hàng B2B/B2C ghé thăm website, cần tìm hiểu dịch vụ, công nghệ, dự án và cách liên hệ.
- **Ngôn ngữ**: Tiếng Việt | **Giọng điệu**: Chuyên nghiệp B2B (xưng "tôi", gọi "anh/chị").

---

## Phân Tách Kiến Trúc Tối Ưu Cho Dify Cloud

Để đảm bảo hiệu năng RAG cao nhất và đạt chuẩn Dify Chunking Engine:

### 1. Knowledge Base (`knowledge_base_full.md`)
- **Vị trí**: Upload làm file dữ liệu trong **Dify Knowledge Base**.
- **Tiêu chuẩn cấu trúc**:
  - Dạng **Semantic Markdown** với các tiêu đề `###` phân lập từng chủ đề dưới 400 ký tự.
  - **KHÔNG quy định mốc thời gian (Timeline)** hay con số báo giá cố định.
  - Chỉ chứa dữ liệu thực tế: Thông tin công ty, 5 Dịch vụ cốt lõi, Công nghệ & Tiêu chuẩn, Portfolio & Nhận xét khách hàng, Quy trình 4 bước, FAQ và Hướng dẫn điền form.

### 2. System Prompt Cho Gemma v4 (`system_prompt_dify.md`)
- **Vị trí**: Dán vào ô **Instructions / System Prompt** trong cấu hình **Dify Chatbot App**.
- **Quy tắc vận hành**:
  - **Strict RAG Workflow**: Bắt buộc tìm kiếm KB; chỉ dùng thông tin từ KB; không tự đoán timeline/giá.
  - **Xử lý thiếu thông tin**: Hướng dẫn khách hàng điền form tư vấn hoặc gửi email `duy.hoang030199@gmail.com`.
  - **Kịch bản hội thoại 6 bước**: Chào mở đầu → Khai phá nhu cầu → Đề xuất dịch vụ → Giải đáp thắc mắc → Tóm tắt phương án → CTA & Thu thập Contact.

---

## Cấu hình khuyến nghị khi Upload lên Dify Knowledge Base

1. **Chunking Setting**: Custom (hoặc Automatic). Chunk Length để **500 – 1000** ký tự.
2. **Text Preprocessing Rules**: **BỎ CHỌN (Uncheck)** mục *"Replace consecutive spaces, newlines and tabs"*. Việc giữ lại dấu xuống dòng `\n\n` giúp Dify giữ nguyên định dạng Semantic Markdown.
3. **Indexing Method**: **High Quality** với Embedding Model `jina-embeddings-v3`.

---

## Nguồn dữ liệu

Toàn bộ knowledge base được trích xuất từ codebase dự án:
- `src/features/landing/components/` — Nội dung Landing Page
- `src/features/crm/utils/calculateLeadScore.ts` — Logic chấm điểm lead
- `src/features/crm/types/crm.ts` — Định nghĩa kiểu dữ liệu
- `docs/specs/landing/PRD.md` — Product Requirements
- `docs/specs/crm/PRD.md` — CRM Requirements

