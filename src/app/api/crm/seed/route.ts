import { NextResponse } from 'next/server';
import { sql } from '@/core/db/db';
import { LeadStatus } from '@/features/crm/types/crm';

interface RawSeedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companySize?: string;
  role?: string;
  status: LeadStatus;
  dealValue: number;
  source: string;
  message: string;
  assignedTo: string;
  createdAt: string;
  notes?: Array<{ content: string; author: string; createdAt: string }>;
}

const SEED_LEADS: RawSeedLead[] = [
  // NEW LEADS (10)
  {
    id: 'lead-01',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@vinhomes.vn',
    phone: '+84 903 123 456',
    company: 'Vinhomes Digital Services',
    companySize: '500+',
    role: 'Giám đốc Công nghệ (CTO)',
    status: 'new',
    dealValue: 85000,
    source: 'Website Direct',
    message: 'Cần thiết kế lại Cổng thông tin cư dân cao cấp tích hợp WebGL 3D tương tác căn hộ.',
    assignedTo: 'staff-1',
    createdAt: '2026-08-06T09:15:00Z',
    notes: [
      { content: 'Khách hàng gửi yêu cầu đăng ký tư vấn qua Form đính kèm bản mô tả sơ bộ.', author: 'Alex Rivera', createdAt: '2026-08-06T09:20:00Z' }
    ]
  },
  {
    id: 'lead-02',
    name: 'Trần Thị Mai',
    email: 'mai.tran@fpt.com.vn',
    phone: '+84 912 345 678',
    company: 'FPT Software Commerce',
    companySize: '500+',
    role: 'Trưởng phòng Marketing (CMO)',
    status: 'new',
    dealValue: 42000,
    source: 'LinkedIn Outreach',
    message: 'Tìm kiếm đối tác xây dựng bộ 5 Landing Page chuyển đổi cao cho chuỗi sự kiện FPT Techday 2026.',
    assignedTo: 'staff-2',
    createdAt: '2026-08-06T08:30:00Z'
  },
  {
    id: 'lead-03',
    name: 'Phạm Hoàng Nam',
    email: 'nam.pham@techcombank.com.vn',
    phone: '+84 988 765 432',
    company: 'Techcombank Digital Lab',
    companySize: '500+',
    role: 'Product Owner',
    status: 'new',
    dealValue: 95000,
    source: 'Google Ads',
    message: 'Cần tư vấn giải pháp Tích hợp CRM & Automation đồng bộ dữ liệu khách hàng VIP với Core Banking.',
    assignedTo: 'staff-3',
    createdAt: '2026-08-05T16:45:00Z'
  },
  {
    id: 'lead-04',
    name: 'Đỗ Quốc Bảo',
    email: 'bao.do@begroup.com.vn',
    phone: '+84 934 567 890',
    company: 'Be Group Mobility',
    companySize: '201-500',
    role: 'Giám đốc Vận hành (COO)',
    status: 'new',
    dealValue: 65000,
    source: 'Referral',
    message: 'Yêu cầu Redesign toàn bộ giao diện B2B Portal & Dashboard quản trị tài xế doanh nghiệp.',
    assignedTo: 'staff-4',
    createdAt: '2026-08-05T14:10:00Z'
  },
  {
    id: 'lead-05',
    name: 'Lê Thanh Hà',
    email: 'ha.le@sungroup.com.vn',
    phone: '+84 977 112 233',
    company: 'Sun Group Resort & Spas',
    companySize: '500+',
    role: 'Giám đốc Truyền thông',
    status: 'new',
    dealValue: 120000,
    source: 'Event / Seminar',
    message: 'Muốn thiết kế Website thương hiệu hạng sang ứng dụng 3D Canvas giới thiệu dự án Sun Phú Quốc.',
    assignedTo: 'staff-1',
    createdAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'lead-06',
    name: 'Ngô Minh Tuấn',
    email: 'tuan.ngo@tiki.vn',
    phone: '+84 908 998 877',
    company: 'Tiki Corporate',
    companySize: '201-500',
    role: 'Head of Growth',
    status: 'new',
    dealValue: 35000,
    source: 'Facebook Ads',
    message: 'Cần dịch vụ Bảo trì & Nâng cấp Hệ thống Microservices cho chiến dịch Sale 9.9 sắp tới.',
    assignedTo: 'staff-2',
    createdAt: '2026-08-04T15:20:00Z'
  },
  {
    id: 'lead-07',
    name: 'Vũ Thùy Linh',
    email: 'linh.vu@masan.com.vn',
    phone: '+84 918 223 344',
    company: 'Masan Consumer Goods',
    companySize: '500+',
    role: 'Brand Manager',
    status: 'new',
    dealValue: 28000,
    source: 'Website Direct',
    message: 'Tư vấn thiết kế Landing Page ra mắt dòng sản phẩm tiêu dùng cao cấp mới.',
    assignedTo: 'staff-3',
    createdAt: '2026-08-04T11:00:00Z'
  },
  {
    id: 'lead-08',
    name: 'Bùi Đức Anh',
    email: 'anh.bui@beamin.vn',
    phone: '+84 945 667 788',
    company: 'Baemin Tech Vietnam',
    companySize: '51-200',
    role: 'Lead UI/UX Designer',
    status: 'new',
    dealValue: 48000,
    source: 'Partner Channel',
    message: 'Thuê ngoài gói Tối ưu UI/UX & Design System cho hệ thống đối tác nhà hàng.',
    assignedTo: 'staff-4',
    createdAt: '2026-08-03T17:30:00Z'
  },
  {
    id: 'lead-09',
    name: 'Hoàng Kim Oanh',
    email: 'oanh.hoang@shopee.vn',
    phone: '+84 966 334 455',
    company: 'Shopee Vietnam Logistics',
    companySize: '500+',
    role: 'Supply Chain Manager',
    status: 'new',
    dealValue: 72000,
    source: 'LinkedIn Outreach',
    message: 'Cần giải pháp Automation quản lý luồng xử lý phản hồi đơn hàng khiếu nại.',
    assignedTo: 'staff-1',
    createdAt: '2026-08-03T13:15:00Z'
  },
  {
    id: 'lead-10',
    name: 'Đặng Tiến Dũng',
    email: 'dung.dang@viettel.com.vn',
    phone: '+84 983 556 677',
    company: 'Viettel Digital Solutions',
    companySize: '500+',
    role: 'Giám đốc Khối giải pháp',
    status: 'new',
    dealValue: 110000,
    source: 'Event / Seminar',
    message: 'Yêu cầu báo giá gói nâng cấp hạ tầng CRM & thiết kế cổng thông tin B2B Doanh nghiệp.',
    assignedTo: 'staff-2',
    createdAt: '2026-08-02T16:00:00Z'
  },

  // CONTACTED LEADS (12)
  {
    id: 'lead-11',
    name: 'Nguyễn Thị Thu Hương',
    email: 'huong.nguyen@bambooairways.com',
    phone: '+84 902 445 566',
    company: 'Bamboo Airways Hospitality',
    companySize: '500+',
    role: 'Giám đốc Trải nghiệm Khách hàng',
    status: 'contacted',
    dealValue: 55000,
    source: 'Website Direct',
    message: 'Tối ưu UI/UX quy trình đặt vé máy bay trực tuyến và tích hợp chatbot tự động.',
    assignedTo: 'staff-3',
    createdAt: '2026-08-02T10:30:00Z',
    notes: [
      { content: 'Đã gọi điện trao đổi lần 1 với chị Hương. Khách hàng muốn xem Demo mẫu trước.', author: 'Marcus Vance', createdAt: '2026-08-03T09:00:00Z' },
      { content: 'Đã gửi bộ Hồ sơ Năng lực (Profile) và lời mời họp Online thứ 6.', author: 'Marcus Vance', createdAt: '2026-08-04T14:20:00Z' }
    ]
  },
  {
    id: 'lead-12',
    name: 'Phan Văn Huy',
    email: 'huy.phan@kidogroup.vn',
    phone: '+84 913 778 899',
    company: 'Kido Group Food',
    companySize: '500+',
    role: 'Giám đốc Kinh doanh (CCO)',
    status: 'contacted',
    dealValue: 38000,
    source: 'Google Ads',
    message: 'Xây dựng Landing Page thu thập Lead cho hệ thống nhượng quyền thương hiệu.',
    assignedTo: 'staff-4',
    createdAt: '2026-08-01T14:00:00Z',
    notes: [
      { content: 'Đã phản hồi mail xác nhận yêu cầu chi tiết. Chờ đối tác gửi Brand Guidelines.', author: 'Elena Rostova', createdAt: '2026-08-02T11:15:00Z' }
    ]
  },
  {
    id: 'lead-13',
    name: 'Lê Hoàng Yến',
    email: 'yen.le@highlands.com.vn',
    phone: '+84 979 889 900',
    company: 'Highlands Coffee Franchise',
    companySize: '201-500',
    role: 'Head of Marketing',
    status: 'contacted',
    dealValue: 62000,
    source: 'Facebook Ads',
    message: 'Cần nâng cấp phần mềm CRM tích hợp chương trình khách hàng thân thiết.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-31T11:20:00Z',
    notes: [
      { content: 'Đã tư vấn qua điện thoại 30 phút. Khách hàng mong muốn hoàn thành trong Q3.', author: 'Alex Rivera', createdAt: '2026-08-01T10:00:00Z' }
    ]
  },
  {
    id: 'lead-14',
    name: 'Trịnh Quốc Thắng',
    email: 'thang.trinh@vinamilk.com.vn',
    phone: '+84 909 112 244',
    company: 'Vinamilk Enterprise',
    companySize: '500+',
    role: 'IT Director',
    status: 'contacted',
    dealValue: 88000,
    source: 'Referral',
    message: 'Bảo trì hạ tầng hệ thống thông tin B2B và nâng cấp bảo mật dữ liệu.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-30T15:50:00Z',
    notes: [
      { content: 'Đã hẹn gặp trực tiếp tại văn phòng Vinamilk Tower để khảo sát hạ tầng hiện tại.', author: 'Sarah Chen', createdAt: '2026-07-31T16:30:00Z' }
    ]
  },
  {
    id: 'lead-15',
    name: 'Vũ Minh Trí',
    email: 'tri.vu@vng.com.vn',
    phone: '+84 938 445 577',
    company: 'VNG Corporation',
    companySize: '500+',
    role: 'Senior Product Director',
    status: 'contacted',
    dealValue: 75000,
    source: 'LinkedIn Outreach',
    message: 'Cần đội ngũ chuyên nghiệp thiết kế Landing Page Game ra mắt thị trường Đông Nam Á.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-29T13:40:00Z',
    notes: [
      { content: 'Đã gửi bản báo giá sơ bộ và bộ câu hỏi khảo sát tính năng (BRD).', author: 'Marcus Vance', createdAt: '2026-07-30T10:15:00Z' }
    ]
  },
  {
    id: 'lead-16',
    name: 'Bùi Thị Khánh Vân',
    email: 'van.bui@pnj.com.vn',
    phone: '+84 987 665 544',
    company: 'PNJ Jewelry Retail',
    companySize: '500+',
    role: 'Chief Digital Officer',
    status: 'contacted',
    dealValue: 92000,
    source: 'Website Direct',
    message: 'Tích hợp mô hình 3D thử trang sức trực tuyến trên Website e-Commerce.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-28T09:10:00Z',
    notes: [
      { content: 'Khách hàng rất quan tâm tới công nghệ WebGL. Đã gửi Demo 3D mẫu.', author: 'Elena Rostova', createdAt: '2026-07-29T15:00:00Z' }
    ]
  },
  {
    id: 'lead-17',
    name: 'Nguyễn Đức Hùng',
    email: 'hung.nguyen@namlong.com.vn',
    phone: '+84 906 332 211',
    company: 'Nam Long Real Estate',
    companySize: '201-500',
    role: 'Trưởng phòng Marketing Dự án',
    status: 'contacted',
    dealValue: 45000,
    source: 'Google Ads',
    message: 'Thiết kế Website giới thiệu khu đô thị Izumi City tích hợp sa bàn 3D.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-27T16:20:00Z',
    notes: [
      { content: 'Đã kết nối Zalo công việc với anh Hùng. Chờ chốt lịch gặp tuần tới.', author: 'Alex Rivera', createdAt: '2026-07-28T08:30:00Z' }
    ]
  },
  {
    id: 'lead-18',
    name: 'Dương Thu Trang',
    email: 'trang.duong@THmilk.vn',
    phone: '+84 917 554 433',
    company: 'TH True Milk Group',
    companySize: '500+',
    role: 'Supply Chain Coordinator',
    status: 'contacted',
    dealValue: 52000,
    source: 'Event / Seminar',
    message: 'Tự động hóa luồng CRM chăm sóc khách hàng đại lý phân phối.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-26T11:00:00Z',
    notes: [
      { content: 'Đã trao đổi yêu cầu tích hợp với phần mềm SAP hiện có của TH.', author: 'Sarah Chen', createdAt: '2026-07-27T14:45:00Z' }
    ]
  },
  {
    id: 'lead-19',
    name: 'Lý Minh Khoa',
    email: 'khoa.ly@momo.vn',
    phone: '+84 933 119 922',
    company: 'MoMo Fintech Enterprise',
    companySize: '500+',
    role: 'Lead UX Researcher',
    status: 'contacted',
    dealValue: 68000,
    source: 'Partner Channel',
    message: 'Tối ưu UI/UX luồng thanh toán doanh nghiệp trên ứng dụng web.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-25T14:30:00Z',
    notes: [
      { content: 'Đã thực hiện buổi Audit UI/UX sơ bộ và gửi Slide phân tích cho team MoMo.', author: 'Marcus Vance', createdAt: '2026-07-26T16:10:00Z' }
    ]
  },
  {
    id: 'lead-20',
    name: 'Tạ Văn Mạnh',
    email: 'manh.ta@hoa-sen.vn',
    phone: '+84 982 776 655',
    company: 'Tập đoàn Hoa Sen',
    companySize: '500+',
    role: 'Giám đốc Công nghệ thông tin',
    status: 'contacted',
    dealValue: 80000,
    source: 'Website Direct',
    message: 'Nâng cấp toàn bộ hệ thống Portal đặt hàng B2B cho đại lý toàn quốc.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-24T10:15:00Z',
    notes: [
      { content: 'Đã trao đổi tài liệu kỹ thuật API backend. Đang chờ phía Hoa Sen cung cấp Swagger.', author: 'Elena Rostova', createdAt: '2026-07-25T11:00:00Z' }
    ]
  },
  {
    id: 'lead-21',
    name: 'Nguyễn Thành Long',
    email: 'long.nguyen@novaland.com.vn',
    phone: '+84 901 887 766',
    company: 'Novaland Group',
    companySize: '500+',
    role: 'Trưởng nhóm Digital Sales',
    status: 'contacted',
    dealValue: 60000,
    source: 'LinkedIn Outreach',
    message: 'Cần làm 3 Landing Page cho chuỗi biệt thự NovaWorld Phan Thiết.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-23T15:40:00Z',
    notes: [
      { content: 'Đã chốt thời gian họp Demo Wireframe sơ bộ vào thứ 3 tới.', author: 'Alex Rivera', createdAt: '2026-07-24T13:30:00Z' }
    ]
  },
  {
    id: 'lead-22',
    name: 'Hà Thị Kim Ngân',
    email: 'ngan.ha@retes.vn',
    phone: '+84 914 332 255',
    company: 'Reecorp Engineering',
    companySize: '201-500',
    role: 'Operations Director',
    status: 'contacted',
    dealValue: 32000,
    source: 'Google Ads',
    message: 'Bảo trì nâng cấp website doanh nghiệp và tối ưu tốc độ tải trang.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-22T08:50:00Z',
    notes: [
      { content: 'Đã gửi báo cáo kiểm thử PageSpeed & đề xuất phương án tối ưu.', author: 'Sarah Chen', createdAt: '2026-07-23T09:45:00Z' }
    ]
  },

  // IN NEGOTIATION LEADS (12)
  {
    id: 'lead-23',
    name: 'Trần Hoàng Gia',
    email: 'gia.tran@ssi.com.vn',
    phone: '+84 904 991 122',
    company: 'Chứng khoán SSI',
    companySize: '500+',
    role: 'Giám đốc Khối Công nghệ',
    status: 'in_negotiation',
    dealValue: 115000,
    source: 'Referral',
    message: 'Đàm phán hợp đồng thiết kế lại Nền tảng Giao dịch Chứng khoán WebGL & Realtime Dashboard.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-21T10:00:00Z',
    notes: [
      { content: 'Đã bảo vệ thành công phương án giải pháp kỹ thuật trước Ban Giám Đốc SSI.', author: 'Marcus Vance', createdAt: '2026-07-25T15:00:00Z' },
      { content: 'Đang thương lượng điều khoản thanh toán 40-40-20 và thời hạn bảo hành 12 tháng.', author: 'Marcus Vance', createdAt: '2026-08-02T16:30:00Z' }
    ]
  },
  {
    id: 'lead-24',
    name: 'Phạm Thị Bích Ngọc',
    email: 'ngoc.pham@vietjetair.com',
    phone: '+84 919 667 788',
    company: 'Vietjet Air Commercial',
    companySize: '500+',
    role: 'Head of Ancillary Revenue',
    status: 'in_negotiation',
    dealValue: 98000,
    source: 'Website Direct',
    message: 'Thương thảo hợp đồng Tích hợp CRM Automation cá nhân hóa ưu đãi phụ thu cho hành khách.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-20T14:15:00Z',
    notes: [
      { content: 'Đã thống nhất scope công việc. Phía pháp lý Vietjet đang thẩm định hợp đồng mẫu.', author: 'Elena Rostova', createdAt: '2026-08-01T11:20:00Z' }
    ]
  },
  {
    id: 'lead-25',
    name: 'Nguyễn Quốc Huy',
    email: 'huy.nguyen@chotot.vn',
    phone: '+84 978 223 311',
    company: 'Cho Tot Marketplace',
    companySize: '201-500',
    role: 'VP of Product',
    status: 'in_negotiation',
    dealValue: 70000,
    source: 'LinkedIn Outreach',
    message: 'Thương lượng chi phí gói Redesign UI/UX chuyên sâu toàn bộ giao diện Chợ Tốt Xe.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-19T09:30:00Z',
    notes: [
      { content: 'Khách hàng đề nghị giảm 8% chi phí. Đang trình ý kiến Quản lý phê duyệt.', author: 'Alex Rivera', createdAt: '2026-08-03T14:00:00Z' }
    ]
  },
  {
    id: 'lead-26',
    name: 'Lê Văn Thái',
    email: 'thai.le@hdbank.com.vn',
    phone: '+84 907 889 911',
    company: 'HDBank Digital Center',
    companySize: '500+',
    role: 'Giám đốc Dự án Chuyển đổi số',
    status: 'in_negotiation',
    dealValue: 105000,
    source: 'Event / Seminar',
    message: 'Tương tác đàm phán xây dựng Portal chăm sóc khách hàng doanh nghiệp SME.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-18T16:00:00Z',
    notes: [
      { content: 'Đã hoàn thiện Phụ lục SLA cam kết thời gian phản hồi sự cố 24/7.', author: 'Sarah Chen', createdAt: '2026-08-04T10:30:00Z' }
    ]
  },
  {
    id: 'lead-27',
    name: 'Đỗ Thị Minh Anh',
    email: 'anh.do@lotte.vn',
    phone: '+84 937 443 322',
    company: 'Lotte Vietnam Shopping',
    companySize: '500+',
    role: 'Marketing Director',
    status: 'in_negotiation',
    dealValue: 58000,
    source: 'Google Ads',
    message: 'Đàm phán chi tiết gói Thiết kế Landing Page & Game tương tác nhận quà dịp Trung Thu.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-17T11:45:00Z',
    notes: [
      { content: 'Đã chốt thiết kế ý tưởng Demo. Chờ chốt ngày ký hợp đồng thức thời.', author: 'Marcus Vance', createdAt: '2026-08-02T09:15:00Z' }
    ]
  },
  {
    id: 'lead-28',
    name: 'Vũ Quốc Khánh',
    email: 'khanh.vu@vpbank.com.vn',
    phone: '+84 981 334 422',
    company: 'VPBank SME Division',
    companySize: '500+',
    role: 'Senior Partnership Manager',
    status: 'in_negotiation',
    dealValue: 82000,
    source: 'Partner Channel',
    message: 'Đàm phán hợp đồng cung cấp dịch vụ Bảo trì & Nâng cấp Hệ thống CRM định kỳ.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-16T13:20:00Z',
    notes: [
      { content: 'Đã gửi bản dự thảo hợp đồng lần 2 sau khi bổ sung điều khoản bảo mật NDA.', author: 'Elena Rostova', createdAt: '2026-08-01T15:45:00Z' }
    ]
  },
  {
    id: 'lead-29',
    name: 'Hoàng Văn Sơn',
    email: 'son.hoang@dothouse.vn',
    phone: '+84 903 881 199',
    company: 'Đất Xanh Services',
    companySize: '201-500',
    role: 'Chief Technology Officer',
    status: 'in_negotiation',
    dealValue: 76000,
    source: 'Website Direct',
    message: 'Đàm phán triển khai WebGL 3D tour cho các dự án bất động sản căn hộ.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-15T15:10:00Z',
    notes: [
      { content: 'Đối tác đã đồng ý bảng giá, đang đợi thẩm định năng lực nhà thầu từ hội đồng.', author: 'Alex Rivera', createdAt: '2026-07-30T11:00:00Z' }
    ]
  },
  {
    id: 'lead-30',
    name: 'Bùi Phương Thảo',
    email: 'thao.bui@elisa.vn',
    phone: '+84 912 667 799',
    company: 'Elise Fashion Corporate',
    companySize: '51-200',
    role: 'E-commerce Manager',
    status: 'in_negotiation',
    dealValue: 40000,
    source: 'Facebook Ads',
    message: 'Đàm phán làm mới website thời trang kết hợp hệ thống gợi ý size AI.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-14T09:00:00Z',
    notes: [
      { content: 'Hai bên đang thương lượng giảm thời gian triển khai từ 60 ngày xuống 45 ngày.', author: 'Sarah Chen', createdAt: '2026-07-28T14:00:00Z' }
    ]
  },
  {
    id: 'lead-31',
    name: 'Trần Văn Nam',
    email: 'nam.tran@phuc-long.com.vn',
    phone: '+84 976 554 411',
    company: 'Phúc Long Heritage',
    companySize: '201-500',
    role: 'Brand Experience Manager',
    status: 'in_negotiation',
    dealValue: 50000,
    source: 'Referral',
    message: 'Đàm phán xây dựng App Web tích hợp CRM đặt lịch và thanh toán trả trước.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-13T14:30:00Z',
    notes: [
      { content: 'Đã gửi phụ lục báo giá chi tiết từng giai đoạn phát triển.', author: 'Marcus Vance', createdAt: '2026-07-29T10:00:00Z' }
    ]
  },
  {
    id: 'lead-32',
    name: 'Nguyễn Thị Hồng Hạnh',
    email: 'hanh.nguyen@nhamy.vn',
    phone: '+84 908 443 322',
    company: 'Nhà Bè Garment Corporation',
    companySize: '500+',
    role: 'Giám đốc Xuất nhập khẩu',
    status: 'in_negotiation',
    dealValue: 64000,
    source: 'LinkedIn Outreach',
    message: 'Thương lượng gói Bảo trì & Tối ưu bảo mật Portal khách hàng quốc tế.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-12T10:40:00Z',
    notes: [
      { content: 'Khách hàng chuẩn bị gửi bản Hợp đồng nguyên tắc đã duyệt.', author: 'Elena Rostova', createdAt: '2026-07-27T16:20:00Z' }
    ]
  },
  {
    id: 'lead-33',
    name: 'Lê Quốc Bảo',
    email: 'bao.le@saigon-coop.com.vn',
    phone: '+84 918 998 811',
    company: 'Saigon Co.op Mart',
    companySize: '500+',
    role: 'Head of IT Infrastructure',
    status: 'in_negotiation',
    dealValue: 89000,
    source: 'Event / Seminar',
    message: 'Thương thảo giải pháp CRM Automation quản lý hơn 1 triệu hội viên thân thiết.',
    assignedTo: 'staff-1',
    createdAt: '2026-07-11T16:15:00Z',
    notes: [
      { content: 'Đã tổ chức họp trực tiếp chốt lộ trình chuyển đổi dữ liệu từ hệ thống cũ.', author: 'Alex Rivera', createdAt: '2026-07-26T15:30:00Z' }
    ]
  },
  {
    id: 'lead-34',
    name: 'Phạm Hồng Ánh',
    email: 'anh.pham@concung.com.vn',
    phone: '+84 934 221 100',
    company: 'Con Cung Retail Enterprise',
    companySize: '500+',
    role: 'Chief Marketing Officer',
    status: 'in_negotiation',
    dealValue: 46000,
    source: 'Google Ads',
    message: 'Đàm phán chuỗi Landing Page khuyến mãi lớn sinh nhật 10 năm.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-10T11:20:00Z',
    notes: [
      { content: 'Khách hàng yêu cầu cam kết tải trang dưới 1.5 giây trên thiết bị di động.', author: 'Sarah Chen', createdAt: '2026-07-25T09:00:00Z' }
    ]
  },

  // CLOSED WON LEADS (10)
  {
    id: 'lead-35',
    name: 'Vũ Thị Ngọc Hà',
    email: 'ha.vu@thaco.com.vn',
    phone: '+84 903 665 544',
    company: 'THACO Auto Industries',
    companySize: '500+',
    role: 'Giám đốc Công nghệ & Truyền thông',
    status: 'closed_won',
    dealValue: 135000,
    source: 'Referral',
    message: 'Đã ký hợp đồng thành công: Thiết kế Website & WebGL 3D Showroom ô tô hạng sang.',
    assignedTo: 'staff-3',
    createdAt: '2026-06-15T09:00:00Z',
    notes: [
      { content: 'Đã nhận tạm ứng 50% giá trị hợp đồng. Đã khởi tạo dự án trên JIRA.', author: 'Marcus Vance', createdAt: '2026-06-25T11:00:00Z' },
      { content: 'Đã nghiệm thu Giai đoạn 1 (Wireframe & Design Tokens).', author: 'Marcus Vance', createdAt: '2026-07-15T16:00:00Z' }
    ]
  },
  {
    id: 'lead-36',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@hsg.vn',
    phone: '+84 913 221 144',
    company: 'Tập đoàn Hòa Phát',
    companySize: '500+',
    role: 'Trưởng ban PR & Marketing',
    status: 'closed_won',
    dealValue: 98000,
    source: 'Website Direct',
    message: 'Đã ký hợp đồng: Redesign & Tối ưu UI/UX Cổng thông tin Cổ đông & Nhà đầu tư.',
    assignedTo: 'staff-4',
    createdAt: '2026-06-18T14:30:00Z',
    notes: [
      { content: 'Hợp đồng chính thức được phê duyệt và đóng dấu đỏ hai bên.', author: 'Elena Rostova', createdAt: '2026-06-28T10:15:00Z' }
    ]
  },
  {
    id: 'lead-37',
    name: 'Trần Thanh Tùng',
    email: 'tung.tran@mbbank.com.vn',
    phone: '+84 988 332 211',
    company: 'MBBank Digital Banking',
    companySize: '500+',
    role: 'Head of Customer Experience',
    status: 'closed_won',
    dealValue: 110000,
    source: 'LinkedIn Outreach',
    message: 'Đã ký hợp đồng: Tích hợp CRM & Automation quản lý tệp khách hàng Priority.',
    assignedTo: 'staff-1',
    createdAt: '2026-06-20T10:10:00Z',
    notes: [
      { content: 'Đã bàn giao tài khoản CRM thử nghiệm cho 20 Sales Manager của MBBank.', author: 'Alex Rivera', createdAt: '2026-07-10T14:00:00Z' }
    ]
  },
  {
    id: 'lead-38',
    name: 'Lê Hoàng Anh',
    email: 'anh.le@tpb.com.vn',
    phone: '+84 909 554 433',
    company: 'TPBank LiveBank',
    companySize: '500+',
    role: 'Chief Technology Officer',
    status: 'closed_won',
    dealValue: 85000,
    source: 'Partner Channel',
    message: 'Đã ký hợp đồng: Bảo trì & Nâng cấp Hệ thống Kiosk tương tác số.',
    assignedTo: 'staff-2',
    createdAt: '2026-06-22T16:00:00Z',
    notes: [
      { content: 'Đã hoàn thành đợt cập nhật phần mềm quý 2, hệ thống chạy ổn định 99.99%.', author: 'Sarah Chen', createdAt: '2026-07-20T09:30:00Z' }
    ]
  },
  {
    id: 'lead-39',
    name: 'Phạm Minh Châu',
    email: 'chau.pham@grab.com',
    phone: '+84 938 112 299',
    company: 'Grab Vietnam Enterprise',
    companySize: '500+',
    role: 'Head of B2B Marketing',
    status: 'closed_won',
    dealValue: 54000,
    source: 'Google Ads',
    message: 'Đã ký hợp đồng: Chuỗi 4 Landing Page thu hút doanh nghiệp đối tác GrabExpress.',
    assignedTo: 'staff-3',
    createdAt: '2026-06-25T11:20:00Z',
    notes: [
      { content: 'Đã nghiệm thu hoàn tất và nhận 100% thanh toán.', author: 'Marcus Vance', createdAt: '2026-07-25T17:00:00Z' }
    ]
  },
  {
    id: 'lead-40',
    name: 'Đặng Hoàng Nam',
    email: 'nam.dang@zalopay.vn',
    phone: '+84 977 443 311',
    company: 'ZaloPay Merchant Services',
    companySize: '500+',
    role: 'Senior Product Manager',
    status: 'closed_won',
    dealValue: 78000,
    source: 'Event / Seminar',
    message: 'Đã ký hợp đồng: Tối ưu UI/UX & phát triển Web Portal quản trị đối tác thanh toán.',
    assignedTo: 'staff-4',
    createdAt: '2026-06-28T13:40:00Z',
    notes: [
      { content: 'Dự án đã bàn giao đúng tiến độ, khách hàng đánh giá 5 sao về chất lượng UI.', author: 'Elena Rostova', createdAt: '2026-07-30T15:00:00Z' }
    ]
  },
  {
    id: 'lead-41',
    name: 'Ngô Thanh Sơn',
    email: 'son.ngo@vietcombank.com.vn',
    phone: '+84 902 776 611',
    company: 'Vietcombank Securities',
    companySize: '500+',
    role: 'Giám đốc Công nghệ Số',
    status: 'closed_won',
    dealValue: 125000,
    source: 'Referral',
    message: 'Đã ký hợp đồng: Thiết kế lại Portal giao dịch tài chính tích hợp WebGL 3D.',
    assignedTo: 'staff-1',
    createdAt: '2026-06-30T09:30:00Z',
    notes: [
      { content: 'Đã ký biên bản nghiệm thu kỹ thuật giai đoạn 2.', author: 'Alex Rivera', createdAt: '2026-08-01T11:00:00Z' }
    ]
  },
  {
    id: 'lead-42',
    name: 'Bùi Mỹ Linh',
    email: 'linh.bui@samsung.com',
    phone: '+84 918 332 200',
    company: 'Samsung Electronics Vietnam',
    companySize: '500+',
    role: 'Senior Brand Manager',
    status: 'closed_won',
    dealValue: 92000,
    source: 'Website Direct',
    message: 'Đã ký hợp đồng: Thiết kế Website trải nghiệm sản phẩm Galaxy Z Fold 3D Canvas.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-02T15:00:00Z',
    notes: [
      { content: 'Khách hàng rất hài lòng với chất lượng rendering WebGL mượt mà 60fps.', author: 'Sarah Chen', createdAt: '2026-08-02T14:20:00Z' }
    ]
  },
  {
    id: 'lead-43',
    name: 'Hoàng Quốc Việt',
    email: 'viet.hoang@cargill.com',
    phone: '+84 983 221 199',
    company: 'Cargill Vietnam Agricultural',
    companySize: '500+',
    role: 'IT Operation Lead',
    status: 'closed_won',
    dealValue: 68000,
    source: 'LinkedIn Outreach',
    message: 'Đã ký hợp đồng: Bảo trì & Nâng cấp Hệ thống quản lý kho vận B2B.',
    assignedTo: 'staff-3',
    createdAt: '2026-07-04T10:15:00Z',
    notes: [
      { content: 'Đã triển khai thành công bản vá bảo mật và tối ưu cơ sở dữ liệu.', author: 'Marcus Vance', createdAt: '2026-08-03T16:00:00Z' }
    ]
  },
  {
    id: 'lead-44',
    name: 'Trịnh Thị Mai Anh',
    email: 'anh.trinh@unilever.com',
    phone: '+84 908 667 722',
    company: 'Unilever Vietnam Corporate',
    companySize: '500+',
    role: 'Sustainable Development Director',
    status: 'closed_won',
    dealValue: 45000,
    source: 'Facebook Ads',
    message: 'Đã ký hợp đồng: Landing Page báo cáo phát triển bền vững ESG 2026.',
    assignedTo: 'staff-4',
    createdAt: '2026-07-05T14:40:00Z',
    notes: [
      { content: 'Đã hoàn tất bàn giao mã nguồn và tài liệu hướng dẫn quản trị.', author: 'Elena Rostova', createdAt: '2026-08-04T11:30:00Z' }
    ]
  },

  // CLOSED LOST LEADS (6)
  {
    id: 'lead-45',
    name: 'Lê Văn Cường',
    email: 'cuong.le@smallbiz.vn',
    phone: '+84 905 112 233',
    company: 'Cường Phát Logistics',
    companySize: '1-10',
    role: 'Chủ doanh nghiệp',
    status: 'closed_lost',
    dealValue: 12000,
    source: 'Facebook Ads',
    message: 'Tìm kiếm gói thiết kế website giá rẻ dưới 10 triệu đồng.',
    assignedTo: 'staff-1',
    createdAt: '2026-06-10T08:00:00Z',
    notes: [
      { content: 'Ngân sách của khách quá thấp so với chi phí tối thiểu của công ty ($1,500). Đã từ chối khéo.', author: 'Alex Rivera', createdAt: '2026-06-11T09:30:00Z' }
    ]
  },
  {
    id: 'lead-46',
    name: 'Phạm Thị Như Quỳnh',
    email: 'quynh.pham@startupxyz.io',
    phone: '+84 914 998 877',
    company: 'XYZ Tech Startup',
    companySize: '11-50',
    role: 'Co-Founder',
    status: 'closed_lost',
    dealValue: 25000,
    source: 'Google Ads',
    message: 'Yêu cầu làm App Mobile native cho cả iOS và Android trong 2 tuần.',
    assignedTo: 'staff-2',
    createdAt: '2026-06-12T11:30:00Z',
    notes: [
      { content: 'Thời gian yêu cầu quá gấp (2 tuần) không đảm bảo chất lượng kỹ thuật. Đã dừng thương lượng.', author: 'Sarah Chen', createdAt: '2026-06-14T10:00:00Z' }
    ]
  },
  {
    id: 'lead-47',
    name: 'Đỗ Minh Tuấn',
    email: 'tuan.do@tradingsome.com',
    phone: '+84 978 443 322',
    company: 'Thương mại Đỗ Gia',
    companySize: '1-10',
    role: 'Giám đốc',
    status: 'closed_lost',
    dealValue: 18000,
    source: 'Website Direct',
    message: 'Yêu cầu làm website bán hàng giống hệt Lazada nhưng chi phí thấp.',
    assignedTo: 'staff-3',
    createdAt: '2026-06-15T15:20:00Z',
    notes: [
      { content: 'Khách hàng chọn đơn vị freelance làm với giá rẻ hơn.', author: 'Marcus Vance', createdAt: '2026-06-18T14:15:00Z' }
    ]
  },
  {
    id: 'lead-48',
    name: 'Trần Thị Thu Thảo',
    email: 'thao.tran@spa-beauty.vn',
    phone: '+84 902 334 455',
    company: 'Thảo Beauty Academy',
    companySize: '11-50',
    role: 'Quản lý Spa',
    status: 'closed_lost',
    dealValue: 15000,
    source: 'Facebook Ads',
    message: 'Cần thiết kế Landing Page chạy quảng cáo dịch vụ tắm trắng.',
    assignedTo: 'staff-4',
    createdAt: '2026-06-20T10:00:00Z',
    notes: [
      { content: 'Dịch vụ thuộc danh mục nhạy cảm không phù hợp định hướng dự án B2B của cty.', author: 'Elena Rostova', createdAt: '2026-06-21T11:45:00Z' }
    ]
  },
  {
    id: 'lead-49',
    name: 'Vũ Hoàng Phong',
    email: 'phong.vu@investcorp.vn',
    phone: '+84 919 112 288',
    company: 'Phong Lê Investment',
    companySize: '1-10',
    role: 'Nhà đầu tư cá nhân',
    status: 'closed_lost',
    dealValue: 30000,
    source: 'LinkedIn Outreach',
    message: 'Yêu cầu làm website gọi vốn tiền ảo ICO.',
    assignedTo: 'staff-1',
    createdAt: '2026-06-25T14:10:00Z',
    notes: [
      { content: 'Không đáp ứng tiêu chuẩn pháp lý Việt Nam. Hủy giao dịch.', author: 'Alex Rivera', createdAt: '2026-06-26T09:00:00Z' }
    ]
  },
  {
    id: 'lead-50',
    name: 'Nguyễn Thị Hải Yến',
    email: 'yen.nguyen@duhocabc.edu.vn',
    phone: '+84 987 554 433',
    company: 'Tư vấn Du học ABC',
    companySize: '11-50',
    role: 'Giám đốc Trung tâm',
    status: 'closed_lost',
    dealValue: 20000,
    source: 'Google Ads',
    message: 'Thiết kế website tư vấn du học Úc và Canada.',
    assignedTo: 'staff-2',
    createdAt: '2026-07-01T16:30:00Z',
    notes: [
      { content: 'Khách hàng hủy dự án do tạm hoãn kế hoạch tuyển sinh quý 3.', author: 'Sarah Chen', createdAt: '2026-07-05T10:20:00Z' }
    ]
  }
];

export async function POST() {
  try {
    // 1. Clean existing tables
    await sql`DELETE FROM lead_notes;`;
    await sql`DELETE FROM leads;`;

    // 2. Insert 50 new rich leads
    for (const lead of SEED_LEADS) {
      await sql`
        INSERT INTO leads (
          id, name, email, phone, company, status, deal_value, source, message, created_at, assigned_to
        )
        VALUES (
          ${lead.id}, 
          ${lead.name}, 
          ${lead.email}, 
          ${lead.phone}, 
          ${lead.company}, 
          ${lead.status}, 
          ${lead.dealValue}, 
          ${lead.source}, 
          ${lead.message}, 
          ${lead.createdAt}, 
          ${lead.assignedTo}
        );
      `;

      if (lead.notes && lead.notes.length > 0) {
        for (const note of lead.notes) {
          const noteId = `note-${crypto.randomUUID()}`;
          await sql`
            INSERT INTO lead_notes (id, lead_id, content, author, created_at)
            VALUES (${noteId}, ${lead.id}, ${note.content}, ${note.author}, ${note.createdAt});
          `;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaned database and seeded 50 realistic Vietnamese CRM leads successfully!',
      count: SEED_LEADS.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error seeding CRM leads:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
