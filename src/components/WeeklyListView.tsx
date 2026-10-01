import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Course, WeekPlan, WeekStatus } from '../types';

interface WeeklyListViewProps {
  course: Course;
  onSelectWeek: (weekNumber: number) => void;
  onDuplicateCourse: () => void;
  onAddNewWeek: () => void;
}

export const WeeklyListView: React.FC<WeeklyListViewProps> = ({
  course,
  onSelectWeek,
  onDuplicateCourse,
  onAddNewWeek,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const totalCount = course.weeks.length;
  const completedCount = course.weeks.filter((w) => w.status === 'completed').length;
  const draftCount = course.weeks.filter((w) => w.status === 'draft').length;
  const notStartedCount = course.weeks.filter((w) => w.status === 'not_started').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredWeeks = course.weeks.filter((w) => {
    if (filterStatus === 'all') return true;
    return w.status === filterStatus;
  });

  const getStatusBadge = (status: WeekStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            완료
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <Clock className="w-3 h-3 text-red-600" />
            초안 작성
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            미작성
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner & Overview */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                Screen 2 • 1~{course.totalWeeks}주차 로드맵
              </span>
              <span className="text-xs text-slate-500 font-medium">{course.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">주차별 강의교안 목록</h2>
            <p className="text-sm text-slate-600 mt-1">
              주차 카드를 클릭하면 해당 주차의 입력 및 AI 초안 생성, 실시간 미리보기 화면으로 이동합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDuplicateCourse}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="현재 과목 전체를 복제하여 다음 학기용 과목으로 새로 시작"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              <span>지난 학기 과목 복사</span>
            </button>

            <button
              onClick={onAddNewWeek}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>주차 추가 (제{totalCount + 1}주)</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="mt-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">전체 교안 완성도</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-red-600">{completionRate}%</span>
                <span className="text-xs text-slate-500">
                  (총 {totalCount}개 주차 중 {completedCount}개 완료)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                완료: {completedCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                초안: {draftCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                미작성: {notStartedCount}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
            <div className="bg-red-400 transition-all duration-500" style={{ width: `${(draftCount / totalCount) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            완료 ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'draft' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            초안 ({draftCount})
          </button>
          <button
            onClick={() => setFilterStatus('not_started')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'not_started' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            미작성 ({notStartedCount})
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="카드 뷰"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="표 뷰"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWeeks.map((week) => {
            const hasDraftSections = week.generatedSections && week.generatedSections.length > 0;
            const objCount = week.learningObjectives?.length || 0;
            const conceptCount = week.keyConcepts?.length || 0;
            const imgCount = week.imagePlans?.length || 0;

            return (
              <div
                key={week.id}
                onClick={() => onSelectWeek(week.weekNumber)}
                className="group relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-red-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                      제{week.weekNumber}주차
                    </span>
                    {getStatusBadge(week.status)}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {week.topic || `제${week.weekNumber}주차 주제를 입력하세요`}
                  </h3>

                  {/* Summary of Objectives */}
                  {objCount > 0 ? (
                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <p className="text-[11px] font-semibold text-slate-400">학습목표 ({objCount}개)</p>
                      <p className="line-clamp-2 text-slate-600 italic">
                        "{week.learningObjectives[0]}"
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-slate-400 italic">학습목표 미등록</div>
                  )}

                  {/* Keywords */}
                  {week.keywords && week.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {week.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          #{kw}
                        </span>
                      ))}
                      {week.keywords.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">+{week.keywords.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span title="핵심 개념 수" className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-[11px]">
                      개념 {conceptCount}
                    </span>
                    {imgCount > 0 && (
                      <span title="이미지 계획 수" className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 text-[11px]">
                        시각 {imgCount}
                      </span>
                    )}
                    {hasDraftSections && (
                      <span title="교안 본문 작성됨" className="text-red-600 font-semibold text-[11px]">
                        본문 완비
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-0.5 font-semibold text-red-600 group-hover:translate-x-1 transition-transform">
                    편집
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4 w-16">주차</th>
                <th className="py-3 px-4">주차 주제</th>
                <th className="py-3 px-4 w-28">작성 상태</th>
                <th className="py-3 px-4 w-32">학습목표</th>
                <th className="py-3 px-4 w-24">핵심 개념</th>
                <th className="py-3 px-4 w-24 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredWeeks.map((week) => (
                <tr
                  key={week.id}
                  onClick={() => onSelectWeek(week.weekNumber)}
                  className="hover:bg-red-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-extrabold text-red-700">
                    제{week.weekNumber}주
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{week.topic}</span>
                    {week.keywords && week.keywords.length > 0 && (
                      <span className="ml-2 text-slate-400">({week.keywords.join(', ')})</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(week.status)}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {week.learningObjectives?.length ? `${week.learningObjectives.length}개 등록` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {week.keyConcepts?.length ? `${week.keyConcepts.length}개` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-800">
                      편집하기 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
