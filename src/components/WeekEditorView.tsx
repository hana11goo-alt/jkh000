import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Eye,
  Check,
  Edit2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Course, WeekPlan, WeekStatus, GeneratedSection, KeyConcept } from '../types';
import { ImagePlanSection } from './ImagePlanSection';
import { QualityChecklistBar } from './QualityChecklistBar';

interface WeekEditorViewProps {
  course: Course;
  weekNumber: number;
  onUpdateWeek: (updatedWeek: WeekPlan) => void;
  onNavigateWeek: (targetWeekNumber: number) => void;
}

const ACTION_VERB_SUGGESTIONS = [
  '설명할 수 있다',
  '분류할 수 있다',
  '설계할 수 있다',
  '구현할 수 있다',
  '도출할 수 있다',
  '비교·분석할 수 있다',
  '평가할 수 있다',
  '적용할 수 있다',
];

export const WeekEditorView: React.FC<WeekEditorViewProps> = ({
  course,
  weekNumber,
  onUpdateWeek,
  onNavigateWeek,
}) => {
  const currentWeek = course.weeks.find((w) => w.weekNumber === weekNumber) || course.weeks[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');

  // Handle local state updates to current week
  const handleUpdate = (field: keyof WeekPlan, value: any) => {
    onUpdateWeek({
      ...currentWeek,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Learning Objectives
  const handleAddObjective = () => {
    if ((currentWeek.learningObjectives?.length || 0) >= 3) return;
    const current = currentWeek.learningObjectives || [];
    handleUpdate('learningObjectives', [...current, '']);
  };

  const handleUpdateObjective = (index: number, val: string) => {
    const list = [...(currentWeek.learningObjectives || [])];
    list[index] = val;
    handleUpdate('learningObjectives', list);
  };

  const handleRemoveObjective = (index: number) => {
    const list = (currentWeek.learningObjectives || []).filter((_, i) => i !== index);
    handleUpdate('learningObjectives', list);
  };

  const handleAppendVerbToObjective = (index: number, verb: string) => {
    const list = [...(currentWeek.learningObjectives || [])];
    const currentText = (list[index] || '').trim();
    if (!currentText) {
      list[index] = `~에 대해 ${verb}`;
    } else {
      list[index] = `${currentText} ${verb}`;
    }
    handleUpdate('learningObjectives', list);
  };

  // Key Concepts
  const handleAddKeyConcept = () => {
    if ((currentWeek.keyConcepts?.length || 0) >= 5) return;
    const current = currentWeek.keyConcepts || [];
    handleUpdate('keyConcepts', [...current, { name: '', description: '' }]);
  };

  const handleUpdateKeyConcept = (index: number, field: keyof KeyConcept, val: string) => {
    const list = [...(currentWeek.keyConcepts || [])];
    list[index] = { ...list[index], [field]: val };
    handleUpdate('keyConcepts', list);
  };

  const handleRemoveKeyConcept = (index: number) => {
    const list = (currentWeek.keyConcepts || []).filter((_, i) => i !== index);
    handleUpdate('keyConcepts', list);
  };

  // Keywords
  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = currentWeek.keywords || [];
    if (!current.includes(keywordInput.trim())) {
      handleUpdate('keywords', [...current, keywordInput.trim()]);
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    const current = currentWeek.keywords || [];
    handleUpdate('keywords', current.filter((k) => k !== kw));
  };

  // Generated Section in Preview Inline Editing
  const handleUpdateSectionField = (secIndex: number, field: keyof GeneratedSection, value: any) => {
    const sections = [...(currentWeek.generatedSections || [])];
    sections[secIndex] = {
      ...sections[secIndex],
      [field]: value,
    };
    handleUpdate('generatedSections', sections);
  };

  const handleUpdateSectionItem = (secIndex: number, itemIndex: number, text: string) => {
    const sections = [...(currentWeek.generatedSections || [])];
    const items = [...(sections[secIndex].items || [])];
    items[itemIndex] = text;
    sections[secIndex] = { ...sections[secIndex], items };
    handleUpdate('generatedSections', sections);
  };

  const handleAddSectionItem = (secIndex: number) => {
    const sections = [...(currentWeek.generatedSections || [])];
    const items = [...(sections[secIndex].items || []), '새 항목을 입력하세요'];
    sections[secIndex] = { ...sections[secIndex], items };
    handleUpdate('generatedSections', sections);
  };

  const handleRemoveSectionItem = (secIndex: number, itemIndex: number) => {
    const sections = [...(currentWeek.generatedSections || [])];
    const items = (sections[secIndex].items || []).filter((_, i) => i !== itemIndex);
    sections[secIndex] = { ...sections[secIndex], items };
    handleUpdate('generatedSections', sections);
  };

  // Manual Checklist override
  const handleChecklistOverride = (key: string, val: boolean) => {
    const overrides = { ...(currentWeek.checklistManualOverrides || {}) };
    overrides[key] = val;
    handleUpdate('checklistManualOverrides', overrides);
  };

  // Call Gemini API server endpoint
  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: {
            name: course.name,
            credits: course.credits,
            targetAudience: course.targetAudience,
            classDurationMinutes: course.classDurationMinutes,
            deliveryMethod: course.deliveryMethod,
            overview: course.overview,
          },
          week: currentWeek,
          templateSections: course.templateSections,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'AI 초안 생성에 실패했습니다.');
      }

      const aiData = result.data;

      // Update week with AI results
      const updatedWeek: WeekPlan = {
        ...currentWeek,
        status: 'draft',
        learningObjectives:
          aiData.learningObjectives && aiData.learningObjectives.length > 0
            ? aiData.learningObjectives
            : currentWeek.learningObjectives,
        generatedSections: aiData.sections || [],
        overallSummary: aiData.overallSummary || currentWeek.overallSummary,
        nextWeekPreview: aiData.nextWeekPreview || currentWeek.nextWeekPreview,
        updatedAt: new Date().toISOString(),
      };

      onUpdateWeek(updatedWeek);
    } catch (err: any) {
      console.error('AI Draft failed:', err);
      setGenerateError(err.message || 'AI 초안 생성 중 통신 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Week Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateWeek(weekNumber - 1)}
            disabled={weekNumber <= 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            title="이전 주차로 이동"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={weekNumber}
              onChange={(e) => onNavigateWeek(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-900 rounded-xl text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            >
              {course.weeks.map((w) => (
                <option key={w.id} value={w.weekNumber}>
                  제{w.weekNumber}주차: {w.topic || '주제 미작성'} (
                  {w.status === 'completed' ? '완료' : w.status === 'draft' ? '초안' : '미작성'})
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-500 hidden sm:inline">
              (총 {course.weeks.length}주 중 {weekNumber}주차)
            </span>
          </div>

          <button
            onClick={() => onNavigateWeek(weekNumber + 1)}
            disabled={weekNumber >= course.weeks.length}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            title="다음 주차로 이동"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 px-2">상태:</span>
            {(['not_started', 'draft', 'completed'] as WeekStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleUpdate('status', st)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentWeek.status === st
                    ? st === 'completed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : st === 'draft'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'completed' ? '완료' : st === 'draft' ? '초안' : '미작성'}
              </button>
            ))}
          </div>

          {/* AI Generate Button */}
          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-red-200" />
                <span>교안 초안 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI 초안 생성 (Gemini)</span>
              </>
            )}
          </button>

          {currentWeek.generatedSections?.length > 0 && (
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              title="현재 입력 내용으로 AI 교안을 다시 생성합니다"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 생성</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {generateError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-rose-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">AI 교안 생성 실패</p>
              <p className="text-xs mt-0.5">{generateError}</p>
            </div>
          </div>
          <button
            onClick={handleGenerateDraft}
            className="text-xs font-bold bg-white text-rose-700 hover:bg-rose-100 border border-rose-300 px-3 py-1 rounded-lg shrink-0 cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 2-Column Main Layout: Left Input Panel / Right Live Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">주차별 핵심 내용 입력</h3>
              </div>
              <span className="text-[11px] text-slate-400">교수설계 기본 입력 항목</span>
            </div>

            {/* Topic Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  주차 주제 (Topic) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">원칙 1: 명확한 서술형 메시지 지향</span>
              </div>
              <input
                type="text"
                value={currentWeek.topic}
                onChange={(e) => handleUpdate('topic', e.target.value)}
                placeholder="예: ADDIE 모형을 활용한 체계적 교육과정 개발 프로세스"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-semibold"
              />
            </div>

            {/* Learning Objectives (Max 3) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    학습목표 (최대 3개)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    원칙 7: 측정 가능한 행동 동사 사용 ("이해한다" 대신 "~할 수 있다")
                  </p>
                </div>
                {(currentWeek.learningObjectives?.length || 0) < 3 && (
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-lg border border-red-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>목표 추가</span>
                  </button>
                )}
              </div>

              {/* Action Verbs Recommendation Pills */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  행동 동사 추천 태그 (클릭 시 현재 선택 목표 끝에 자동 적용):
                </span>
                <div className="flex flex-wrap gap-1">
                  {ACTION_VERB_SUGGESTIONS.map((verb) => (
                    <button
                      key={verb}
                      type="button"
                      onClick={() => {
                        const targetIdx = Math.max(0, (currentWeek.learningObjectives?.length || 1) - 1);
                        handleAppendVerbToObjective(targetIdx, verb);
                      }}
                      className="text-[11px] font-medium bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 px-2 py-1 rounded-md border border-slate-200 hover:border-red-300 transition-colors cursor-pointer"
                    >
                      +{verb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objective Input Items */}
              <div className="space-y-2">
                {(currentWeek.learningObjectives || []).map((obj, idx) => {
                  const hasUnmeasurable = ['이해한다', '안다', '배운다', '파악한다'].some((v) => obj.includes(v));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-red-600 w-5 text-center">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                          placeholder={`예: 성인 학습자의 5대 핵심 특성을 구별하여 설명할 수 있다.`}
                          className={`flex-1 px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-1 ${
                            hasUnmeasurable
                              ? 'border-amber-400 focus:ring-amber-400'
                              : 'border-slate-200 focus:ring-red-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {hasUnmeasurable && (
                        <p className="text-[10px] text-amber-700 pl-7 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          "이해한다"는 평가가 어렵습니다. "~을 설명할 수 있다", "~을 분류할 수 있다"로 변경해보세요.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                핵심 키워드
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="키워드 입력 후 Enter 또는 추가 버튼"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                >
                  추가
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(currentWeek.keywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-100 font-medium"
                  >
                    #{kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-red-400 hover:text-red-900 cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Concepts (Max 5) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    핵심 개념 (최대 5개, 현재 {currentWeek.keyConcepts?.length || 0}개)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    원칙 3: 인지 부하 감소를 위해 주당 3~5개로 엄격히 제한
                  </p>
                </div>
                {(currentWeek.keyConcepts?.length || 0) < 5 && (
                  <button
                    type="button"
                    onClick={handleAddKeyConcept}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-lg border border-red-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>개념 추가</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(currentWeek.keyConcepts || []).map((concept, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={concept.name}
                        onChange={(e) => handleUpdateKeyConcept(idx, 'name', e.target.value)}
                        placeholder={`개념명 (예: 앤드라고지)`}
                        className="w-1/3 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-bold text-red-900"
                      />
                      <input
                        type="text"
                        value={concept.description}
                        onChange={(e) => handleUpdateKeyConcept(idx, 'description', e.target.value)}
                        placeholder={`한 줄 정의 (예: 성인의 경험과 자기주도성을 중시하는 교육 원리)`}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyConcept(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Materials & Evaluation Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  참고 자료 / 메모
                </label>
                <textarea
                  rows={2}
                  value={currentWeek.references}
                  onChange={(e) => handleUpdate('references', e.target.value)}
                  placeholder="참고 문헌, 교재 페이지, 웹 링크 등"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  평가 정보 (과제, 퀴즈)
                </label>
                <textarea
                  rows={2}
                  value={currentWeek.evaluationInfo}
                  onChange={(e) => handleUpdate('evaluationInfo', e.target.value)}
                  placeholder="형성평가 질문, 퀴즈 5문항, 과제 제출 등"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>
            </div>

            {/* Image Plan Section */}
            <div className="pt-3 border-t border-slate-100">
              <ImagePlanSection
                imagePlans={currentWeek.imagePlans || []}
                onChange={(plans) => handleUpdate('imagePlans', plans)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Interactive Preview Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            {/* Preview Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">실시간 교안 미리보기 (인라인 편집 가능)</h3>
              </div>
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                클릭하여 문구 직접 수정
              </span>
            </div>

            {/* Preview Document Paper Simulation */}
            <div className="space-y-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80">
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  제{currentWeek.weekNumber}주차 강의교안
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-2 tracking-tight">
                  {currentWeek.topic || '주제 미작성'}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>과목: {course.name}</span>
                  <span>•</span>
                  <span>시간: {course.classDurationMinutes}분</span>
                  <span>•</span>
                  <span>방식: {course.deliveryMethod === 'face-to-face' ? '대면' : course.deliveryMethod === 'online' ? '비대면' : '혼합'}</span>
                </div>
              </div>

              {/* Learning Objectives in Preview */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                  <span>이번 주차 학습목표</span>
                </h4>
                {currentWeek.learningObjectives && currentWeek.learningObjectives.length > 0 ? (
                  <ul className="text-xs text-slate-700 space-y-1 pl-4 list-decimal leading-relaxed">
                    {currentWeek.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">학습목표가 등록되지 않았습니다.</p>
                )}
              </div>

              {/* Sections Rendered in Template Order */}
              {(!currentWeek.generatedSections || currentWeek.generatedSections.length === 0) ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">아직 생성된 교안 본문이 없습니다</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      왼쪽 입력 항목(주제, 학습목표, 핵심 개념 등)을 작성한 후 상단의 [AI 초안 생성] 버튼을 누르면
                      교수설계 원칙이 적용된 정교한 교안이 이곳에 채워집니다.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>지금 AI 초안 생성하기</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentWeek.generatedSections.map((sec, secIdx) => (
                    <div key={secIdx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      {/* Section Badge & Title Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            [{sec.sectionName}] {sec.allocatedTime}분 배분
                          </span>
                          <span className="text-[10px] text-slate-400">제목/항목 직접 수정 가능</span>
                        </div>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateSectionField(secIdx, 'title', e.target.value)}
                          placeholder="서술형 핵심 메시지 제목"
                          className="w-full text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 focus:outline-none py-1 transition-colors"
                        />
                      </div>

                      {/* Items (Bullet points) with add/remove */}
                      <div className="space-y-1.5">
                        {sec.items?.map((item, itemIdx) => {
                          const isImagePlaceholder = item.includes('[이미지:');
                          return (
                            <div key={itemIdx} className="flex items-start gap-2 group">
                              <span className="text-slate-400 text-xs mt-1">•</span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleUpdateSectionItem(secIdx, itemIdx, e.target.value)}
                                className={`flex-1 text-xs py-1 px-2 rounded hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-red-400 focus:outline-none transition-all ${
                                  isImagePlaceholder ? 'font-semibold text-purple-700 bg-purple-50/50' : 'text-slate-700'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSectionItem(secIdx, itemIdx)}
                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 p-1 cursor-pointer transition-opacity"
                                title="항목 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => handleAddSectionItem(secIdx)}
                          className="text-[11px] text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1 pl-4 pt-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>본문 항목 추가</span>
                        </button>
                      </div>

                      {/* Summary Box (원칙 8: 핵심 요약 박스) */}
                      {sec.summaryBox !== undefined && (
                        <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
                            <span>💡 핵심 요약 박스 (1~2문장)</span>
                          </div>
                          <textarea
                            rows={2}
                            value={sec.summaryBox}
                            onChange={(e) => handleUpdateSectionField(secIdx, 'summaryBox', e.target.value)}
                            className="w-full text-xs text-red-950 bg-white/70 p-2 rounded-lg border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed resize-none"
                            placeholder="해당 파트의 핵심 요약을 기술하세요."
                          />
                        </div>
                      )}

                      {/* Activity / Interactive Prompt (원칙 9: 10~15분 간격 활동) */}
                      {sec.activity && (
                        <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                            <span className="flex items-center gap-1.5">
                              🎯 15분 주기 참여 활동: {sec.activity.title || '발문 및 실습'}
                            </span>
                            <span className="text-[11px] font-normal text-purple-700">
                              {sec.activity.duration}분 소요
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            value={sec.activity.prompt}
                            onChange={(e) =>
                              handleUpdateSectionField(secIdx, 'activity', {
                                ...sec.activity,
                                prompt: e.target.value,
                              })
                            }
                            className="w-full text-xs text-purple-950 bg-white/70 p-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed resize-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Render Visual Image Previews if uploaded or planned */}
                  {currentWeek.imagePlans && currentWeek.imagePlans.length > 0 && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">
                        🖼️ 첨부 시각 자료 및 캡션/출처
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentWeek.imagePlans.map((img, i) => (
                          <div key={img.id || i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            {img.imageUrl ? (
                              <img
                                src={img.imageUrl}
                                alt={img.altText || img.conceptName}
                                className="w-full h-32 object-cover rounded-lg border border-slate-200"
                              />
                            ) : (
                              <div className="w-full h-24 bg-purple-50/80 rounded-lg border border-dashed border-purple-200 flex flex-col items-center justify-center text-center p-2">
                                <span className="text-xs font-bold text-purple-700">{img.conceptName || '시각 자료'}</span>
                                <span className="text-[10px] text-purple-500 mt-0.5">[{img.imageType}] 자리표시자</span>
                              </div>
                            )}
                            <div className="text-[11px] text-slate-600">
                              <p className="font-bold text-slate-800">캡션: {img.caption || '(미작성)'}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">출처: {img.sourceAndLicense || '자체 제작'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overall Summary & Next Week Preview */}
                  {(currentWeek.overallSummary || currentWeek.nextWeekPreview) && (
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        주차 총괄 요약 및 차시 예고
                      </h4>
                      {currentWeek.overallSummary && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-white">종합 요약:</span> {currentWeek.overallSummary}
                        </p>
                      )}
                      {currentWeek.nextWeekPreview && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-200">다음 주차 예고:</span> {currentWeek.nextWeekPreview}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Checklist at the Bottom */}
      <QualityChecklistBar
        week={currentWeek}
        onUpdateManualOverride={handleChecklistOverride}
      />
    </div>
  );
};
