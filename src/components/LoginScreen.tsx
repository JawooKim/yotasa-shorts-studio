import React, { useState } from 'react';
import { LICENSE_KEY_LENGTH, normalizeLicenseInput } from '../constants/license';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Key,
  Lock,
  Crown,
  CheckCircle2,
  AlertCircle,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginSuccessData {
  userName: string;
  licenseKey: string;
  isAdmin: boolean;
  tokens: number;
}

interface LoginScreenProps {
  onLogin: (data: LoginSuccessData) => void;
}

// 관리자 키 검증값은 소스에 두지 않는다. 빌드할 때 저장소 밖 파일(admin.local.json) 또는
// 환경 변수 KSHORTS_ADMIN_FNV에서 읽어 넣으며, 값이 없거나 구매자 빌드면 0이 되어 관리자 로그인이 꺼진다.
function verifyAdminKey(input: string): boolean {
  if (!__ADMIN_KEY_FNV__) return false;
  const trimmed = input.trim();
  if (trimmed.length !== 10) return false;
  let h = 0x811c9dc5;
  for (let i = 0; i < trimmed.length; i++) {
    h ^= trimmed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) === __ADMIN_KEY_FNV__;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [authKeyInput, setAuthKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const cleanRawKey = authKeyInput.trim();
  // 구매자 빌드에서는 관리자 로그인 코드가 번들에서 통째로 제거된다.
  const isAdminAuthorized = !__BUYER_BUILD__ && verifyAdminKey(cleanRawKey);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!cleanRawKey) {
      setErrorMessage('인증 키를 입력해주세요.');
      return;
    }

    // STRICT ACCESS CONTROL:
    // Only the authorized master admin code is permitted.
    // Any other input is unconditionally rejected.
    if (isAdminAuthorized) {
      setIsSuccess(true);
      // Immediately clear raw input from component state to eliminate memory traces
      setAuthKeyInput('');
      setTimeout(() => {
        onLogin({
          userName: creatorName.trim() || '마스터 관리자',
          licenseKey: 'KSH-MASTER-ADMIN-SESSION',
          isAdmin: true,
          tokens: 999999999, // Infinite tokens for Admin
        });
      }, 400);
      return;
    }

    // 정품 키: 판매자가 발급한 16자리 키. 확인은 메인 프로세스가 라이선스 서버와 직접 한다.
    const normalized = normalizeLicenseInput(cleanRawKey);
    if (normalized.length !== LICENSE_KEY_LENGTH) {
      setErrorMessage(`키 ${LICENSE_KEY_LENGTH}자리를 모두 입력해 주세요. (현재 ${normalized.length}자)`);
      return;
    }

    if (window.electronAPI?.activateLicense) {
      setIsChecking(true);
      window.electronAPI
        .activateLicense(normalized)
        .then((res) => {
          if (res.success && res.status) {
            setIsSuccess(true);
            setAuthKeyInput('');
            setTimeout(() => {
              onLogin({
                userName: creatorName.trim() || '정품 크리에이터',
                licenseKey: res.status!.keyHint,
                isAdmin: false,
                tokens: res.status!.tokens,
              });
            }, 400);
          } else {
            setErrorMessage(res.error || '유효하지 않은 인증 키입니다. 확인 후 다시 입력해주세요.');
          }
        })
        .catch(() => {
          setErrorMessage('라이선스 확인 중 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
        })
        .finally(() => setIsChecking(false));
      return;
    }

    // Rejection for any unauthorized input
    setErrorMessage('유효하지 않은 인증 키입니다. 확인 후 다시 입력해주세요.');
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 select-none overflow-hidden relative">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="m-auto w-full max-w-md p-6 relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl shadow-black/60 space-y-6">
          {/* Logo & App Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 shadow-lg shadow-purple-600/30 mb-1 text-white">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              K-Shorts Studio
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              한국어 AI 쇼츠 자동화 제작 & 관리 솔루션
            </p>
          </div>

          {/* Security Status Badge Box */}
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-slate-300">정품 라이센스 인증</span>
            </div>
            {isAdminAuthorized ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                인증 확인됨
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/80 text-slate-400 border border-slate-600">
                인증 대기
              </span>
            )}
          </div>

          {/* Strict Form with Autocomplete and Autofill Prevention */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            noValidate
            className="space-y-4"
          >
            {/* Master Key Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>인증 키</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {`${normalizeLicenseInput(cleanRawKey).length} / ${LICENSE_KEY_LENGTH}자`}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  name="kshorts_secure_auth_token"
                  id="kshorts_secure_auth_token"
                  maxLength={40}
                  value={authKeyInput}
                  onChange={(e) => {
                    const sliced = e.target.value.slice(0, 40);
                    setAuthKeyInput(sliced);
                    setErrorMessage('');
                  }}
                  placeholder="구매하신 정품 키 16자리 (XXXX XXXX XXXX XXXX)"
                  autoFocus
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  aria-autocomplete="none"
                  className={`w-full bg-slate-800/90 border rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono tracking-wider ${
                    isAdminAuthorized
                      ? 'border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-amber-300 font-bold'
                      : errorMessage
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                      : 'border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                  }`}
                />
                
                {/* Visibility Toggle Button */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded"
                    title={showKey ? '입력값 숨기기' : '입력값 보기'}
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-medium pt-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Creator Nickname (Optional) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>크리에이터 명칭 (선택)</span>
              </label>
              <input
                type="text"
                name="creator_display_name"
                autoComplete="off"
                spellCheck={false}
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="마스터 관리자"
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSuccess || isChecking}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-sm shadow-lg transition-all active:scale-[0.98] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-purple-600/30"
              >
                {isChecking ? (
                  <span className="flex items-center gap-2">
                    <span>라이선스 서버 확인 중…</span>
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 animate-bounce text-emerald-300" />
                    <span>인증 성공! 대시보드 입장 중...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>라이센스 인증 & 대시보드 시작</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>상업적 이용 가능 • 4대 SNS 원클릭 퍼블리시 지원</span>
          </div>
        </div>
      </div>
    </div>
  );
};
