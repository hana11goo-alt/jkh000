import React from 'react';
import { BookOpen, Calendar, Edit3, Download, Settings, Copy, CheckCircle2, RotateCcw } from 'lucide-react';
import { Course } from '../types';

interface NavbarProps {
  currentTab: 'settings' | 'weekly' | 'editor' | 'export';
  onSelectTab: (tab: 'settings' | 'weekly' | 'editor' | 'export') => void;
  course: Course;
  activeWeekNumber: number;
  onDuplicateCourse: () => void;
  onResetSample: () => void;
  lastSavedText: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  course,
  activeWeekNumber,
  onDuplicateCourse,
  onResetSample,
  lastSavedText,
}) => {
  const tabs = [
    { id: 'settings' as const, label: '1. 과목 설정', icon: Settings, desc: '과목 정보 및 교안 양식 설정' },
    { id: 'weekly' as const, label: '2. 주차 목록', icon: Calendar, desc: '1~N주차 진도 및 상태 관리' },
    { id: 'editor' as const, label: '3. 주차 편집', icon: Edit3, desc: 'AI 초안 생성 & 실시간 편집' },
    { id: 'export' as const, label: '4. 내보내기', icon: Download, desc: 'Word(.docx) / PDF 출력' },
  ];

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand line */}
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">강의교안 작성 도우미</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">
                  Instructional Design Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                현재 과목: <span className="text-slate-800 font-semibold">{course.name}</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span>{course.credits}학점 ({course.classDurationMinutes}분)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>{lastSavedText || '자동 저장됨'}</span>
            </div>

            <button
              onClick={onDuplicateCourse}
              title="지난 학기 과목 복사 (새 학기용 복제)"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">지난 학기 과목 복사</span>
            </button>

            <button
              onClick={onResetSample}
              title="5주차 시연 샘플 과목으로 초기화"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">샘플 복원</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between pt-1">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`group relative flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-red-600 text-red-700 bg-red-50/60 rounded-t-lg'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.id === 'editor' && (
                    <span className="ml-1 text-[11px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-bold">
                      {activeWeekNumber}주
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            localStorage 브라우저 자동 보관
          </div>
        </div>
      </div>
    </header>
  );
};
