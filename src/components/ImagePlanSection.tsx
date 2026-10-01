import React, { useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Info,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ImagePlan, ImageType, IMAGE_TYPE_GUIDES } from '../types';

interface ImagePlanSectionProps {
  imagePlans: ImagePlan[];
  onChange: (plans: ImagePlan[]) => void;
}

export const ImagePlanSection: React.FC<ImagePlanSectionProps> = ({ imagePlans, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadIndexRef = useRef<number | null>(null);

  const handleAddPlan = () => {
    const newPlan: ImagePlan = {
      id: `img-${Date.now()}`,
      conceptName: '',
      imageType: 'concept',
      caption: '',
      altText: '',
      sourceAndLicense: '자체 제작 (CC-BY 4.0)',
      imageUrl: '',
    };
    onChange([...imagePlans, newPlan]);
  };

  const handleRemovePlan = (index: number) => {
    const updated = imagePlans.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleUpdatePlan = (index: number, field: keyof ImagePlan, value: any) => {
    const updated = [...imagePlans];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleTriggerUpload = (index: number) => {
    activeUploadIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = activeUploadIndexRef.current;
    if (file && index !== null && index >= 0 && index < imagePlans.length) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleUpdatePlan(index, 'imageUrl', base64);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>이미지 및 시각 자료 계획 ({imagePlans.length}개)</span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            AI 초안 생성 시 이미지 위치와 자리표시자가 본문에 자동 반영됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddPlan}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>이미지 계획 추가</span>
        </button>
      </div>

      {imagePlans.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-xs text-slate-500">등록된 시각 자료 계획이 없습니다.</p>
          <button
            type="button"
            onClick={handleAddPlan}
            className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-800 underline cursor-pointer"
          >
            + 첫 번째 시각 자료 계획 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {imagePlans.map((plan, index) => {
            const guide = IMAGE_TYPE_GUIDES[plan.imageType] || IMAGE_TYPE_GUIDES.concept;
            return (
              <div
                key={plan.id || index}
                className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 space-y-3 relative transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-700 bg-white px-2.5 py-0.5 rounded-md border border-purple-200">
                    이미지 #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlan(index)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    title="이미지 계획 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      설명할 개념/내용 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={plan.conceptName}
                      onChange={(e) => handleUpdatePlan(index, 'conceptName', e.target.value)}
                      placeholder="예: ADDIE 모형 5단계 순환 흐름도"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      이미지 유형 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={plan.imageType}
                      onChange={(e) => handleUpdatePlan(index, 'imageType', e.target.value as ImageType)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer font-medium"
                    >
                      <option value="concept">개념도 (Concept Map)</option>
                      <option value="flowchart">순서도 (Flowchart)</option>
                      <option value="graph">그래프 (Data Chart)</option>
                      <option value="screenshot">화면 캡처 (Screenshot)</option>
                      <option value="metaphor">비유 이미지 (Visual Metaphor)</option>
                      <option value="photo">현장 사진 (Field Photo)</option>
                    </select>
                  </div>
                </div>

                {/* Selected Type Guidance Callout */}
                <div className="bg-white p-2.5 rounded-lg border border-purple-100 flex items-start gap-2 text-xs">
                  <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-900 mr-1.5">{guide.label} 작성 요령:</span>
                    <span className="text-slate-600">{guide.tip}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      캡션 (한 줄 해석 포함) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={plan.caption}
                      onChange={(e) => handleUpdatePlan(index, 'caption', e.target.value)}
                      placeholder="예: ADDIE 모형의 순환 루프와 각 단계 산출물 연계도"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      대체 텍스트 (Alt Text)
                    </label>
                    <input
                      type="text"
                      value={plan.altText}
                      onChange={(e) => handleUpdatePlan(index, 'altText', e.target.value)}
                      placeholder="시각장애인 스크린리더를 위한 간결한 설명"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      출처 및 이용 조건
                    </label>
                    <input
                      type="text"
                      value={plan.sourceAndLicense}
                      onChange={(e) => handleUpdatePlan(index, 'sourceAndLicense', e.target.value)}
                      placeholder="예: 자체 제작 (CC-BY 4.0) 또는 게티이미지뱅크 번호"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      이미지 파일 첨부 (선택)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>{plan.imageUrl ? '이미지 변경' : '파일 업로드'}</span>
                      </button>
                      {plan.imageUrl && (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={plan.imageUrl}
                            alt={plan.altText || '미리보기'}
                            className="w-7 h-7 object-cover rounded border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdatePlan(index, 'imageUrl', '')}
                            className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
