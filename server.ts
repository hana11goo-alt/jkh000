import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini draft generation endpoint
app.post('/api/generate-draft', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. AI Studio Secrets에서 설정해주세요.'
      });
    }

    const { course, week, templateSections } = req.body;

    if (!week || !week.topic) {
      return res.status(400).json({ error: '주차 주제(topic) 정보가 필요합니다.' });
    }

    // Initialize Gemini SDK with User-Agent header as required
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const activeSections = (templateSections || [])
      .filter((s: any) => s.enabled)
      .sort((a: any, b: any) => a.order - b.order);

    const prompt = `
당신은 최고의 교육학 및 교수설계(Instructional Design) 전문가입니다.
사용자가 입력한 과목 정보, 주차별 정보, 이미지 계획을 바탕으로 가독성 높고 체계적인 '주차별 강의교안 초안'을 생성하세요.

[과목 정보]
- 과목명: ${course?.name || '미지정'}
- 대상 학습자: ${course?.targetAudience || '성인 학습자/대학생'}
- 수업 시간: ${course?.classDurationMinutes || 90}분
- 수업 방식: ${course?.deliveryMethod || '대면'}
- 과목 개요: ${course?.overview || '없음'}

[해당 주차 정보]
- 주차: 제${week.weekNumber}주차
- 주제: ${week.topic}
- 학습목표: ${Array.isArray(week.learningObjectives) && week.learningObjectives.length > 0 ? week.learningObjectives.join(' / ') : '미지정 (측정 가능한 동사로 적절히 제안)'}
- 핵심 키워드: ${Array.isArray(week.keywords) ? week.keywords.join(', ') : ''}
- 핵심 개념: ${Array.isArray(week.keyConcepts) ? week.keyConcepts.map((c: any) => `${c.name}: ${c.description}`).join(' | ') : '미지정'}
- 참고 자료/메모: ${week.references || '없음'}
- 평가 정보: ${week.evaluationInfo || '없음'}
- 이미지 계획: ${Array.isArray(week.imagePlans) && week.imagePlans.length > 0 ? JSON.stringify(week.imagePlans) : '없음'}

[적용할 교안 양식 섹션 및 배분 시간]
${activeSections.map((s: any) => `- ${s.name} (${s.id}): 배분 시간 ${s.durationMinutes}분 (${s.description})`).join('\n')}

[교안 작성 12대 원칙 - 반드시 준수]
1. 한 슬라이드(페이지)에는 하나의 메시지. 제목은 반드시 명확한 서술형으로 작성 (예: "데이터 분석" (X) -> "데이터 분석은 문제 정의부터 시각화까지 4단계로 진행된다" (O))
2. 구성은 반드시 [도입 -> 전개 -> 정리] 순서 (도입: 학습목표와 지난 주 복습, 정리: 핵심 요약과 다음 주 예고).
3. 핵심 개념은 주당 3~5개로 엄격히 제한.
4. 긴 설명 문장 대신 키워드와 구 중심으로 작성. 한 항목은 한 줄, 한 파트는 5~7줄 이내로 간결화.
5. 목록 계층은 최대 2단계. 항목의 어미와 문장 형태 통일 (예: 명사형 종결 또는 ~함 종결).
6. 전문 용어는 처음 등장할 때 명확히 정의하고 이후 일관되게 사용.
7. 학습목표는 Bloom 분류학에 따라 측정 가능한 행동 동사로 작성 ("이해한다", "안다" 대신 "설명할 수 있다", "분류할 수 있다", "도출할 수 있다", "구현할 수 있다").
8. 각 파트(또는 정리 파트) 끝에 "핵심 요약 박스" 1개를 반드시 포함.
9. 10~15분 간격으로 질문, 토론 또는 실습 활동 항목을 1개씩 적절히 배치.
10. 개념 설명 시 실무 예시와 흔한 반례(오개념)를 함께 제시.
11. 강조(굵게/중요 표시)는 한 페이지에 1~2곳으로 절제.
12. 출처와 참고문헌은 마지막에 모아서 명확히 표기.
13. [중요 사실 왜곡 방지]: 사용자가 입력하지 않은 구체적인 통계 수치, 논문 인용, 연도 등은 지어내지 말고 반드시 "[확인 필요]"로 표시할 것.
14. 이미지 계획이 있을 경우, 본문 내용과 가장 잘 어울리는 위치에 "[이미지: (이미지 설명 및 유형)]" 형태의 자리표시자를 삽입할 것.

반드시 아래 JSON 포맷으로만 응답하세요. 다른 부가 설명(markdown code block 외 텍스트 등)은 배제하고 순수 JSON 객체만 반환하세요:

{
  "learningObjectives": ["측정 가능한 동사로 끝나는 학습목표 1", "학습목표 2", "학습목표 3"],
  "sections": [
    {
      "sectionId": "섹션 ID (intro / development / summary / activity / evaluation 중 해당되는 것)",
      "sectionName": "섹션명 (도입 / 전개 / 정리 / 활동 / 평가)",
      "title": "서술형으로 작성된 명확한 메시지 제목 (예: 체계적 교수설계는 학습 성과를 2배 향상시킨다)",
      "allocatedTime": 15,
      "items": [
        "간결한 구 중심의 교안 세부 항목 1",
        "간결한 구 중심의 교안 세부 항목 2 [이미지: 개념도 - 핵심 프로세스 흐름]",
        "간결한 구 중심의 교안 세부 항목 3"
      ],
      "summaryBox": "해당 섹션의 핵심 메시지를 1~2문장으로 압축한 요약 박스 내용",
      "activity": {
        "title": "학습자 참여 질문/활동명",
        "prompt": "학습자에게 던지는 구체적인 발문 또는 5분 실습 지침",
        "duration": 5
      },
      "sources": ["참고 문헌 또는 [확인 필요] 출처"]
    }
  ],
  "overallSummary": "이번 주차 전체를 아우르는 최종 한 줄 요약",
  "nextWeekPreview": "다음 주차 학습 내용 예고"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean possible markdown code fences
      const cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Gemini Draft Generation Error:', error);
    return res.status(500).json({
      error: error.message || 'AI 초안 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
});

// Start Express server and connect Vite in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`강의교안 작성 도우미 서버 가동 중: http://localhost:${port}`);
  });
}

startServer();
