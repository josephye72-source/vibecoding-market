export {};

declare global {
  interface Window {
    __VCM_CLIPBOARD_WRITE__?: (text: string) => Promise<void>;
    __VCM_MEMORY_TEST_ORDER__?: string[];
    __VCM_POMODORO_TEST_DURATIONS__?: {
      break?: number;
      focus?: number;
    };
  }
}
