export type SectionType = 'intro' | 'development' | 'summary' | 'activity' | 'evaluation';

export interface SectionTemplate {
  id: SectionType;
  name: string;
  enabled: boolean;
  durationMinutes: number;
  order: number;
  description: string;
}

export type ImageType = 'concept' | 'flowchart' | 'graph' | 'screenshot' | 'metaphor' | 'photo';

export interface ImageTypeGuide {
  type: ImageType;
  label: string;
  tip: string;
  example: string;
}

export const IMAGE_TYPE_GUIDES: Record<ImageType, { label: string; tip: string; example: string }> = {
  concept: {
    label: '개념도 (Concept Map)',
    tip: '핵심 노드 5~7개 이내로 제한하고, 화살표 위에 관계 동사(포함한다, 유발한다 등)를 명기하세요.',
    example: 'ADDIE 5단계 상호 연관성 다이어그램',
  },
  flowchart: {
    label: '순서도 (Flowchart)',
    tip: '시작부터 종료까지 한 방향(위에서 아래 또는 왼쪽에서 오른쪽)으로 일관되게 정렬하세요.',
    example: '교수설계 요구분석 절차 흐름도',
  },
  graph: {
    label: '그래프 (Data Chart)',
    tip: '한 차트에 단 하나의 핵심 메시지만 담고, 주목해야 할 수치에만 강조 색상을 적용하세요.',
    example: '학습자 몰입도 유지 시간 추이 그래프',
  },
  screenshot: {
    label: '화면 캡처 (Screenshot)',
    tip: '불필요한 배경을 자르고, 핵심 버튼이나 UI 요소에 번호 배지나 하이라이트 박스를 표시하세요.',
    example: 'LMS 퀴즈 생성 설정 화면 캡처',
  },
  metaphor: {
    label: '비유 이미지 (Visual Metaphor)',
    tip: '추상적 개념을 직관적으로 연상시키는 은유를 활용하고 장식적 요소를 배제하세요.',
    example: '비계(Scaffolding) 건축 비계 구조물 사진',
  },
  photo: {
    label: '현장 사진 (Field Photo)',
    tip: '고해상도 실무 환경 사진을 사용하며, 학습 대상 피사체가 또렷하게 부각되도록 하세요.',
    example: '플립러닝(Flipped Learning) 모둠 활동 현장',
  },
};

export interface ImagePlan {
  id: string;
  conceptName: string;
  imageType: ImageType;
  caption: string;
  altText: string;
  sourceAndLicense: string;
  imageUrl?: string;
}

export interface KeyConcept {
  name: string;
  description: string;
}

export interface GeneratedSection {
  sectionId: SectionType;
  sectionName: string;
  title: string;
  allocatedTime: number;
  items: string[];
  summaryBox?: string;
  activity?: {
    title: string;
    prompt: string;
    duration: number;
  };
  sources?: string[];
}

export type WeekStatus = 'not_started' | 'draft' | 'completed';

export interface WeekPlan {
  id: string;
  weekNumber: number;
  topic: string;
  status: WeekStatus;
  learningObjectives: string[];
  keywords: string[];
  keyConcepts: KeyConcept[];
  references: string;
  evaluationInfo: string;
  imagePlans: ImagePlan[];
  generatedSections: GeneratedSection[];
  overallSummary?: string;
  nextWeekPreview?: string;
  checklistManualOverrides?: Record<string, boolean>;
  updatedAt: string;
}

export type DeliveryMethod = 'face-to-face' | 'online' | 'hybrid';

export interface Course {
  id: string;
  name: string;
  credits: number;
  targetAudience: string;
  classDurationMinutes: number;
  deliveryMethod: DeliveryMethod;
  totalWeeks: number;
  overview: string;
  templateSections: SectionTemplate[];
  weeks: WeekPlan[];
  updatedAt: string;
}

export interface QualityCheckItem {
  id: string;
  label: string;
  passed: boolean;
  isAuto: boolean;
  scoreWeight: number;
  message: string;
  tip: string;
}
