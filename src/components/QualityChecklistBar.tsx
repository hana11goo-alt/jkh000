import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { WeekPlan } from '../types';
import { evaluateChecklist, calculateChecklistScore } from '../utils/checklistEvaluator';

interface QualityChecklistBarProps {
  week: WeekPlan;
  onUpdateManualOverride: (key: string, value: boolean) => void;
}

export const QualityChecklistBar: React.FC<QualityChecklistBarProps> = ({
  week,
  onUpdateManualOverride,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const checklistItems = evaluateChecklist(week);
  const score = calculateChecklistScore(checklistItems);
  const passedCount = checklistItems.filter((item) => item.passed).length;

  const getScoreColor = (sc: number) => {
    if (sc >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (sc >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">교안 품질 체크리스트</h3>
              <span className="text-[11px] font-semibold text-slate-500">
                (자동 판정 + 수동 점검)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              교수설계 12대 원칙 준수 여부를 실시간 검사합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">품질 지수:</span>
            <div
              className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1 ${getScoreColor(
                score
              )}`}
            >
              <span>{score}점</span>
              <span className="text-[10px] font-medium">({passedCount}/7 항목 충족)</span>
            </div>
          </div>

          <button className="text-slate-400 hover:text-slate-700 p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Checklist Content */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600">교수설계 완성도 진행률</span>
              <span className="font-bold text-red-700">{score}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.passed
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-amber-50/40 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={item.passed}
                    onChange={(e) => onUpdateManualOverride(item.id, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                    id={`chk-${item.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`chk-${item.id}`}
                        className="text-xs font-bold text-slate-900 cursor-pointer flex items-center gap-1.5"
                      >
                        {item.label}
                      </label>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          item.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.passed ? '충족' : '개선 권장'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {item.message}
                    </p>

                    <div className="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1 bg-white/70 px-2 py-1 rounded border border-slate-200/60">
                      <Sparkles className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="line-clamp-1">{item.tip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
