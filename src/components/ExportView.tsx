import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  CheckSquare,
  Square,
  FileText,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Course, WeekPlan } from '../types';
import { generateDocxBlob } from '../utils/docxExport';

interface ExportViewProps {
  course: Course;
}

export const ExportView: React.FC<ExportViewProps> = ({ course }) => {
  const [selectedWeekNumbers, setSelectedWeekNumbers] = useState<number[]>(
    course.weeks.map((w) => w.weekNumber)
  );
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const toggleSelectWeek = (num: number) => {
    setSelectedWeekNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedWeekNumbers(course.weeks.map((w) => w.weekNumber));
  };

  const deselectAll = () => {
    setSelectedWeekNumbers([]);
  };

  const selectCompletedOnly = () => {
    setSelectedWeekNumbers(
      course.weeks.filter((w) => w.status === 'completed' || w.status === 'draft').map((w) => w.weekNumber)
    );
  };

  const selectedWeeks = course.weeks.filter((w) => selectedWeekNumbers.includes(w.weekNumber));

  // Export to Word (.docx)
  const handleExportDocx = async () => {
    if (selectedWeeks.length === 0) return;
    setIsExportingDocx(true);
    try {
      const blob = await generateDocxBlob(course, selectedWeeks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.name.replace(/\s+/g, '_')}_강의교안.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Word 문서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Print to PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    let md = `# ${course.name}\n\n`;
    md += `**대상**: ${course.targetAudience} | **학점**: ${course.credits}학점 | **시간**: ${course.classDurationMinutes}분\n\n`;
    md += `## 과목 개요\n${course.overview}\n\n---\n\n`;

    selectedWeeks.forEach((week) => {
      md += `## 제${week.weekNumber}주차: ${week.topic}\n\n`;
      md += `### 1. 학습목표\n`;
      (week.learningObjectives || []).forEach((obj, i) => {
        md += `${i + 1}. ${obj}\n`;
      });
      md += `\n### 2. 핵심 개념\n`;
      (week.keyConcepts || []).forEach((c) => {
        md += `- **${c.name}**: ${c.description}\n`;
      });
      md += `\n### 3. 교안 본문\n`;
      (week.generatedSections || []).forEach((s) => {
        md += `#### [${s.sectionName}] ${s.title} (${s.allocatedTime}분)\n`;
        (s.items || []).forEach((it) => {
          md += `- ${it}\n`;
        });
        if (s.summaryBox) {
          md += `> **💡 요약**: ${s.summaryBox}\n\n`;
        }
        if (s.activity) {
          md += `> **🎯 활동 (${s.activity.duration}분)**: ${s.activity.prompt}\n\n`;
        }
      });
      if (week.overallSummary) {
        md += `\n**종합 요약**: ${week.overallSummary}\n`;
      }
      if (week.references) {
        md += `\n**출처/참고문헌**: ${week.references}\n`;
      }
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Action Controls (no-print) */}
      <div className="no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              Screen 4 • 문서 내보내기 & 인쇄
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">강의교안 내보내기 (Word / PDF)</h2>
            <p className="text-sm text-slate-600 mt-1">
              원하는 주차를 다중 선택하고, Word(.docx) 다운로드 또는 표준 A4 레이아웃으로 PDF 저장/인쇄할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportDocx}
              disabled={isExportingDocx || selectedWeeks.length === 0}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingDocx ? 'Word 생성 중...' : 'Word (.docx) 다운로드'}</span>
            </button>

            <button
              onClick={handlePrintPdf}
              disabled={selectedWeeks.length === 0}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              title="브라우저 인쇄 창을 열어 PDF로 저장하거나 프린터로 출력"
            >
              <Printer className="w-4 h-4" />
              <span>PDF 저장 / 인쇄</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>마크다운 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Week Multi-Selector Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-800">
                내보낼 주차 선택: <span className="text-red-600">{selectedWeeks.length}개 주차 선택됨</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={selectAll}
                className="text-xs text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                전체 선택
              </button>
              <button
                onClick={selectCompletedOnly}
                className="text-xs text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                작성 완료/초안만 선택
              </button>
              <button
                onClick={deselectAll}
                className="text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                전체 해제
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {course.weeks.map((w) => {
              const isSelected = selectedWeekNumbers.includes(w.weekNumber);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleSelectWeek(w.weekNumber)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-3.5 h-3.5 text-red-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>제{w.weekNumber}주</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      w.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.status === 'draft'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {w.status === 'completed' ? '완료' : w.status === 'draft' ? '초안' : '미작성'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Printable Document Presentation Container */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              교수설계 원칙 기반 주차별 강의교안
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.name}
            </h1>
            <p className="text-xs text-slate-500">
              작성일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Meta Table */}
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 py-2.5 px-4 font-bold text-slate-700 w-28">과목명</th>
                  <td className="py-2.5 px-4 text-slate-900 font-semibold">{course.name}</td>
                  <th className="bg-slate-50 py-2.5 px-4 font-bold text-slate-700 w-28">학점/시간</th>
                  <td className="py-2.5 px-4 text-slate-900">
                    {course.credits}학점 ({course.classDurationMinutes}분,{' '}
                    {course.deliveryMethod === 'face-to-face'
                      ? '대면'
                      : course.deliveryMethod === 'online'
                      ? '비대면'
                      : '혼합형'}
                    )
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 py-2.5 px-4 font-bold text-slate-700">대상 학습자</th>
                  <td colSpan={3} className="py-2.5 px-4 text-slate-800">
                    {course.targetAudience || '미지정'}
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-50 py-2.5 px-4 font-bold text-slate-700">과목 개요</th>
                  <td colSpan={3} className="py-2.5 px-4 text-slate-700 leading-relaxed">
                    {course.overview || '과목 개요가 등록되지 않았습니다.'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Weeks Content */}
        {selectedWeeks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            상단에서 내보낼 주차를 1개 이상 선택해주세요.
          </div>
        ) : (
          <div className="space-y-12">
            {selectedWeeks.map((week, index) => (
              <section
                key={week.id}
                className={`space-y-6 ${index > 0 ? 'print-page-break pt-8 border-t border-slate-200' : ''}`}
              >
                {/* Week Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      제{week.weekNumber}주차
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {week.topic || '주제 미작성'}
                    </h2>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      week.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : week.status === 'draft'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {week.status === 'completed' ? '작성 완료' : week.status === 'draft' ? '초안' : '미작성'}
                  </span>
                </div>

                {/* 1. Learning Objectives */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-4 bg-red-500 rounded-sm" />
                    <span>1. 학습목표 (Learning Objectives)</span>
                  </h3>
                  {week.learningObjectives && week.learningObjectives.length > 0 ? (
                    <ol className="text-xs text-slate-800 space-y-1 pl-5 list-decimal leading-relaxed">
                      {week.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-slate-400 italic">등록된 학습목표가 없습니다.</p>
                  )}
                </div>

                {/* 2. Key Concepts */}
                {week.keyConcepts && week.keyConcepts.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-red-500 rounded-sm" />
                      <span>2. 핵심 개념 (Key Concepts)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {week.keyConcepts.map((c, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-red-900">{c.name}: </span>
                          <span className="text-slate-700">{c.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Lesson Plan Content */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-4 bg-red-500 rounded-sm" />
                    <span>3. 교안 본문 (Lesson Plan Content)</span>
                  </h3>

                  {week.generatedSections && week.generatedSections.length > 0 ? (
                    <div className="space-y-4">
                      {week.generatedSections.map((sec, secIdx) => (
                        <div
                          key={secIdx}
                          className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 print-avoid-break"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-extrabold text-red-700">
                              [{sec.sectionName}] {sec.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              배분 시간: {sec.allocatedTime}분
                            </span>
                          </div>

                          {/* Bullet Items */}
                          {sec.items && sec.items.length > 0 && (
                            <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc leading-relaxed">
                              {sec.items.map((it, itIdx) => (
                                <li key={itIdx}>{it}</li>
                              ))}
                            </ul>
                          )}

                          {/* Summary Box */}
                          {sec.summaryBox && (
                            <div className="p-3 bg-red-50/80 rounded-lg border border-red-200 text-xs text-red-950">
                              <span className="font-bold text-red-800">💡 핵심 요약: </span>
                              <span>{sec.summaryBox}</span>
                            </div>
                          )}

                          {/* Activity */}
                          {sec.activity && (
                            <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200 text-xs text-purple-950">
                              <span className="font-bold text-purple-800">
                                🎯 활동 [{sec.activity.title || '학습자 참여'}] ({sec.activity.duration}분):{' '}
                              </span>
                              <span>{sec.activity.prompt}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">교안 본문이 아직 작성되지 않았습니다.</p>
                  )}
                </div>

                {/* 4. Visual Image Plans */}
                {week.imagePlans && week.imagePlans.length > 0 && (
                  <div className="space-y-2 print-avoid-break">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-indigo-600 rounded-sm" />
                      <span>4. 시각 자료 및 이미지 계획</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {week.imagePlans.map((img, i) => (
                        <div key={img.id || i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          {img.imageUrl && (
                            <img
                              src={img.imageUrl}
                              alt={img.altText || img.conceptName}
                              className="w-full h-28 object-cover rounded-lg border border-slate-200 mb-2"
                            />
                          )}
                          <p className="font-bold text-slate-900">
                            [시각 {i + 1}] {img.conceptName} ({img.imageType})
                          </p>
                          <p className="text-slate-600 mt-0.5">캡션: {img.caption}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">출처: {img.sourceAndLicense}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Overall Summary & Next Week */}
                {(week.overallSummary || week.nextWeekPreview) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs print-avoid-break">
                    <h4 className="font-bold text-slate-800">5. 종합 요약 및 차시 예고</h4>
                    {week.overallSummary && (
                      <p className="text-slate-700">
                        <span className="font-semibold">• 종합 요약:</span> {week.overallSummary}
                      </p>
                    )}
                    {week.nextWeekPreview && (
                      <p className="text-slate-600">
                        <span className="font-semibold">• 다음 주차 예고:</span> {week.nextWeekPreview}
                      </p>
                    )}
                  </div>
                )}

                {/* 6. References */}
                {week.references && (
                  <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
                    <span className="font-bold text-slate-700">참고 문헌 및 출처: </span>
                    <span>{week.references}</span>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
