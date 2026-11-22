/// <reference types="vite/client" />

import type { electronAPI } from '../electron/preload';

declare global {
  const __APP_VERSION__: string;
  /** 구매자 배포 빌드 여부 (vite define). true면 관리자 기능이 번들에서 제거된다. */
  const __BUYER_BUILD__: boolean;
  const __ADMIN_KEY_FNV__: number;
  interface Window {
    electronAPI: typeof electronAPI;
  }
}

