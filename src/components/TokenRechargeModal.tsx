import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, Coins, Key, CheckCircle2, AlertCircle, Crown, Calendar, ArrowRight } from 'lucide-react';
import type { LicenseStatus } from '../types';
import { formatLicenseExpiry, formatLicenseKey, LICENSE_KEY_LENGTH, normalizeLicenseInput } from '../constants/license';

interface TokenRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: LicenseStatus | null;
  isAdmin?: boolean;
  /** 키를 바꿔 로그인했을 때 */
  onActivated: (status: LicenseStatus) => void;
}

/**
 * 라이선스 정보 / 충전 안내.
 * 토큰 충전·기간 연장은 판매자가 서버에서 처리하므로 앱에서는 현재 상태를 보여주고 안내만 한다.
 * (새 키를 받았다면 아래에서 바꿔 로그인할 수 있다.)
 */
export const TokenRechargeModal: React.FC<TokenRechargeModalProps> = ({ isOpen, onClose, status, isAdmin, onActivated }) => {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEscapeKey(isOpen, () => {
    if (busy) return;
    setInput('');
    setError('');
    setDone(false);
    onClose();
  });
  if (!isOpen) return null;

  const complete = normalizeLicenseInput(input).length === LICENSE_KEY_LENGTH;

  const handleSwitch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!complete) {
      setError(`키 ${LICENSE_KEY_LENGTH}자리를 모두 입력해 주세요.`);
      return;
    }
    setBusy(true);
    try {
      const res = await window.electronAPI.activateLicense(input);
      if (res.success && res.status) {
        setDone(true);
        setInput('');
        onActivated(res.status);
      } else {
        setError(res.error || '라이선스 인증에 실패했습니다. 키를 다시 확인해 주세요.');
      }
    } catch (err: any) {
      setError(err?.message || '라이선스 확인 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    setInput('');
    setError('');
    setDone(false);
    onClose();
  };

  const tokens = status?.tokens ?? 0;
  const cost = status?.costPerShort ?? 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="font-black text-base flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            라이선스 · 토큰 안내
          </h2>
          <button onClick={close} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400" title="닫기">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-center gap-2">
              <Crown className="w-4 h-4" /> 관리자 세션입니다. 토큰이 차감되지 않습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400 mb-1">남은 토큰</div>
                <div className="font-black text-lg text-blue-300">{status?.unlimited ? '무제한' : `${tokens.toLocaleString()} P`}</div>
                <div className="text-[11px] text-slate-500 mt-1">쇼츠 1편 = {cost} P · 약 {Math.floor(tokens / cost)}편 가능</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> 사용 기간
                </div>
                <div className="font-bold text-sm text-slate-100">{status ? formatLicenseExpiry(status.expiresAt) : '-'}</div>
                <div className="text-[11px] text-slate-500 mt-1">키 {status?.keyHint || '-'}</div>
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="text-xs text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
              토큰 충전과 기간 연장은 구매하신 곳(판매자)에 문의해 주세요. 처리되면 이 화면을 닫았다 열거나 프로그램을 다시 켤 때 자동으로 반영됩니다.
              <br />
              한 키는 한 번에 PC 한 대에서만 쓸 수 있고, 다른 PC에서 로그인하면 이 PC는 로그아웃됩니다.
            </div>
          )}

          {!isAdmin && (
            <form onSubmit={handleSwitch} autoComplete="off" className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" /> 다른 키로 바꿔 로그인
              </label>
              <div className="flex gap-2">
                <input
                  value={formatLicenseKey(input)}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError('');
                    setDone(false);
                  }}
                  maxLength={32}
                  placeholder="XXXX XXXX XXXX XXXX"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-slate-800/90 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !complete}
                  className="px-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-40 flex items-center gap-1"
                >
                  {busy ? '확인 중…' : '로그인'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-red-400 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </div>
              )}
              {done && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 새 키로 로그인되었습니다.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
