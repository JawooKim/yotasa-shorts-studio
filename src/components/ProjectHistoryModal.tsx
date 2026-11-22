import React from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, Play, FolderOpen, Trash2, Film, Calendar } from 'lucide-react';
import type { ShortsProject } from '../types';

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ShortsProject[];
  onSelectProject: (p: ShortsProject) => void;
  onDeleteProject: (id: string) => void;
  onShowInFolder: (path: string) => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onDeleteProject,
  onShowInFolder,
}) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-100">제작된 쇼츠 보관함</h3>
              <span className="text-xs text-gray-400">로컬에 저장된 프로젝트 ({projects.length}개)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {projects.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-2">
              <Film className="w-10 h-10 mx-auto stroke-[1.5] text-gray-600" />
              <p className="text-sm font-medium">아직 제작된 쇼츠가 없습니다.</p>
              <p className="text-xs text-gray-600">주제를 입력하고 첫 쇼츠를 만들어보세요!</p>
            </div>
          ) : (
            projects.map((p) => {
              const dateStr = new Date(p.createdAt).toLocaleString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={p.id}
                  className="bg-gray-950/70 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-gray-700 transition-all"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-sm text-gray-200 truncate">{p.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">{p.script || p.prompt}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {dateStr}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-medium">
                        약 {p.durationSeconds || 30}초
                      </span>
                      <span className={'font-semibold ' + (p.status === 'done' ? 'text-emerald-400' : 'text-amber-400')}>
                        {p.status === 'done' ? '완료' : '진행중'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.videoPath && (
                      <>
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
                          title="영상 미리보기"
                        >
                          <Play className="w-4 h-4 fill-rose-300" />
                        </button>
                        <button
                          onClick={() => onShowInFolder(p.videoPath!)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                          title="폴더 열기"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
