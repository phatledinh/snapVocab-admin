import {
  CardTemplate,
  CardTemplateField,
  TemplateFilterState,
  TemplateMetricsSummary,
  ValidationResult,
  InteractionType,
  BaseLayoutType,
} from './types';

/**
 * Tính toán các chỉ số KPI thống kê cho Template Metrics Ribbon
 */
export function computeTemplateMetrics(
  templates: CardTemplate[],
  deckCountTotal: number = 38
): TemplateMetricsSummary {
  const systemTemplates = templates.filter((t) => t.isSystem);
  const customTemplates = templates.filter((t) => !t.isSystem);

  const flipCount = templates.filter((t) => t.interactionType === 'FLIP').length;
  const typeInCount = templates.filter((t) => t.interactionType === 'TYPE_IN').length;
  const tapToRevealCount = templates.filter((t) => t.interactionType === 'TAP_TO_REVEAL').length;

  const validRetentionRates = templates
    .map((t) => t.retentionRate)
    .filter((rate) => rate > 0);
  
  const averageRetentionRate = validRetentionRates.length > 0
    ? Number((validRetentionRates.reduce((acc, curr) => acc + curr, 0) / validRetentionRates.length).toFixed(1))
    : 85.0;

  // Tỷ lệ template có hỗ trợ Media (Ảnh hoặc Audio)
  const mediaRichTemplates = templates.filter((t) =>
    t.fields.some((f) => f.fieldType === 'AUDIO' || f.fieldType === 'IMAGE')
  ).length;

  const mediaRichCoverageRate = templates.length > 0
    ? Math.round((mediaRichTemplates / templates.length) * 100)
    : 100;

  return {
    totalTemplates: templates.length,
    systemCount: systemTemplates.length,
    customCount: customTemplates.length,
    activeDecksLinked: deckCountTotal,
    flipCount,
    typeInCount,
    tapToRevealCount,
    averageRetentionRate,
    mediaRichCoverageRate,
  };
}

/**
 * Lọc danh sách Template theo bộ lọc đa tiêu chí
 */
export function filterTemplates(
  templates: CardTemplate[],
  filter: TemplateFilterState
): CardTemplate[] {
  return templates.filter((template) => {
    // 1. Tìm kiếm theo từ khóa
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchName = template.name.toLowerCase().includes(q);
      const matchNameVi = template.nameVi.toLowerCase().includes(q);
      const matchCode = template.code.toLowerCase().includes(q);
      const matchDesc = template.description.toLowerCase().includes(q);
      const matchAuthor = template.authorName.toLowerCase().includes(q);
      const matchTag = template.tags?.some((t) => t.toLowerCase().includes(q));

      if (!matchName && !matchNameVi && !matchCode && !matchDesc && !matchAuthor && !matchTag) {
        return false;
      }
    }

    // 2. Lọc theo Base Layout
    if (filter.baseLayout !== 'all' && template.baseLayout !== filter.baseLayout) {
      return false;
    }

    // 3. Lọc theo Kiểu Tương Tác
    if (filter.interactionType !== 'all' && template.interactionType !== filter.interactionType) {
      return false;
    }

    // 4. Lọc theo Trạng thái
    if (filter.status !== 'all' && template.status !== filter.status) {
      return false;
    }

    return true;
  });
}

/**
 * Kiểm tra các quy tắc nghiệp vụ (Business Rules Validation) trước khi Lưu Template
 * Bám sát đặc tả MH-LEARN-07 và FR-05
 */
export function validateTemplateConfig(
  name: string,
  fields: CardTemplateField[],
  interactionType: InteractionType
): ValidationResult {
  const errors: Record<string, string> = {};

  // Rule 1: Tên không được rỗng
  if (!name || !name.trim()) {
    errors.name = 'Vui lòng nhập tên cho mẫu thẻ (tối đa 50 ký tự).';
  } else if (name.trim().length > 50) {
    errors.name = 'Tên mẫu thẻ không được vượt quá 50 ký tự.';
  }

  // Rule 2: Mặt trước và mặt sau phải có ít nhất 1 field
  const frontFields = fields.filter((f) => f.side === 'FRONT');
  const backFields = fields.filter((f) => f.side === 'BACK');

  if (frontFields.length === 0) {
    errors.front = 'Mặt trước (FRONT) cần ít nhất 1 trường hiển thị.';
  }

  if (backFields.length === 0) {
    errors.back = 'Mặt sau (BACK) cần ít nhất 1 trường hiển thị.';
  }

  // Rule 3: Mỗi mặt chỉ được có tối đa 1 field Primary
  const frontPrimaryCount = frontFields.filter((f) => f.isPrimary).length;
  if (frontPrimaryCount > 1) {
    errors.frontPrimary = 'Mặt trước chỉ được chọn tối đa 1 trường chính (Primary).';
  }

  const backPrimaryCount = backFields.filter((f) => f.isPrimary).length;
  if (backPrimaryCount > 1) {
    errors.backPrimary = 'Mặt sau chỉ được chọn tối đa 1 trường chính (Primary).';
  }

  // Rule 4: Nếu kiểu tương tác là TYPE_IN, mặt sau bắt buộc phải có field 'WORD' để so khớp
  if (interactionType === 'TYPE_IN') {
    const hasWordOnBack = backFields.some((f) => f.fieldType === 'WORD');
    if (!hasWordOnBack) {
      errors.typeInWord = 'Kiểu gõ chính tả (TYPE_IN) bắt buộc mặt sau phải có trường Từ vựng (WORD) để đối chiếu đáp án.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sinh danh sách fields mặc định cho Template mới theo Base Layout
 */
export function getDefaultFieldsForLayout(layout: BaseLayoutType): CardTemplateField[] {
  switch (layout) {
    case 'AUDIO_CENTER':
      return [
        { id: 'def-f-1', side: 'FRONT', fieldType: 'AUDIO', displayOrder: 1, isPrimary: true, fieldConfig: { autoPlay: true } },
        { id: 'def-f-2', side: 'FRONT', fieldType: 'PART_OF_SPEECH', displayOrder: 2, isPrimary: false },
        { id: 'def-b-1', side: 'BACK', fieldType: 'WORD', displayOrder: 1, isPrimary: true },
        { id: 'def-b-2', side: 'BACK', fieldType: 'IPA', displayOrder: 2, isPrimary: false },
        { id: 'def-b-3', side: 'BACK', fieldType: 'MEANING', displayOrder: 3, isPrimary: false },
        { id: 'def-b-4', side: 'BACK', fieldType: 'EXAMPLE', displayOrder: 4, isPrimary: false },
      ];
    case 'IMAGE_TOP':
      return [
        { id: 'def-f-1', side: 'FRONT', fieldType: 'IMAGE', displayOrder: 1, isPrimary: true },
        { id: 'def-f-2', side: 'FRONT', fieldType: 'PART_OF_SPEECH', displayOrder: 2, isPrimary: false },
        { id: 'def-b-1', side: 'BACK', fieldType: 'WORD', displayOrder: 1, isPrimary: true },
        { id: 'def-b-2', side: 'BACK', fieldType: 'MEANING', displayOrder: 2, isPrimary: false },
        { id: 'def-b-3', side: 'BACK', fieldType: 'IPA', displayOrder: 3, isPrimary: false },
        { id: 'def-b-4', side: 'BACK', fieldType: 'AUDIO', displayOrder: 4, isPrimary: false, fieldConfig: { autoPlay: true } },
      ];
    default:
      return [
        { id: 'def-f-1', side: 'FRONT', fieldType: 'WORD', displayOrder: 1, isPrimary: true },
        { id: 'def-f-2', side: 'FRONT', fieldType: 'IPA', displayOrder: 2, isPrimary: false },
        { id: 'def-f-3', side: 'FRONT', fieldType: 'AUDIO', displayOrder: 3, isPrimary: false },
        { id: 'def-b-1', side: 'BACK', fieldType: 'MEANING', displayOrder: 1, isPrimary: true },
        { id: 'def-b-2', side: 'BACK', fieldType: 'PART_OF_SPEECH', displayOrder: 2, isPrimary: false },
        { id: 'def-b-3', side: 'BACK', fieldType: 'EXAMPLE', displayOrder: 3, isPrimary: false },
      ];
  }
}
