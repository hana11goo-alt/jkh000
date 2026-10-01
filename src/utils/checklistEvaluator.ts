import { WeekPlan, QualityCheckItem } from '../types';

// Measurable behavioral verbs according to Bloom's taxonomy in Korean
const MEASURABLE_VERB_PATTERNS = [
  /할 수 있다$/,
  /설명한다$/,
  /분류한다$/,
  /도출한다$/,
  /구현한다$/,
  /설계한다$/,
  /비교한다$/,
  /분석한다$/,
  /작성한다$/,
  /제시한다$/,
  /평가한다$/,
  /적용한다$/,
  /구별한다$/,
  /선정한다$/,
  /열거한다$/,
  /계산한다$/,
];

// Unmeasurable / vague verbs to warn against
const UNMEASURABLE_VERBS = ['이해한다', '안다', '배운다', '파악한다', '습득한다', '인지한다', '느낀다', '체득한다'];

export function evaluateChecklist(week: WeekPlan): QualityCheckItem[] {
  const manual = week.checklistManualOverrides || {};

  // 1. 학습목표가 측정 가능한 동사로 작성되었는가
  const hasObjectives = week.learningObjectives && week.learningObjectives.length > 0;
  let measurableCount = 0;
  let unmeasurableFound = false;

  if (hasObjectives) {
    week.learningObjectives.forEach((obj) => {
      const trimmed = obj.trim();
      const hasUnmeasurable = UNMEASURABLE_VERBS.some((v) => trimmed.includes(v));
      if (hasUnmeasurable) unmeasurableFound = true;
      const isMeasurable = MEASURABLE_VERB_PATTERNS.some((p) => p.test(trimmed));
      if (isMeasurable) measurableCount++;
    });
  }

  const objPassed = hasObjectives && measurableCount > 0 && !unmeasurableFound;
  const item1: QualityCheckItem = {
    id: 'measurable_objectives',
    label: '학습목표가 측정 가능한 동사로 작성되었는가',
    passed: manual['measurable_objectives'] !== undefined ? manual['measurable_objectives'] : objPassed,
    isAuto: true,
    scoreWeight: 15,
    message: !hasObjectives
      ? '학습목표가 아직 입력되지 않았습니다.'
      : unmeasurableFound
      ? '주의: "이해한다", "안다" 등의 비측정 동사 대신 "~할 수 있다", "~을 분류할 수 있다" 등의 행동 동사를 권장합니다.'
      : objPassed
      ? `측정 가능한 행동 동사가 ${measurableCount}개 잘 적용되었습니다.`
      : '학습목표 끝을 "~할 수 있다", "~을 도출한다" 등 관찰 가능한 형태로 수정해보세요.',
    tip: '블룸(Bloom)의 신분류학: 기억 -> 이해 -> 적용 -> 분석 -> 평가 -> 창출 단계의 구체적 동사 활용 권장',
  };

  // 2. 핵심 개념이 5개 이하인가
  const conceptCount = week.keyConcepts?.length || 0;
  const conceptPassed = conceptCount >= 1 && conceptCount <= 5;
  const item2: QualityCheckItem = {
    id: 'max_concepts',
    label: '핵심 개념이 5개 이하인가',
    passed: manual['max_concepts'] !== undefined ? manual['max_concepts'] : conceptPassed,
    isAuto: true,
    scoreWeight: 15,
    message:
      conceptCount === 0
        ? '핵심 개념을 1~5개 사이로 등록해주세요.'
        : conceptCount > 5
        ? `현재 핵심 개념이 ${conceptCount}개입니다. 인지 부하를 줄이기 위해 주당 3~5개로 압축을 권장합니다.`
        : `현재 ${conceptCount}개로 적정 범위(3~5개)를 준수하고 있습니다.`,
    tip: '밀러의 법칙(Miller\'s Law): 인간의 단기 기억 용량(7±2)을 고려해 한 주차 3~5개 핵심 개념이 최적',
  };

  // 3. 제목이 서술형으로 메시지를 전달하는가
  const sections = week.generatedSections || [];
  const descriptiveTitles = sections.filter((s) => {
    const t = s.title?.trim() || '';
    return t.length >= 8 && (t.endsWith('다') || t.endsWith('다.') || t.endsWith('임') || t.endsWith('함'));
  });
  const titlesPassed = sections.length > 0 && descriptiveTitles.length >= Math.ceil(sections.length * 0.6);
  const item3: QualityCheckItem = {
    id: 'descriptive_titles',
    label: '제목이 서술형으로 메시지를 전달하는가',
    passed: manual['descriptive_titles'] !== undefined ? manual['descriptive_titles'] : titlesPassed,
    isAuto: true,
    scoreWeight: 15,
    message:
      sections.length === 0
        ? '교안 초안이 생성되면 섹션별 제목의 서술형 여부를 판정합니다.'
        : titlesPassed
        ? `서술형 제목이 ${descriptiveTitles.length}/${sections.length}개 잘 작성되었습니다.`
        : '단순 명사형 제목(예: "데이터 분석") 대신 핵심 메시지가 담긴 서술형 문장(예: "데이터 분석은 4단계로 진행된다")을 사용하세요.',
    tip: '한 슬라이드(페이지) 하나의 메시지 원칙: 제목만 읽어도 해당 파트의 핵심 주장을 알 수 있어야 합니다.',
  };

  // 4. 정리 파트에 요약 박스가 있는가
  const hasSummaryBox =
    Boolean(week.overallSummary?.trim()) ||
    sections.some((s) => (s.sectionId === 'summary' || s.sectionName?.includes('정리')) && Boolean(s.summaryBox?.trim())) ||
    sections.some((s) => Boolean(s.summaryBox?.trim()));
  const item4: QualityCheckItem = {
    id: 'summary_box',
    label: '정리 파트에 요약 박스가 있는가',
    passed: manual['summary_box'] !== undefined ? manual['summary_box'] : hasSummaryBox,
    isAuto: true,
    scoreWeight: 15,
    message: hasSummaryBox
      ? '정리 파트 또는 섹션별 핵심 요약 박스가 마련되어 있습니다.'
      : '학습자 복습과 기억 강화를 위해 정리 파트에 핵심 요약 박스를 배치하세요.',
    tip: '요약 박스는 1~2개 핵심 문장으로 압축하여 학습자의 장기 기억 전이를 돕습니다.',
  };

  // 5. 활동/질문 항목이 포함되었는가
  const hasActivity = sections.some((s) => s.activity && (s.activity.prompt?.trim() || s.activity.title?.trim()));
  const item5: QualityCheckItem = {
    id: 'has_activity',
    label: '활동/질문 항목이 포함되었는가',
    passed: manual['has_activity'] !== undefined ? manual['has_activity'] : hasActivity,
    isAuto: true,
    scoreWeight: 15,
    message: hasActivity
      ? '학습자 능동적 참여를 위한 발문 및 실습 활동이 배치되었습니다.'
      : '10~15분 간격으로 질문, 짝 토론 또는 5분 실습 활동을 1개 이상 추가하세요.',
    tip: '주의집중 곡선(Attention Curve): 성인 학습자의 집중 시간은 15분 주기로 감소하므로 중간 활동이 필수적입니다.',
  };

  // 6. 이미지마다 캡션, 대체 텍스트, 출처가 있는가
  const images = week.imagePlans || [];
  const hasImages = images.length > 0;
  const allImagesComplete = hasImages && images.every((img) => img.caption?.trim() && img.altText?.trim() && img.sourceAndLicense?.trim());
  const item6: QualityCheckItem = {
    id: 'image_accessibility',
    label: '이미지마다 캡션, 대체 텍스트, 출처가 있는가',
    passed: manual['image_accessibility'] !== undefined ? manual['image_accessibility'] : (!hasImages ? true : allImagesComplete),
    isAuto: true,
    scoreWeight: 15,
    message: !hasImages
      ? '등록된 이미지 계획이 없습니다. (시각 자료가 필요하다면 이미지 계획을 추가하세요)'
      : allImagesComplete
      ? `등록된 ${images.length}개 이미지 모두 캡션, 대체텍스트, 출처가 완비되었습니다.`
      : '일부 이미지에 캡션, 대체 텍스트(alt), 출처 정보가 누락되어 있습니다.',
    tip: '시각 자료는 한 줄 해석 캡션과 웹 접근성(대체 텍스트), 저작권 이용 조건을 표기해야 합니다.',
  };

  // 7. 출처 표기가 있는가
  const hasReferences =
    Boolean(week.references?.trim()) ||
    sections.some((s) => s.sources && s.sources.length > 0 && s.sources.some((src) => src.trim().length > 0)) ||
    images.some((img) => Boolean(img.sourceAndLicense?.trim()));
  const item7: QualityCheckItem = {
    id: 'has_sources',
    label: '출처 표기가 있는가',
    passed: manual['has_sources'] !== undefined ? manual['has_sources'] : hasReferences,
    isAuto: true,
    scoreWeight: 10,
    message: hasReferences
      ? '참고 자료 또는 섹션별 출처가 명시되어 있습니다.'
      : '교안 말미에 활용한 논문, 도서, 웹사이트 등의 출처와 참고문헌을 표기하세요.',
    tip: '저작권 준수와 학습자의 심화 학습 경로 제공을 위해 출처는 필수입니다.',
  };

  return [item1, item2, item3, item4, item5, item6, item7];
}

export function calculateChecklistScore(items: QualityCheckItem[]): number {
  if (items.length === 0) return 0;
  const totalWeight = items.reduce((acc, cur) => acc + cur.scoreWeight, 0);
  const earnedWeight = items.reduce((acc, cur) => (cur.passed ? acc + cur.scoreWeight : acc), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}
