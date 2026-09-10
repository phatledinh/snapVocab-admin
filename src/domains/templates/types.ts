export type BaseLayoutType = 
  | 'SINGLE_COLUMN' 
  | 'TWO_COLUMN' 
  | 'IMAGE_TOP' 
  | 'AUDIO_CENTER';

export type InteractionType = 
  | 'FLIP' 
  | 'TYPE_IN' 
  | 'TAP_TO_REVEAL';

export type TemplateFieldType = 
  | 'WORD' 
  | 'MEANING' 
  | 'PART_OF_SPEECH' 
  | 'EXAMPLE' 
  | 'PERSONAL_NOTE' 
  | 'IPA' 
  | 'AUDIO' 
  | 'IMAGE';

export interface FieldConfigOptions {
  autoPlay?: boolean;                    // Dành cho AUDIO: tự phát khi mở thẻ
  maskPattern?: '___' | '•••' | '[___]'; // Dành cho EXAMPLE: che từ chính
  showAll?: boolean;                     // Dành cho MEANING / IPA: hiện tất cả định nghĩa
  strictMode?: boolean;                  // Dành cho TYPE_IN: phân biệt chữ hoa / thường
  customPlaceholder?: string;           // Dành cho TYPE_IN: gợi ý trong ô input
}

export interface CardTemplateField {
  id: string;
  side: 'FRONT' | 'BACK';
  fieldType: TemplateFieldType;
  displayOrder: number;
  isPrimary: boolean;                    // Field chính render font lớn nổi bật (tối đa 1 field/mặt)
  fieldConfig?: FieldConfigOptions;
}

export interface CardTemplate {
  id: string;
  code: string;                          // 'CLASSIC', 'REVERSE', 'LISTENING', 'IMAGE_VOCAB', 'SPELLING', 'CONTEXT' hoặc mã ID
  name: string;
  nameVi: string;
  description: string;
  baseLayout: BaseLayoutType;
  interactionType: InteractionType;
  isSystem: boolean;                     // true: không cho learner sửa trực tiếp; false: custom template
  isDefault?: boolean;                   // Template mặc định gán cho Deck mới tạo (mặc định CLASSIC)
  status: 'active' | 'draft' | 'archived' | 'flagged';
  authorName: string;
  authorRole: 'system' | 'admin' | 'learner';
  authorAvatar?: string;
  deckCount: number;
  activeLearners: number;
  retentionRate: number;                 // Tỷ lệ nhớ FSRS trung bình (%)
  fields: CardTemplateField[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type TemplatesTab = 
  | 'system' 
  | 'custom-audit' 
  | 'builder' 
  | 'deck-matrix';

export interface TemplateFilterState {
  searchQuery: string;
  baseLayout: 'all' | BaseLayoutType;
  interactionType: 'all' | InteractionType;
  status: 'all' | string;
}

export interface TemplateMetricsSummary {
  totalTemplates: number;
  systemCount: number;
  customCount: number;
  activeDecksLinked: number;
  flipCount: number;
  typeInCount: number;
  tapToRevealCount: number;
  averageRetentionRate: number;
  mediaRichCoverageRate: number;
}

export interface DeckTemplateMapping {
  deckId: string;
  deckTitle: string;
  deckTitleVi: string;
  deckIcon: string;
  currentTemplateId: string;
  currentTemplateName: string;
  targetCefr: string;
  noteCount: number;
  activeLearners: number;
  completionRate: number;
  lastStudied: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
