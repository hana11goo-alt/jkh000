import { Course, SectionTemplate, WeekPlan } from '../types';

export const DEFAULT_TEMPLATE_SECTIONS: SectionTemplate[] = [
  {
    id: 'intro',
    name: '도입 (Introduction)',
    enabled: true,
    durationMinutes: 15,
    order: 1,
    description: '주의 환기, 지난 주차 핵심 복습, 이번 주차 학습목표 및 선수지식 확인',
  },
  {
    id: 'development',
    name: '전개 (Development)',
    enabled: true,
    durationMinutes: 50,
    order: 2,
    description: '핵심 개념 3~5개 설명, 실무 예시 및 흔한 반례 제시, 시각 자료 연계',
  },
  {
    id: 'activity',
    name: '활동 (Activity)',
    enabled: true,
    durationMinutes: 15,
    order: 3,
    description: '10~15분 간격 학습자 질문, 짝 토론, 5분 미니 실습 또는 퀴즈',
  },
  {
    id: 'summary',
    name: '정리 (Summary)',
    enabled: true,
    durationMinutes: 10,
    order: 4,
    description: '핵심 요약 박스 확인, Q&A 질의응답, 과제 및 다음 주차 예고',
  },
  {
    id: 'evaluation',
    name: '평가 (Evaluation)',
    enabled: false,
    durationMinutes: 0,
    order: 5,
    description: '형성평가, 퀴즈, 실습 루브릭 체크 및 피드백 제공',
  },
];

export const INITIAL_SAMPLE_COURSE: Course = {
  id: 'course-sample-01',
  name: '디지털 교수설계와 에듀테크 실무',
  credits: 3,
  targetAudience: '성인 직무 교육생, 사내 강사 및 대학 교수자',
  classDurationMinutes: 90,
  deliveryMethod: 'hybrid',
  totalWeeks: 15,
  overview:
    '본 교과목은 성인 학습자의 인지적 특성을 반영하여 효과적인 교육과정을 기획하고, ADDIE 모형 기반의 체계적 교수설계와 최신 에듀테크 도구를 활용해 현업에 즉시 적용 가능한 양질의 강의교안을 개발하는 실습 중심 과정입니다.',
  templateSections: DEFAULT_TEMPLATE_SECTIONS,
  updatedAt: new Date().toISOString(),
  weeks: [
    {
      id: 'week-1',
      weekNumber: 1,
      topic: '성인 학습자의 특성과 효과적인 교수설계 기본 원리',
      status: 'completed',
      learningObjectives: [
        '성인 학습자(Andragogy)의 5대 핵심 특성을 아동 학습자와 구별하여 설명할 수 있다.',
        '밀러의 법칙과 인지부하 이론을 교수설계 관점에서 비교·분석할 수 있다.',
        '효과적인 강의 도입부를 위한 Gagne의 9가지 수업사태 중 도입 3단계를 적용할 수 있다.',
      ],
      keywords: ['앤드라고지', '자기주도학습', '인지부하 이론', '가네 9가지 수업사태', '성인학습자'],
      keyConcepts: [
        {
          name: '앤드라고지(Andragogy)',
          description: '말콤 놀즈가 제안한 이론으로 성인의 자기주도성, 풍부한 경험, 즉각적 실용성을 중시하는 학습 원리',
        },
        {
          name: '인지 부하 이론(Cognitive Load Theory)',
          description: '작업기억의 한계로 인해 외재적 부하를 최소화하고 본질적 인지부하를 촉진해야 한다는 학습 이론',
        },
        {
          name: '가네의 수업 사태(Gagne 9 Events)',
          description: '학습자의 내적 인지과정을 지원하기 위해 주의집중, 목표제시, 선수학습 상기 등 단계별 교수 활동을 조직하는 모델',
        },
      ],
      references: '말콤 놀즈(Malcolm Knowles)의 성인학습 이론; 존 스웰러(John Sweller) 인지부하 연구 논문 (1988)',
      evaluationInfo: '자가진단 체크리스트 제출 및 1주차 학습 성찰 일지 (Pass/Fail)',
      imagePlans: [
        {
          id: 'img-1-1',
          conceptName: '앤드라고지와 페다고지의 5대 비교 축',
          imageType: 'concept',
          caption: '성인 학습자와 아동 학습자의 자아개념, 경험, 학습 준비도, 시간 조망 비교 다이어그램',
          altText: '앤드라고지와 페다고지의 5대 핵심 차이점을 비교한 개념도',
          sourceAndLicense: '자체 제작 (CC-BY-SA 4.0)',
          imageUrl: '',
        },
      ],
      generatedSections: [
        {
          sectionId: 'intro',
          sectionName: '도입 (Introduction)',
          title: '성인 학습자는 자신의 경험과 직접 연결될 때 가장 능동적으로 몰입한다',
          allocatedTime: 15,
          items: [
            '오리엔테이션 및 성인 학습 환경에서의 동기 유발 전략 공유',
            '성인 학습자의 특성과 본 과정의 연계 필요성 선언',
            '3가지 측정 가능한 학습목표 제시 및 사전 경험 연결',
            '지난 사전 설문 결과 공유 및 이번 주차 로드맵 확인 [이미지: 개념도 - 학습자 분석]',
          ],
          summaryBox: '성인 학습자는 일방적 지식 전달보다 자신의 문제 해결과 경험 가치 인정에 반응합니다.',
          activity: {
            title: '아이스브레이킹 발문',
            prompt: '최근 참여했던 교육 중 가장 기억에 남거나 답답했던 순간을 1분간 옆 짝과 공유해보세요.',
            duration: 5,
          },
          sources: ['Knowles, M. (1984). The Adult Learner.'],
        },
        {
          sectionId: 'development',
          sectionName: '전개 (Development)',
          title: '인지 부하를 줄이는 교수설계는 학습 성과를 2배 향상시킨다',
          allocatedTime: 50,
          items: [
            '앤드라고지 5대 원리: 자아개념, 경험의 자원화, 과업 중심성, 내재적 동기',
            '밀러의 법칙: 작업기억 용량(7±2)을 고려한 한 페이지 5~7행 원칙',
            '외재적 인지부하 제거: 화려한 애니메이션과 불필요한 장식 그래픽 배제',
            '실무 예시: 복잡한 텍스트 슬라이드를 한 슬라이드 한 메시지 구조로 변환한 사례',
            '흔한 오개념 반례: 많은 양을 빠르게 전달하는 것이 성실한 교수라는 편견 교정',
          ],
          summaryBox: '교안의 핵심은 무엇을 더 넣을지가 아니라, 학습자의 인지 부하를 줄이기 위해 무엇을 덜어낼지에 있습니다.',
          activity: {
            title: '슬라이드 인지부하 다이어트 실습',
            prompt: '예시 슬라이드에서 외재적 인지부하를 유발하는 요소 2가지를 찾아 채팅창 또는 포스트잇에 적어보세요.',
            duration: 8,
          },
          sources: ['Sweller, J. (1988). Cognitive Load During Problem Solving.'],
        },
        {
          sectionId: 'activity',
          sectionName: '활동 (Activity)',
          title: '동료 교수자 피드백을 통해 교수설계안의 군더더기를 걷어낸다',
          allocatedTime: 15,
          items: [
            '2인 1조 짝 피드백 활동 가이드라인 배포',
            '상호 교안 초안 1개 슬라이드 교환 및 3가지 질문 점검',
            '핵심 질문: "이 슬라이드의 단 하나의 메시지는 무엇인가?"',
          ],
          activity: {
            title: '1:1 동료 교안 리뷰',
            prompt: '짝의 교안에서 제목이 서술형인지, 핵심 개념이 5개 이내인지 상호 교차 점검하세요.',
            duration: 10,
          },
        },
        {
          sectionId: 'summary',
          sectionName: '정리 (Summary)',
          title: '오늘의 학습을 매핑하고 2주차 ADDIE 실무로 확장한다',
          allocatedTime: 10,
          items: [
            '핵심 3대 원리 종합: 성인 학습자 존중 + 인지부하 제어 + 측정 가능한 목표',
            '질의응답 및 현장 애로사항 3문 3답',
            '다음 주차 예고: ADDIE 모형 중 A(요구분석)와 D(설계) 실제 템플릿 실습',
          ],
          summaryBox: '오늘의 한 줄: "강의교안은 강사의 지식 저장소가 아니라 학습자의 인지 지도(Cognitive Map)입니다."',
        },
      ],
      overallSummary: '성인 학습자의 자기주도성을 존중하고 외재적 인지 부하를 줄이는 것이 명품 교안의 첫걸음입니다.',
      nextWeekPreview: '제2주차에는 ADDIE 모형을 기반으로 실제 교육 현장의 요구분석 기법과 교육과정 로드맵 설계를 진행합니다.',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'week-2',
      weekNumber: 2,
      topic: 'ADDIE 모형을 활용한 체계적 교육과정 개발 프로세스',
      status: 'completed',
      learningObjectives: [
        'ADDIE 5단계(분석, 설계, 개발, 실행, 평가)의 유기적 순환 관계를 설명할 수 있다.',
        '학습자 및 직무 요구분석(Needs Analysis) 질문지를 3개 영역으로 설계할 수 있다.',
        '분석 결과에 근거하여 15주차 강의 개요서 초안을 도출할 수 있다.',
      ],
      keywords: ['ADDIE 모형', '요구분석', '교수설계', '형성평가', '교육과정 로드맵'],
      keyConcepts: [
        {
          name: 'ADDIE 모형',
          description: '분석(Analysis), 설계(Design), 개발(Development), 실행(Implementation), 평가(Evaluation)의 대표적 교수설계 체제',
        },
        {
          name: '요구 분석(Needs Assessment)',
          description: '학습자의 바람직한 상태(Should be)와 현재 상태(Is) 사이의 격차(Gap)를 찾아 교육 우선순위를 정하는 기법',
        },
        {
          name: '교육과정 로드맵(Curriculum Roadmap)',
          description: '전체 주차별 학습 흐름과 선수 지식 연계성을 한눈에 조망할 수 있는 구조화된 시각적 설계도',
        },
      ],
      references: 'Dick, W., Carey, L., & Carey, J. O. (2014). The Systematic Design of Instruction.',
      evaluationInfo: '요구분석 인터뷰 질문지 초안 제출 (과제 비중 10%)',
      imagePlans: [
        {
          id: 'img-2-1',
          conceptName: 'ADDIE 5단계 순환 프로세스 흐름도',
          imageType: 'flowchart',
          caption: '분석부터 평가까지 각 단계별 산출물과 피드백 루프를 나타낸 순서도',
          altText: 'ADDIE 모형의 5단계 프로세스와 각 단계 산출물 순서도',
          sourceAndLicense: '자체 작성 다이어그램 (CC-BY 4.0)',
          imageUrl: '',
        },
      ],
      generatedSections: [
        {
          sectionId: 'intro',
          sectionName: '도입 (Introduction)',
          title: '교육 기획의 실패는 대부분 요구분석의 결핍에서 시작된다',
          allocatedTime: 15,
          items: [
            '1주차 성인학습 원리 복습 퀴즈: "작업기억의 한계 용량은 몇 개인가?"',
            '현업에서 자주 발생하는 "교육 후 현장 전이 실패" 사례 공유',
            '2주차 학습목표 및 ADDIE 프로세스 개관 제시 [이미지: 순서도 - ADDIE 5단계]',
          ],
          summaryBox: '정확한 처방은 정확한 진단에서 나오듯, 훌륭한 강의는 학습자의 결핍(Gap)을 파악하는 데서 시작합니다.',
        },
        {
          sectionId: 'development',
          sectionName: '전개 (Development)',
          title: 'ADDIE 모형은 주먹구구식 강의를 표준화된 전문 교육으로 전환한다',
          allocatedTime: 50,
          items: [
            'Analysis(분석): 학습자 분석, 환경 분석, 직무 과업 분석 기법 3가지',
            'Design(설계): 행동 목표 진술, 평가 도구 사전 설계, 교수 전략 매트릭스',
            'Development(개발): 강의교안 제작, 워크시트 및 실습 데이터셋 구성',
            'Implementation & Evaluation: 강의 시연과 Kirkpatrick 4단계 평가 모델',
            '오개념 바로잡기: ADDIE는 경직된 선형 절차가 아니라 지속적 피드백 루프임',
          ],
          summaryBox: '설계(Design) 단계에서 평가 방법을 먼저 확정하는 후향식 설계(Backward Design)가 핵심입니다.',
          activity: {
            title: '학습자 결핍(Gap) 도출 5분 워크시트',
            prompt: '여러분이 가르칠 대상 학습자의 현재 부족한 점 1가지와 교육 후 도달해야 할 수준을 문장으로 작성하세요.',
            duration: 7,
          },
        },
        {
          sectionId: 'summary',
          sectionName: '정리 (Summary)',
          title: '분석과 설계를 탄탄히 다질 때 교안 제작 시간은 절반으로 단축된다',
          allocatedTime: 10,
          items: [
            '2주차 핵심 요약: ADDIE의 가치는 분석의 깊이와 설계의 엄밀성에 있음',
            '질의응답 및 다음 주차 예고: 블룸의 분류학을 활용한 날카로운 학습목표 쓰기',
          ],
          summaryBox: '오늘의 원칙: "계획에 1시간을 투자하면 교안 수정에 낭비되는 5시간을 아낄 수 있습니다."',
        },
      ],
      overallSummary: 'ADDIE 모형을 통해 학습자의 요구를 정밀 진단하고 체계적인 로드맵을 구축했습니다.',
      nextWeekPreview: '제3주차에는 "알 수 있다"는 모호함을 벗어나 측정 가능한 학습목표를 도출하는 블룸의 분류학을 학습합니다.',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'week-3',
      weekNumber: 3,
      topic: '측정 가능한 학습목표 수립과 블룸(Bloom)의 교육목표 분류학',
      status: 'draft',
      learningObjectives: [
        '블룸(Bloom)의 신교육목표 분류학 6단계를 위계별로 구분할 수 있다.',
        '모호한 진술("이해한다", "안다")을 관찰 가능한 행동 동사로 교정할 수 있다.',
        'ABCD 모델(Audience, Behavior, Condition, Degree)에 따라 학습목표를 완성할 수 있다.',
      ],
      keywords: ['블룸 분류학', '행동 동사', 'ABCD 모델', '측정 가능성', '인지 도메인'],
      keyConcepts: [
        {
          name: '블룸의 인지적 목표 분류학',
          description: '기억하기 -> 이해하기 -> 적용하기 -> 분석하기 -> 평가하기 -> 창안하기의 6단계 위계 모델',
        },
        {
          name: 'ABCD 학습목표 진술법',
          description: '대상(Audience), 행동(Behavior), 조건(Condition), 기준(Degree)을 갖춘 완전한 목표 진술 공식',
        },
        {
          name: '측정 가능한 행동 동사',
          description: '관찰 및 채점이 가능하도록 "열거한다", "구현한다", "분류한다" 등으로 끝맺는 동사 표현',
        },
      ],
      references: 'Anderson, L. W., & Krathwohl, D. R. (2001). A Taxonomy for Learning, Teaching, and Assessing.',
      evaluationInfo: '학습목표 작성 과제 (3개 작성 후 상호 평가)',
      imagePlans: [
        {
          id: 'img-3-1',
          conceptName: '블룸의 신교육목표 6단계 피라미드',
          imageType: 'concept',
          caption: '기억부터 창조까지 인지적 깊이의 상승을 나타낸 피라미드 다이어그램',
          altText: '블룸의 교육목표 6단계 인지 영역 피라미드 구조도',
          sourceAndLicense: '교육학 표준 도판 (공유 저작물)',
          imageUrl: '',
        },
      ],
      generatedSections: [
        {
          sectionId: 'intro',
          sectionName: '도입 (Introduction)',
          title: '학습목표가 모호하면 강사도 어디로 가는지 모른 채 강의하게 된다',
          allocatedTime: 15,
          items: [
            '지난주 ADDIE 설계 단계 복습: 목표-내용-평가의 삼위일체',
            '나쁜 학습목표 예시: "교수설계에 대해 폭넓게 이해한다"',
            '좋은 학습목표 예시: "ADDIE 5단계의 산출물을 각각 1가지 이상 나열할 수 있다"',
          ],
          summaryBox: '학습목표는 평가의 기준이자 교안 분량 조절의 나침반입니다.',
        },
        {
          sectionId: 'development',
          sectionName: '전개 (Development)',
          title: '블룸의 6단계 분류학은 학습자를 단순 암기에서 고차원적 문제 해결로 이끈다',
          allocatedTime: 50,
          items: [
            '1~2단계 하위 인지: 기억(Remember)과 이해(Understand)의 적절한 활용',
            '3~4단계 중위 인지: 적용(Apply)과 분석(Analyze)을 통한 현업 전이',
            '5~6단계 상위 인지: 평가(Evaluate)와 창조(Create)를 촉진하는 과제 설계',
            'ABCD 공식 적용: 조건(도구 사용 시), 기준(오차 10% 이내), 행동(작성할 수 있다)',
          ],
          summaryBox: '강의의 70%는 "기억·이해"에 머물지 않고 "적용·분석" 이상을 지향해야 합니다.',
        },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'week-4',
      weekNumber: 4,
      topic: '상호작용 촉진을 위한 교수학습 전략과 에듀테크 도구 선정',
      status: 'draft',
      learningObjectives: [
        '교수자-학습자, 학습자-학습자 상호작용의 3대 유형을 분류할 수 있다.',
        '패들렛, 멘티미터, 카훗 등 에듀테크 도구의 수업 목적별 적합성을 평가할 수 있다.',
        '10~15분 주기 집중도 유지를 위한 미니 인터랙션 활동안을 설계할 수 있다.',
      ],
      keywords: ['상호작용', '에듀테크', '멘티미터', '패들렛', '플립러닝', '수업 몰입'],
      keyConcepts: [
        {
          name: 'Moore의 상호작용 3유형',
          description: '학습자-내용, 학습자-교수자, 학습자-학습자 간의 다차원적 상호작용 이론',
        },
        {
          name: '에듀테크 매핑(EdTech Mapping)',
          description: '화려한 도구 나열이 아닌, 학습 목표 도달에 최적화된 디지털 도구를 기능별로 매칭하는 작업',
        },
      ],
      references: 'Moore, M. G. (1989). Three types of interaction. American Journal of Distance Education.',
      evaluationInfo: '인터랙션 활동 시연 (3분 마이크로티칭)',
      imagePlans: [],
      generatedSections: [],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'week-5',
      weekNumber: 5,
      topic: '형성평가 및 총괄평가 설계와 루브릭(Rubric) 개발',
      status: 'not_started',
      learningObjectives: [
        '진단평가, 형성평가, 총괄평가의 기능과 적용 시점을 명확히 구분할 수 있다.',
        '성취 수준별 평가 기준을 명시한 분석적 루브릭(Rubric)을 제작할 수 있다.',
      ],
      keywords: ['루브릭', '형성평가', '총괄평가', '피드백', '채점 기준표'],
      keyConcepts: [
        {
          name: '분석적 루브릭(Analytic Rubric)',
          description: '평가 준거(Criteria)와 성취 수준(Levels of Performance)을 격자형으로 기술한 투명한 평가 기준표',
        },
      ],
      references: 'Brookhart, S. M. (2018). How to create and use rubrics for formative assessment and grading.',
      evaluationInfo: '루브릭 양식 제작 과제',
      imagePlans: [],
      generatedSections: [],
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Generate remaining weeks if total is higher than sample length
export function getFullWeeksForCourse(totalWeeks: number, existingWeeks: WeekPlan[]): WeekPlan[] {
  const result: WeekPlan[] = [...existingWeeks];

  for (let i = result.length + 1; i <= totalWeeks; i++) {
    result.push({
      id: `week-${i}`,
      weekNumber: i,
      topic: `제${i}주차 강의 주제를 입력하세요`,
      status: 'not_started',
      learningObjectives: [],
      keywords: [],
      keyConcepts: [],
      references: '',
      evaluationInfo: '',
      imagePlans: [],
      generatedSections: [],
      updatedAt: new Date().toISOString(),
    });
  }

  // If totalWeeks is less, slice
  return result.slice(0, totalWeeks);
}
