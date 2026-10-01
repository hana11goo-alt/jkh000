import React, { useState } from 'react';
import {
  Save,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Course, SectionTemplate, DeliveryMethod } from '../types';

interface CourseSettingsViewProps {
  course: Course;
  onUpdateCourse: (updated: Course) => void;
  onNavigateToWeekly: () => void;
}

export const CourseSettingsView: React.FC<CourseSettingsViewProps> = ({
  course,
  onUpdateCourse,
  onNavigateToWeekly,
}) => {
  const [formData, setFormData] = useState<Course>({ ...course });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleInputChange = (field: keyof Course, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionToggle = (id: string) => {
    setFormData((prev) => {
      const updatedSections = prev.templateSections.map((sec) =>
        sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
      );
      return { ...prev, templateSections: updatedSections };
    });
  };

  const handleSectionDurationChange = (id: string, duration: number) => {
    setFormData((prev) => {
      const updatedSections = prev.templateSections.map((sec) =>
        sec.id === id ? { ...sec, durationMinutes: Math.max(0, duration) } : sec
      );
      return { ...prev, templateSections: updatedSections };
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.templateSections.length) return;

    const list = [...formData.templateSections];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // update orders
    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setFormData((prev) => ({ ...prev, templateSections: updated }));
  };

  const totalAllocatedMinutes = formData.templateSections
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);

  const durationDifference = formData.classDurationMinutes - totalAllocatedMinutes;

  const handleSave = () => {
    onUpdateCourse(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onNavigateToWeekly();
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              Screen 1 • 과목 기본 정보 & 교안 템플릿
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">과목 및 표준 교안 양식 설정</h2>
            <p className="text-sm text-slate-600 mt-1">
              과목 기본 정보와 수업 표준 섹션 양식을 구성하세요. 저장 시 지정한 주차 수만큼 주차별 계획이 자동 정렬됩니다.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>설정 저장 및 주차 목록 생성</span>
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-medium">
            과목 설정과 {formData.totalWeeks}주차 목록이 성공적으로 저장되었습니다. 주차 목록으로 이동합니다...
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Course Basics */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-slate-900">과목 기본 정보</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  과목명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 디지털 교수설계와 에듀테크 실무"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    학점 (Credits)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.credits}
                    onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    총 주차 수 (기본 15) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.totalWeeks}
                    onChange={(e) => handleInputChange('totalWeeks', parseInt(e.target.value) || 15)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-semibold text-red-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    수업 시간 (분/회차)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={30}
                      max={480}
                      step={10}
                      value={formData.classDurationMinutes}
                      onChange={(e) => handleInputChange('classDurationMinutes', parseInt(e.target.value) || 90)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">분</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">수업 방식</label>
                  <select
                    value={formData.deliveryMethod}
                    onChange={(e) => handleInputChange('deliveryMethod', e.target.value as DeliveryMethod)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-medium cursor-pointer"
                  >
                    <option value="face-to-face">대면 수업</option>
                    <option value="online">비대면 (온라인)</option>
                    <option value="hybrid">혼합형 (블렌디드)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  대상 학습자 (Target Audience)
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="예: 성인 직무 교육생, 신임 사내 강사, 대학 3~4학년"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  과목 개요 및 교육 목표
                </label>
                <textarea
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  placeholder="과목의 핵심 취지와 학습자가 과정 수료 후 달성하게 될 성과를 간략히 서술하세요."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Instructional Design Tip Box */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold tracking-wide uppercase text-amber-400">
                교수설계 실무 팁 (Gagne 9 Events)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              성인 학습자는 강의 시작 후 10분이 지나면 몰입도가 급격히 하락합니다. 표준 수업 시간({formData.classDurationMinutes}분)에 맞춰
              도입(15분 내외)에서 주의를 환기하고, 전개 중간에 질문이나 실습 활동(10~15분)을 반드시 배치하는 구조를 권장합니다.
            </p>
          </div>
        </div>

        {/* Right Column: Lesson Plan Section Template Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">교안 표준 양식 및 시간 배분</h3>
              </div>
              <span className="text-xs text-slate-500">순서 변경 및 On/Off</span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              각 주차별 교안에 공통 적용될 섹션을 켜고 끄고, 순서를 정렬하며 기준 배분 시간(분)을 설정하세요.
            </p>

            {/* Time Allocation Balance Gauge */}
            <div className={`p-4 rounded-xl border mb-5 transition-colors ${
              durationDifference === 0
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : durationDifference > 0
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  섹션 배분 시간 합계: <span className="font-bold text-sm">{totalAllocatedMinutes}분</span>
                </span>
                <span>수업 시간: {formData.classDurationMinutes}분</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    durationDifference === 0 ? 'bg-emerald-500' : durationDifference > 0 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalAllocatedMinutes / formData.classDurationMinutes) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] mt-1.5 flex items-center gap-1">
                {durationDifference === 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    수업 시간({formData.classDurationMinutes}분)과 정확히 일치하여 최적의 시간 구조입니다.
                  </>
                ) : durationDifference > 0 ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    {durationDifference}분이 미배분되어 있습니다. 전개나 활동 섹션에 추가해보세요.
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    {Math.abs(durationDifference)}분 초과되었습니다. 섹션별 시간을 조정하세요.
                  </>
                )}
              </p>
            </div>

            {/* Section List */}
            <div className="space-y-3">
              {formData.templateSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    sec.enabled
                      ? 'bg-slate-50 border-slate-200 hover:border-red-300'
                      : 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Checkbox Toggle */}
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={() => handleSectionToggle(sec.id)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                        id={`sec-toggle-${sec.id}`}
                      />
                      <div>
                        <label
                          htmlFor={`sec-toggle-${sec.id}`}
                          className="text-sm font-bold text-slate-800 cursor-pointer flex items-center gap-2"
                        >
                          <span>{sec.name}</span>
                          <span className="text-[11px] font-normal text-slate-400">#{idx + 1}</span>
                        </label>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{sec.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Duration Input */}
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <input
                          type="number"
                          disabled={!sec.enabled}
                          min={0}
                          max={240}
                          step={5}
                          value={sec.durationMinutes}
                          onChange={(e) => handleSectionDurationChange(sec.id, parseInt(e.target.value) || 0)}
                          className="w-12 text-center text-xs font-bold text-slate-800 focus:outline-none disabled:bg-transparent"
                        />
                        <span className="text-[11px] text-slate-400">분</span>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.templateSections.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                설정된 양식은 [주차 편집] 시 미리보기에 실시간 반영됩니다.
              </span>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장 후 주차 목록으로</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
