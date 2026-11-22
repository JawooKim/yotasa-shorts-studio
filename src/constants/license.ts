/** 입력값에서 영숫자만 남겨 대문자로 만든다. (붙여 넣을 때 섞여 들어온 공백/줄바꿈/하이픈 제거) */
export function normalizeLicenseInput(raw: string): string {
  return String(raw || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/** 라이선스 키 길이 (16자리 영숫자) */
export const LICENSE_KEY_LENGTH = 16;

/** 화면용 표기: XXXX XXXX XXXX XXXX (입력 중에도 4자마다 띄어쓰기) */
export function formatLicenseKey(raw: string): string {
  const k = normalizeLicenseInput(raw).slice(0, LICENSE_KEY_LENGTH);
  return k.match(/.{1,4}/g)?.join(' ') ?? '';
}

/** 만료 시각(초 epoch)을 '2026-12-06 (D-30)' 형태로 보여준다. 0이면 '무기한'. */
export function formatLicenseExpiry(expiresAt: number, now: number = Date.now()): string {
  if (!expiresAt) return '무기한';
  const d = new Date(expiresAt * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const days = Math.ceil((expiresAt * 1000 - now) / 86400000);
  return days > 0 ? `${date} (${days}일 남음)` : `${date} (만료)`;
}
