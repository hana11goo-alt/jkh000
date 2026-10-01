import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  FileDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { Course } from '../types';

interface HeroSectionProps {
  course: Course;
  onStartEditing: (weekNumber: number) => void;
  onGoToSettings: () => void;
  onGoToExport: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  course,
  onStartEditing,
  onGoToSettings,
  onGoToExport,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('hero_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('hero_collapsed', String(next));
  };

  const totalCount = course.weeks.length;
  const completedCount = course.weeks.filter((w) => w.status === 'completed').length;
  const draftCount = course.weeks.filter((w) => w.status === 'draft').length;

  // Find next week to write (first not_started or draft, or week 1)
  const nextWeekToWrite =
    course.weeks.find((w) => w.status === 'draft' || w.status === 'not_started')?.weekNumber || 1;

  if (isCollapsed) {
    return (
      <div className="no-print bg-slate-900 text-slate-100 py-3 px-4 border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-medium">
              <span className="font-bold text-white">강의교안 작성 도우미</span>
              <span className="text-slate-400 mx-2 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden sm:inline">
                교수설계 원칙 기반 주차별 교안 작성 & AI 초안 생성
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartEditing(nextWeekToWrite)}
              className="text-xs font-bold text-rose-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <span>제{nextWeekToWrite}주차 작성하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleCollapse}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              <span>가이드 펼치기</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print relative bg-gradient-to-br from-slate-950 via-red-950/60 to-stone-950 text-white border-b border-slate-800 overflow-hidden shadow-sm">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #f87171 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Mini Bar with collapse toggle */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-300 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/60">
              Instructional Design & AI Assistant
            </span>
            <span className="text-xs text-slate-400">
              블룸 분류학 • ADDIE 모형 • 인지부하 감소 원칙 탑재
            </span>
          </div>

          <button
            onClick={toggleCollapse}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/70 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
            title="히어로 섹션 접기"
          >
            <span>가이드 접기</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Message & CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight sm:leading-snug text-white">
              교수설계 원칙을 담은 강의교안,
              <br />
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                핵심 키워드로 15분 만에 완성하세요
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              매번 반복되는 주차별 교안 작성의 부담을 덜어드립니다. 과목 정보와 핵심 개념만 입력하면,
              <strong className="text-rose-300 font-semibold"> [도입 → 전개 → 활동 → 정리]</strong> 구조의
              서술형 제목, 10~15분 간격 참여 활동, 요약 박스가 갖춰진 전문 교안 초안을 생성하고
              <strong className="text-rose-300 font-semibold"> Word(.docx) / PDF</strong>로 즉시 내보낼 수 있습니다.
            </p>

            {/* Core Instructional Principles Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300 font-medium">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Bloom 측정 가능한 행동 동사
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                주당 3~5개 핵심 개념 제한
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                15분 주기 상호작용 활동
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                7대 교안 품질 자동 진단
              </span>
            </div>

            {/* Hero Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartEditing(nextWeekToWrite)}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-red-950/50 transition-all cursor-pointer group"
              >
                <PlayCircle className="w-4 h-4 text-red-200 group-hover:scale-110 transition-transform" />
                <span>제{nextWeekToWrite}주차 교안 작성하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGoToSettings}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>과목 및 양식 설정</span>
              </button>

              <button
                onClick={onGoToExport}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-slate-400" />
                <span>Word/PDF 내보내기</span>
              </button>
            </div>
          </div>

          {/* Right Hero Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700/90 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    현재 작업 과목 현황
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  {Math.round((completedCount / totalCount) * 100)}% 달성
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white truncate">{course.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {course.targetAudience || '대상 미지정'} • {course.credits}학점 ({course.classDurationMinutes}분,{' '}
                  {course.deliveryMethod === 'face-to-face' ? '대면' : course.deliveryMethod === 'online' ? '비대면' : '혼합'})
                </p>
              </div>

              {/* Progress visual */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>작성 진행률</span>
                  <span className="text-white font-bold">
                    {completedCount}주 완료 / {draftCount}주 초안 / 총 {totalCount}주
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    title={`완료: ${completedCount}주`}
                  />
                  <div
                    className="bg-rose-500 transition-all duration-500"
                    style={{ width: `${(draftCount / totalCount) * 100}%` }}
                    title={`초안: ${draftCount}주`}
                  />
                </div>
              </div>

              {/* Quick shortcut to upcoming week */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    다음 작성할 주차
                  </span>
                  <p className="text-xs font-bold text-white truncate mt-0.5">
                    제{nextWeekToWrite}주차:{' '}
                    {course.weeks.find((w) => w.weekNumber === nextWeekToWrite)?.topic || '주제 미작성'}
                  </p>
                </div>
                <button
                  onClick={() => onStartEditing(nextWeekToWrite)}
                  className="shrink-0 text-xs font-bold text-rose-200 hover:text-white bg-red-950 hover:bg-red-900 px-3 py-1.5 rounded-lg border border-red-800 transition-colors cursor-pointer"
                >
                  작성
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
