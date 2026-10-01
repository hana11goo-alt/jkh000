import React, { useState, useEffect } from 'react';
import { Course, WeekPlan } from './types';
import {
  initStorage,
  saveCourse,
  duplicateCourse,
  resetToSampleCourse,
  getSavedCoursesList,
  loadCourseById,
} from './utils/storage';
import { getFullWeeksForCourse } from './constants/sampleData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseSettingsView } from './components/CourseSettingsView';
import { WeeklyListView } from './components/WeeklyListView';
import { WeekEditorView } from './components/WeekEditorView';
import { ExportView } from './components/ExportView';
import { Copy, X, Check, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [course, setCourse] = useState<Course>(() => initStorage());
  const [currentTab, setCurrentTab] = useState<'settings' | 'weekly' | 'editor' | 'export'>('weekly');
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(1);
  const [lastSavedText, setLastSavedText] = useState<string>('자동 저장됨');

  // Duplicate Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [duplicateNameInput, setDuplicateNameInput] = useState<string>('');
  const [savedCourses, setSavedCourses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    setSavedCourses(getSavedCoursesList());
  }, [course.id]);

  const updateCourseAndPersist = (updatedCourse: Course) => {
    // If totalWeeks changed, ensure weeks array length matches
    let adjustedWeeks = updatedCourse.weeks;
    if (updatedCourse.totalWeeks !== updatedCourse.weeks.length) {
      adjustedWeeks = getFullWeeksForCourse(updatedCourse.totalWeeks, updatedCourse.weeks);
    }

    const finalCourse: Course = {
      ...updatedCourse,
      weeks: adjustedWeeks,
      updatedAt: new Date().toISOString(),
    };

    setCourse(finalCourse);
    saveCourse(finalCourse);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLastSavedText(`${timeStr} 저장됨`);
  };

  const handleUpdateWeek = (updatedWeek: WeekPlan) => {
    const updatedWeeks = course.weeks.map((w) =>
      w.weekNumber === updatedWeek.weekNumber ? updatedWeek : w
    );
    updateCourseAndPersist({
      ...course,
      weeks: updatedWeeks,
    });
  };

  const handleSelectWeekFromList = (weekNum: number) => {
    setActiveWeekNumber(weekNum);
    setCurrentTab('editor');
  };

  const handleOpenDuplicateModal = () => {
    setDuplicateNameInput(`[복사본] ${course.name} (차기 학기)`);
    setShowDuplicateModal(true);
  };

  const handleConfirmDuplicate = () => {
    if (!duplicateNameInput.trim()) return;
    const duplicated = duplicateCourse(course, duplicateNameInput.trim());
    setCourse(duplicated);
    setShowDuplicateModal(false);
    setSavedCourses(getSavedCoursesList());
    setCurrentTab('weekly');
    alert(`과목이 복제되었습니다: "${duplicated.name}"`);
  };

  const handleSwitchCourse = (courseId: string) => {
    const loaded = loadCourseById(courseId);
    if (loaded) {
      setCourse(loaded);
      setCurrentTab('weekly');
    }
  };

  const handleResetSample = () => {
    if (window.confirm('샘플 과목 데이터(5주차 분량 예시)로 초기화하시겠습니까? 현재 과목 내용은 대체됩니다.')) {
      const reset = resetToSampleCourse();
      setCourse(reset);
      setActiveWeekNumber(1);
      setCurrentTab('weekly');
      setSavedCourses(getSavedCoursesList());
    }
  };

  const handleAddNewWeek = () => {
    const nextNum = course.weeks.length + 1;
    const newWeek: WeekPlan = {
      id: `week-${Date.now()}-${nextNum}`,
      weekNumber: nextNum,
      topic: `제${nextNum}주차 강의 주제를 입력하세요`,
      status: 'not_started',
      learningObjectives: [],
      keywords: [],
      keyConcepts: [],
      references: '',
      evaluationInfo: '',
      imagePlans: [],
      generatedSections: [],
      updatedAt: new Date().toISOString(),
    };

    const updated = {
      ...course,
      totalWeeks: nextNum,
      weeks: [...course.weeks, newWeek],
    };
    updateCourseAndPersist(updated);
    setActiveWeekNumber(nextNum);
    setCurrentTab('editor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        course={course}
        activeWeekNumber={activeWeekNumber}
        onDuplicateCourse={handleOpenDuplicateModal}
        onResetSample={handleResetSample}
        lastSavedText={lastSavedText}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'settings' && (
          <CourseSettingsView
            course={course}
            onUpdateCourse={updateCourseAndPersist}
            onNavigateToWeekly={() => setCurrentTab('weekly')}
          />
        )}

        {currentTab === 'weekly' && (
          <>
            <HeroSection
              course={course}
              onStartEditing={handleSelectWeekFromList}
              onGoToSettings={() => setCurrentTab('settings')}
              onGoToExport={() => setCurrentTab('export')}
            />
            <WeeklyListView
              course={course}
              onSelectWeek={handleSelectWeekFromList}
              onDuplicateCourse={handleOpenDuplicateModal}
              onAddNewWeek={handleAddNewWeek}
            />
          </>
        )}

        {currentTab === 'editor' && (
          <WeekEditorView
            course={course}
            weekNumber={activeWeekNumber}
            onUpdateWeek={handleUpdateWeek}
            onNavigateWeek={(num) => setActiveWeekNumber(num)}
          />
        )}

        {currentTab === 'export' && <ExportView course={course} />}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">강의교안 작성 도우미</span>
            <span>•</span>
            <span>교수설계 12대 원칙 준수 & Bloom's Taxonomy 분류학 연계</span>
          </div>
          <div>
            모든 교안 데이터는 브라우저 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">localStorage</code>에 자동 보존됩니다.
          </div>
        </div>
      </footer>

      {/* Duplicate Course Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">지난 학기 과목 복사 (복제)</h3>
              </div>
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              현재 과목(<span className="font-bold text-slate-800">{course.name}</span>)의 모든 설정, 양식, 주차별
              내용을 그대로 복제하여 새 학기용 독립 과목으로 생성합니다.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                새로 생성할 과목명
              </label>
              <input
                type="text"
                value={duplicateNameInput}
                onChange={(e) => setDuplicateNameInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium"
              />
            </div>

            {/* Saved courses list switcher */}
            {savedCourses.length > 1 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">
                  기존 저장된 과목으로 전환:
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {savedCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        handleSwitchCourse(c.id);
                        setShowDuplicateModal(false);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg truncate transition-colors cursor-pointer ${
                        c.id === course.id
                          ? 'bg-red-50 text-red-800 font-bold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.name} {c.id === course.id ? '(현재)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDuplicate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>과목 복제하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
