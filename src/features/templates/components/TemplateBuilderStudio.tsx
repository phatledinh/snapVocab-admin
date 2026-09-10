import React, { useState } from 'react';
import {
  CardTemplate,
  CardTemplateField,
  BaseLayoutType,
  InteractionType,
  TemplateFieldType,
} from '../../../domains/templates/types';
import {
  validateTemplateConfig,
  getDefaultFieldsForLayout,
} from '../../../domains/templates/selectors';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Settings2,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Keyboard,
  Eye,
  FileText,
  Volume2,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';

interface TemplateBuilderStudioProps {
  initialTemplate?: CardTemplate | null;
  onSaveTemplate: (template: CardTemplate) => void;
  onCancel: () => void;
  onPreviewInSimulator?: (template: CardTemplate) => void;
}

const ALL_AVAILABLE_FIELDS: { type: TemplateFieldType; label: string; desc: string; icon: React.ReactNode }[] = [
  { type: 'WORD', label: 'Từ vựng (Word)', desc: 'Chữ tiếng Anh chính của thẻ', icon: <FileText size={14} className="text-primary" /> },
  { type: 'MEANING', label: 'Định nghĩa (Meaning)', desc: 'Nghĩa tiếng Việt giải thích chi tiết', icon: <FileText size={14} className="text-blue-600" /> },
  { type: 'IPA', label: 'Phiên âm IPA', desc: 'Ký tự phát âm chuẩn quốc tế', icon: <FileText size={14} className="text-purple-600" /> },
  { type: 'AUDIO', label: 'Âm thanh phát âm', desc: 'Giọng đọc chuẩn US/UK Web Speech', icon: <Volume2 size={14} className="text-emerald-600" /> },
  { type: 'IMAGE', label: 'Ảnh minh họa', desc: 'Hình ảnh thực tế hoặc nhận diện AI', icon: <ImageIcon size={14} className="text-snapy" /> },
  { type: 'PART_OF_SPEECH', label: 'Từ loại (POS)', desc: 'Noun, verb, adjective...', icon: <FileText size={14} className="text-text-muted" /> },
  { type: 'EXAMPLE', label: 'Ví dụ & Ngữ cảnh', desc: 'Câu song ngữ Anh - Việt thực tế', icon: <FileText size={14} className="text-amber-600" /> },
  { type: 'PERSONAL_NOTE', label: 'Ghi chú học viên', desc: 'Tips, collocation và lưu ý cá nhân', icon: <FileText size={14} className="text-text-muted" /> },
];

export const TemplateBuilderStudio: React.FC<TemplateBuilderStudioProps> = ({
  initialTemplate,
  onSaveTemplate,
  onCancel,
  onPreviewInSimulator,
}) => {
  // Wizard active step: 1 (Info & Layout), 2 (Front fields), 3 (Back fields), 4 (Interaction & Rules)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Template Form State
  const [name, setName] = useState(initialTemplate?.name || 'My Custom Template');
  const [nameVi, setNameVi] = useState(initialTemplate?.nameVi || 'Mẫu Thẻ Học Tuỳ Biến');
  const [code, setCode] = useState(initialTemplate?.code || 'CUSTOM_01');
  const [description, setDescription] = useState(
    initialTemplate?.description || 'Mẫu thẻ tự thiết kế đáp ứng nhu cầu học tập chuyên biệt.'
  );
  const [baseLayout, setBaseLayout] = useState<BaseLayoutType>(
    initialTemplate?.baseLayout || 'SINGLE_COLUMN'
  );
  const [interactionType, setInteractionType] = useState<InteractionType>(
    initialTemplate?.interactionType || 'FLIP'
  );

  // Fields State
  const [fields, setFields] = useState<CardTemplateField[]>(
    initialTemplate?.fields || getDefaultFieldsForLayout('SINGLE_COLUMN')
  );

  // Selected field for config popup
  const [editingFieldConfigId, setEditingFieldConfigId] = useState<string | null>(null);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sync with simulator live
  const buildCurrentTemplateSnapshot = (): CardTemplate => {
    return {
      id: initialTemplate?.id || `tpl-custom-${Date.now()}`,
      code: code.toUpperCase().replace(/\s+/g, '_'),
      name,
      nameVi,
      description,
      baseLayout,
      interactionType,
      isSystem: false,
      status: 'active',
      authorName: 'Admin Operator',
      authorRole: 'admin',
      deckCount: initialTemplate?.deckCount || 0,
      activeLearners: initialTemplate?.activeLearners || 0,
      retentionRate: initialTemplate?.retentionRate || 88.0,
      fields,
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['Custom Studio', 'M3'],
    };
  };

  // Trigger live simulator preview
  const handleLivePreview = () => {
    if (onPreviewInSimulator) {
      onPreviewInSimulator(buildCurrentTemplateSnapshot());
    }
  };

  // Change base layout handler
  const handleLayoutChange = (newLayout: BaseLayoutType) => {
    setBaseLayout(newLayout);
    // If brand new template, regenerate sensible default fields
    if (!initialTemplate) {
      setFields(getDefaultFieldsForLayout(newLayout));
    }
  };

  // Field helpers
  const toggleFieldEnabled = (side: 'FRONT' | 'BACK', type: TemplateFieldType) => {
    const existingIndex = fields.findIndex((f) => f.side === side && f.fieldType === type);
    if (existingIndex >= 0) {
      // Remove field
      const newFields = fields.filter((_, idx) => idx !== existingIndex);
      setFields(newFields);
    } else {
      // Add field
      const sideFields = fields.filter((f) => f.side === side);
      const newField: CardTemplateField = {
        id: `f-${side.toLowerCase()}-${type.toLowerCase()}-${fields.length + 1}`,
        side,
        fieldType: type,
        displayOrder: sideFields.length + 1,
        isPrimary: sideFields.length === 0, // Primary if first
        fieldConfig: type === 'AUDIO' ? { autoPlay: false } : type === 'EXAMPLE' ? { maskPattern: '___' } : undefined,
      };
      setFields([...fields, newField]);
    }
  };

  const setPrimaryField = (side: 'FRONT' | 'BACK', fieldId: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.side !== side) return f;
        return {
          ...f,
          isPrimary: f.id === fieldId,
        };
      })
    );
  };

  const moveFieldOrder = (side: 'FRONT' | 'BACK', fieldId: string, direction: 'up' | 'down') => {
    const sideFields = fields.filter((f) => f.side === side).sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sideFields.findIndex((f) => f.id === fieldId);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const temp = sideFields[idx].displayOrder;
      sideFields[idx].displayOrder = sideFields[idx - 1].displayOrder;
      sideFields[idx - 1].displayOrder = temp;
    } else if (direction === 'down' && idx < sideFields.length - 1) {
      const temp = sideFields[idx].displayOrder;
      sideFields[idx].displayOrder = sideFields[idx + 1].displayOrder;
      sideFields[idx + 1].displayOrder = temp;
    }

    const otherFields = fields.filter((f) => f.side !== side);
    setFields([...otherFields, ...sideFields]);
  };

  const updateFieldConfig = (fieldId: string, configUpdates: any) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        return {
          ...f,
          fieldConfig: {
            ...f.fieldConfig,
            ...configUpdates,
          },
        };
      })
    );
  };

  // Submit & Save
  const handleSave = () => {
    const valResult = validateTemplateConfig(name, fields, interactionType);
    if (!valResult.isValid) {
      setValidationErrors(valResult.errors);
      return;
    }
    setValidationErrors({});
    onSaveTemplate(buildCurrentTemplateSnapshot());
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface rounded-xl border border-border overflow-hidden shadow-xs select-none">
      {/* Wizard Header Stepper */}
      <div className="p-4 border-b border-border bg-background flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-light text-primary">
              <Sparkles size={16} />
            </span>
            <h3 className="text-base font-extrabold text-text tracking-tight">
              {initialTemplate ? `Sửa Mẫu: ${initialTemplate.name}` : 'Thiết Kế Mẫu Thẻ Mới (Template Builder)'}
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Cấu hình layout, field mapping và kiểu tương tác flashcard theo chuẩn Milestone 3.
          </p>
        </div>

        {/* Step Numbers Indicator */}
        <div className="flex items-center gap-1.5">
          {[
            { step: 1, label: 'Bố cục & Tên' },
            { step: 2, label: 'Mặt trước (FRONT)' },
            { step: 3, label: 'Mặt sau (BACK)' },
            { step: 4, label: 'Tương tác & Lưu' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStep === item.step
                  ? 'bg-primary text-white shadow-xs'
                  : currentStep > item.step
                  ? 'bg-primary-light text-primary border border-primary/20'
                  : 'bg-surface text-text-muted border border-border hover:text-text'
              }`}
            >
              <span>{item.step}.</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <div className="p-5 flex-1 overflow-y-auto">
        {/* STEP 1: INFO & BASE LAYOUT */}
        {currentStep === 1 && (
          <div className="max-w-2xl space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Tên Mẫu (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: IELTS Band 8 Booster"
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary"
                />
                {validationErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 font-semibold">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Tên Tiếng Việt Hiển Thị
                </label>
                <input
                  type="text"
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                  placeholder="VD: Luyện Đề Học Thuật IELTS"
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">Mã Thẻ (Code / Slug)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: IELTS_ACADEMIC"
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs font-mono text-text bg-background focus:outline-none focus:border-primary uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">Mô Tả Mục Đích</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mục đích sử dụng của mẫu thẻ này..."
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs text-text bg-background focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Base Layout Selection */}
            <div>
              <label className="block text-xs font-bold text-text mb-2">
                Chọn Bố Cục Cơ Sở (Base Layout) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'SINGLE_COLUMN',
                    title: '1 Cột Chuẩn (Single Column)',
                    desc: 'Bố cục truyền thống, thông tin xếp chồng từ trên xuống dưới gọn gàng.',
                    icon: '📱',
                  },
                  {
                    id: 'TWO_COLUMN',
                    title: '2 Cột Song Song (Two Columns)',
                    desc: 'Cột trái hiển thị từ/nghĩa, cột phải hiển thị ảnh minh họa hoặc ví dụ.',
                    icon: '📊',
                  },
                  {
                    id: 'IMAGE_TOP',
                    title: 'Ảnh Trên Cùng (Image Top)',
                    desc: 'Khung ảnh lớn bao phủ phần đầu thẻ, kích thích ghi nhớ qua hình ảnh.',
                    icon: '🖼️',
                  },
                  {
                    id: 'AUDIO_CENTER',
                    title: 'Audio Trung Tâm (Audio Center)',
                    desc: 'Nút loa to nổi bật giữa thẻ, tối ưu luyện kỹ năng nghe (Ear Training).',
                    icon: '🎧',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLayoutChange(item.id as BaseLayoutType)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      baseLayout === item.id
                        ? 'border-primary bg-primary-light/30 shadow-xs'
                        : 'border-border bg-surface hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-bold text-text">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FRONT FIELDS CONFIG */}
        {currentStep === 2 && (
          <div className="max-w-3xl space-y-4 animate-in fade-in">
            <div className="p-3 bg-primary-light/50 border border-primary/20 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">
                Cấu hình các trường hiển thị ở Mặt Trước (FRONT). Tối đa chọn 1 trường chính (Primary).
              </span>
              <button
                type="button"
                onClick={handleLivePreview}
                className="px-2.5 py-1 rounded-md bg-primary text-white font-bold text-[11px] shadow-xs"
              >
                Cập nhật Simulator
              </button>
            </div>

            {validationErrors.front && (
              <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle size={13} /> {validationErrors.front}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Available Fields Checklist */}
              <div className="bg-background p-3.5 rounded-xl border border-border">
                <h4 className="text-xs font-bold text-text mb-2.5 uppercase tracking-wide">
                  8 Trường Khả Dụng (Bật / Tắt)
                </h4>
                <div className="space-y-1.5">
                  {ALL_AVAILABLE_FIELDS.map((field) => {
                    const isEnabled = fields.some((f) => f.side === 'FRONT' && f.fieldType === field.type);
                    return (
                      <div
                        key={field.type}
                        onClick={() => toggleFieldEnabled('FRONT', field.type)}
                        className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isEnabled
                            ? 'bg-surface border-primary text-text shadow-2xs font-semibold'
                            : 'bg-surface/50 border-border text-text-muted hover:border-border-strong'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {field.icon}
                          <div>
                            <div className="text-xs">{field.label}</div>
                            <div className="text-[10px] text-text-muted">{field.desc}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => {}}
                          className="rounded text-primary focus:ring-0 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Fields Order & Settings */}
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <h4 className="text-xs font-bold text-text mb-2.5 uppercase tracking-wide flex items-center justify-between">
                  <span>Thứ Tự & Cấu Hình Mặt Trước</span>
                  <span className="text-[10px] font-normal text-text-muted">
                    {fields.filter((f) => f.side === 'FRONT').length} trường đã bật
                  </span>
                </h4>

                <div className="space-y-2">
                  {fields
                    .filter((f) => f.side === 'FRONT')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((f, idx, arr) => {
                      const fieldDef = ALL_AVAILABLE_FIELDS.find((item) => item.type === f.fieldType);
                      return (
                        <div
                          key={f.id}
                          className="p-2.5 rounded-lg border border-border bg-background flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {fieldDef?.icon}
                            <div className="truncate">
                              <span className="text-xs font-bold text-text">{fieldDef?.label}</span>
                              {f.isPrimary && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-primary-light text-primary border border-primary/20">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Primary Radio */}
                            <button
                              type="button"
                              onClick={() => setPrimaryField('FRONT', f.id)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                                f.isPrimary
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-surface text-text-muted border-border hover:text-text'
                              }`}
                              title="Đặt làm trường chính font to"
                            >
                              ★ Chính
                            </button>

                            {/* Order Controls */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveFieldOrder('FRONT', f.id, 'up')}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-text disabled:opacity-30"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === arr.length - 1}
                              onClick={() => moveFieldOrder('FRONT', f.id, 'down')}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-text disabled:opacity-30"
                            >
                              <ChevronDown size={12} />
                            </button>

                            {/* Config Button */}
                            <button
                              type="button"
                              onClick={() => setEditingFieldConfigId(f.id)}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-primary"
                              title="Cấu hình nâng cao"
                            >
                              <Settings2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BACK FIELDS CONFIG */}
        {currentStep === 3 && (
          <div className="max-w-3xl space-y-4 animate-in fade-in">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-800">
                Cấu hình các trường hiển thị ở Mặt Sau (BACK). Độc lập hoàn toàn với mặt trước.
              </span>
              <button
                type="button"
                onClick={handleLivePreview}
                className="px-2.5 py-1 rounded-md bg-info text-white font-bold text-[11px] shadow-xs"
              >
                Cập nhật Simulator
              </button>
            </div>

            {validationErrors.back && (
              <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle size={13} /> {validationErrors.back}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Available Fields Checklist for BACK */}
              <div className="bg-background p-3.5 rounded-xl border border-border">
                <h4 className="text-xs font-bold text-text mb-2.5 uppercase tracking-wide">
                  8 Trường Khả Dụng Cho Mặt Sau
                </h4>
                <div className="space-y-1.5">
                  {ALL_AVAILABLE_FIELDS.map((field) => {
                    const isEnabled = fields.some((f) => f.side === 'BACK' && f.fieldType === field.type);
                    return (
                      <div
                        key={field.type}
                        onClick={() => toggleFieldEnabled('BACK', field.type)}
                        className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isEnabled
                            ? 'bg-surface border-info text-text shadow-2xs font-semibold'
                            : 'bg-surface/50 border-border text-text-muted hover:border-border-strong'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {field.icon}
                          <div>
                            <div className="text-xs">{field.label}</div>
                            <div className="text-[10px] text-text-muted">{field.desc}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => {}}
                          className="rounded text-info focus:ring-0 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Back Fields Order */}
              <div className="bg-surface p-3.5 rounded-xl border border-border">
                <h4 className="text-xs font-bold text-text mb-2.5 uppercase tracking-wide flex items-center justify-between">
                  <span>Thứ Tự & Cấu Hình Mặt Sau</span>
                  <span className="text-[10px] font-normal text-text-muted">
                    {fields.filter((f) => f.side === 'BACK').length} trường đã bật
                  </span>
                </h4>

                <div className="space-y-2">
                  {fields
                    .filter((f) => f.side === 'BACK')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((f, idx, arr) => {
                      const fieldDef = ALL_AVAILABLE_FIELDS.find((item) => item.type === f.fieldType);
                      return (
                        <div
                          key={f.id}
                          className="p-2.5 rounded-lg border border-border bg-background flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {fieldDef?.icon}
                            <div className="truncate">
                              <span className="text-xs font-bold text-text">{fieldDef?.label}</span>
                              {f.isPrimary && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPrimaryField('BACK', f.id)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                                f.isPrimary
                                  ? 'bg-info text-white border-info'
                                  : 'bg-surface text-text-muted border-border hover:text-text'
                              }`}
                              title="Đặt làm trường chính font to"
                            >
                              ★ Chính
                            </button>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveFieldOrder('BACK', f.id, 'up')}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-text disabled:opacity-30"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === arr.length - 1}
                              onClick={() => moveFieldOrder('BACK', f.id, 'down')}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-text disabled:opacity-30"
                            >
                              <ChevronDown size={12} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingFieldConfigId(f.id)}
                              className="p-1 rounded bg-surface border border-border text-text-muted hover:text-primary"
                              title="Cấu hình nâng cao"
                            >
                              <Settings2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INTERACTION TYPE & RULES */}
        {currentStep === 4 && (
          <div className="max-w-2xl space-y-5 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-text mb-2">
                Chọn Kiểu Tương Tác Của Thẻ (Interaction Type) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'FLIP',
                    title: 'Lật Thẻ 3D (FLIP)',
                    desc: 'Chạm vào thẻ để lật 2 mặt trước sau mượt mà. Phổ biến nhất.',
                    icon: <RotateCw size={18} className="text-emerald-600" />,
                  },
                  {
                    id: 'TYPE_IN',
                    title: 'Gõ Chính Tả (TYPE_IN)',
                    desc: 'Người học gõ từ vào ô text, hệ thống tự động so khớp đáp án.',
                    icon: <Keyboard size={18} className="text-purple-600" />,
                  },
                  {
                    id: 'TAP_TO_REVEAL',
                    title: 'Chạm Hé Lộ (TAP)',
                    desc: 'Che mờ các trường dữ liệu, chạm vào từng phần để hé lộ dần.',
                    icon: <Eye size={18} className="text-blue-600" />,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setInteractionType(item.id as InteractionType)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      interactionType === item.id
                        ? 'border-primary bg-primary-light/30 shadow-xs'
                        : 'border-border bg-surface hover:border-primary/40'
                    }`}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-xs font-bold text-text mb-1">{item.title}</div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Rules Check Card */}
            <div className="bg-background p-4 rounded-xl border border-border space-y-2">
              <h4 className="text-xs font-bold text-text uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-primary" />
                <span>Kiểm Tra Quy Tắc Nghiệp Vụ (Live Validation)</span>
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  {name.trim() ? (
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={13} className="text-rose-500" />
                  )}
                  <span className={name.trim() ? 'text-text' : 'text-rose-600 font-semibold'}>
                    Tên template không được để trống (hiện tại: "{name || 'Trống'}")
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {fields.filter((f) => f.side === 'FRONT').length > 0 ? (
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={13} className="text-rose-500" />
                  )}
                  <span className={fields.filter((f) => f.side === 'FRONT').length > 0 ? 'text-text' : 'text-rose-600 font-semibold'}>
                    Mặt trước có ít nhất 1 trường (hiện tại: {fields.filter((f) => f.side === 'FRONT').length} trường)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {fields.filter((f) => f.side === 'BACK').length > 0 ? (
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={13} className="text-rose-500" />
                  )}
                  <span className={fields.filter((f) => f.side === 'BACK').length > 0 ? 'text-text' : 'text-rose-600 font-semibold'}>
                    Mặt sau có ít nhất 1 trường (hiện tại: {fields.filter((f) => f.side === 'BACK').length} trường)
                  </span>
                </div>

                {interactionType === 'TYPE_IN' && (
                  <div className="flex items-center gap-2">
                    {fields.some((f) => f.side === 'BACK' && f.fieldType === 'WORD') ? (
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    ) : (
                      <AlertCircle size={13} className="text-rose-500" />
                    )}
                    <span
                      className={
                        fields.some((f) => f.side === 'BACK' && f.fieldType === 'WORD')
                          ? 'text-text'
                          : 'text-rose-600 font-bold'
                      }
                    >
                      Kiểu TYPE_IN: Mặt sau bắt buộc phải có trường WORD để đối chiếu
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation */}
      <div className="p-4 border-t border-border bg-background flex items-center justify-between">
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-surface flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowLeft size={13} />
              <span>Quay lại Bước {currentStep - 1}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-surface transition-all"
            >
              Hủy bỏ
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLivePreview}
            className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles size={13} className="text-snapy" />
            <span>Mô phỏng Simulator</span>
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Tiếp tục Bước {currentStep + 1}</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Save size={14} />
              <span>Lưu Template</span>
            </button>
          )}
        </div>
      </div>

      {/* FIELD CONFIGURATION MODAL */}
      {editingFieldConfigId && (() => {
        const editingField = fields.find((f) => f.id === editingFieldConfigId);
        if (!editingField) return null;
        const fieldDef = ALL_AVAILABLE_FIELDS.find((item) => item.type === editingField.fieldType);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
            <div className="bg-surface rounded-2xl border border-border shadow-modal w-full max-w-md p-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-primary-light text-primary">{fieldDef?.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-text">
                      Cấu hình: {fieldDef?.label} ({editingField.side})
                    </h4>
                    <p className="text-[10px] text-text-muted">Tùy biến hành vi hiển thị và tương tác của trường</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingFieldConfigId(null)}
                  className="p-1 rounded text-text-muted hover:text-text"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {editingField.fieldType === 'AUDIO' && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-subtle border border-border">
                    <div>
                      <div className="font-bold text-text">Tự động phát âm thanh (autoPlay)</div>
                      <div className="text-[10px] text-text-muted">Phát giọng đọc ngay khi người học lật sang mặt này</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingField.fieldConfig?.autoPlay || false}
                      onChange={(e) => updateFieldConfig(editingField.id, { autoPlay: e.target.checked })}
                      className="rounded text-primary focus:ring-0 cursor-pointer"
                    />
                  </div>
                )}

                {editingField.fieldType === 'EXAMPLE' && (
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-2">
                    <div className="font-bold text-text">Ký hiệu che từ chính (maskPattern)</div>
                    <div className="text-[10px] text-text-muted">Dùng cho phương pháp Cloze Deletion / Ngữ cảnh</div>
                    <div className="flex gap-2 pt-1">
                      {['___', '•••', '[___]'].map((pat) => (
                        <button
                          key={pat}
                          type="button"
                          onClick={() => updateFieldConfig(editingField.id, { maskPattern: pat })}
                          className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition-all ${
                            editingField.fieldConfig?.maskPattern === pat
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-surface text-text border-border hover:border-primary/40'
                          }`}
                        >
                          {pat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(editingField.fieldType === 'MEANING' || editingField.fieldType === 'IPA' || editingField.fieldType === 'PART_OF_SPEECH') && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-subtle border border-border">
                    <div>
                      <div className="font-bold text-text">Hiển thị đầy đủ (showAll)</div>
                      <div className="text-[10px] text-text-muted">Hiện tất cả nghĩa phụ và câu ví dụ liên quan</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingField.fieldConfig?.showAll || false}
                      onChange={(e) => updateFieldConfig(editingField.id, { showAll: e.target.checked })}
                      className="rounded text-primary focus:ring-0 cursor-pointer"
                    />
                  </div>
                )}

                {editingField.fieldType === 'WORD' && editingField.side === 'BACK' && (
                  <div className="space-y-2 p-2.5 rounded-lg bg-surface-subtle border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-text">Strict Mode (Phân biệt hoa/thường)</div>
                        <div className="text-[10px] text-text-muted">Dành cho kiểu gõ TYPE_IN yêu cầu chính xác 100%</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingField.fieldConfig?.strictMode || false}
                        onChange={(e) => updateFieldConfig(editingField.id, { strictMode: e.target.checked })}
                        className="rounded text-primary focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                        Placeholder gợi ý ô nhập
                      </label>
                      <input
                        type="text"
                        value={editingField.fieldConfig?.customPlaceholder || ''}
                        onChange={(e) => updateFieldConfig(editingField.id, { customPlaceholder: e.target.value })}
                        placeholder="VD: Nhập từ vựng tiếng Anh..."
                        className="w-full px-2.5 py-1.5 rounded-md border border-border text-xs bg-surface text-text"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingFieldConfigId(null)}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs"
                >
                  Xong & Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
