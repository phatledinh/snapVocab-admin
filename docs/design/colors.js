/**
 * SnapVocab Design Tokens — JavaScript Token Object
 * Source of Truth: docs/design.md
 * Hệ thống token dùng chung cho Web Admin (snapAdmin) và Mobile App (snapVocab).
 */

module.exports = {
  white: '#ffffff',
  black: '#000000',

  // 1. Surface & Canvas (Tối ưu cho Data-Dense Operator UI)
  canvas: {
    background: '#F8F9F7',    // Off-white canvas, chống mỏi mắt cho operator
    surface: '#FFFFFF',       // Khối thẻ, sheet, modal, mobile simulator
    surfaceSubtle: '#F3F4F6', // Nền input, list hover, drawer footer
    border: '#E5E7EB',        // Đường viền ngăn cách mảnh (1px)
    borderStrong: '#D1D5DB',  // Viền active/focused
  },

  // 2. Text Hierarchy
  text: {
    DEFAULT: '#171717',       // Văn bản chính, tiêu đề (tương phản cao)
    muted: '#6B7280',         // Nhãn phụ, giải thích, thời gian
    light: '#9CA3AF',         // Placeholder, icon chưa active
    inverse: '#FFFFFF',       // Chữ trắng trên nền đậm
  },

  // 3. Neutral Palette (50 = sáng nhất, 900 = tối nhất)
  neutral: {
    50: '#F8F9F7',
    100: '#EEEFF3',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // 4. Primary Green — #58CC02: CTA chính, Duyệt (Approve/Publish), Tiến độ SRS
  primary: {
    50: '#F0FCE4',
    100: '#DEF7C4',
    200: '#C2EE96',
    300: '#A0E063',
    400: '#7DD634',
    500: '#58CC02', // Main Brand & Action Color
    600: '#46A302', // Hover
    700: '#3C8C00',
    800: '#2F6E00',
    900: '#1F4A00',
  },

  // 5. Mascot & Snapy Orange — #FF8A00: Mascot, Chuỗi Streak, Tính năng AI Scan. (Cấm làm CTA)
  mascot: {
    50: '#FFF8EF',
    100: '#FFF3E0',
    200: '#FFDDB3',
    300: '#FFC685',
    400: '#FFB65C',
    500: '#FF8A00', // Main Snapy & Streak
    600: '#E07A00', // Hover
    700: '#B35F00',
    800: '#A75C21',
    900: '#663700',
    fur: '#FF8A00',
    cream: '#FFF3E0',
    brown: '#A75C21',
    navy: '#1E2A44',
  },

  // 6. Reward Gold — #FFC42E: Kinh tế ảo (Coin/Gem), Cửa hàng (Shop), Rương, Level Up
  reward: {
    50: '#FFF9E6',
    100: '#FFEFB8',
    200: '#FFE594',
    300: '#FFDA6B',
    400: '#FFCF4A',
    500: '#FFC42E', // Main Economy & Gold
    600: '#E0AB26', // Hover
    700: '#B37F00',
    800: '#805B00',
    900: '#4D3700',
  },

  // 7. Info Blue — #1CB0F6: Chờ duyệt (In Review), Gợi ý ngữ nghĩa, Cấp độ, TTS Hint
  info: {
    50: '#E8F7FE',
    100: '#C7ECFC',
    200: '#9BDDFA',
    300: '#5CC4F8',
    400: '#3ABAF7',
    500: '#1CB0F6', // Main Info Blue
    600: '#1899D6', // Hover
    700: '#0B6E9C',
    800: '#084F70',
    900: '#053347',
  },

  // 8. Danger Red — #EF4444: Hủy, Xóa, Lưu trữ (Archive), Sự cố báo lỗi scan
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main Destructive
    600: '#DC2626', // Hover
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // 9. State Machine Status Colors (Dành riêng cho Quy trình Vận hành Content Studio)
  status: {
    draft: {
      text: '#4B5563',
      bg: '#F3F4F6',
      border: '#E5E7EB',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    review: {
      text: '#0B8FCE',
      bg: '#E8F7FE',
      border: '#9BDDFA',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    published: {
      text: '#3C8C00',
      bg: '#F0FCE4',
      border: '#C2EE96',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    archived: {
      text: '#DC2626',
      bg: '#FEE2E2',
      border: '#FECACA',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  },

  // 10. CEFR Level Badges (Chuẩn hóa màu thẻ từ vựng)
  cefr: {
    A1: { text: '#047857', bg: '#ECFDF5', border: '#A7F3D0', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    A2: { text: '#0F766E', bg: '#F0FDFA', border: '#99F6E4', class: 'bg-teal-50 text-teal-700 border-teal-200' },
    B1: { text: '#B45309', bg: '#FFFBEB', border: '#FDE68A', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    B2: { text: '#C2410C', bg: '#FFF7ED', border: '#FED7AA', class: 'bg-orange-50 text-orange-700 border-orange-200' },
    C1: { text: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE', class: 'bg-purple-50 text-purple-700 border-purple-200' },
    C2: { text: '#BE123C', bg: '#FFF1F2', border: '#FECDD3', class: 'bg-rose-50 text-rose-700 border-rose-200' },
  },

  // 11. AI Scan Confidence Thresholds
  scanConfidence: {
    high: '#16A34A',    // >= 90% (Xanh lá)
    medium: '#D97706',  // 70% - 89% (Cam vàng)
    low: '#DC2626',     // < 70% (Cần review khẩn cấp)
  },
};
