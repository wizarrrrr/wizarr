// window.d.ts
import * as TAURI from '@tauri-apps/api';

declare global {
  interface Window {
    __TAURI__: ReturnType<typeof TAURI>;
  }
}
