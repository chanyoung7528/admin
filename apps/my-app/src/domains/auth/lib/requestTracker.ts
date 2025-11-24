import { useFullPageLoadingStore } from '@repo/shared/hooks/useFullPageLoadingStore';
import type { RequestTimerEntry, RetryableRequestConfig } from '../types';
import { AUTH_CONFIG } from '../types';

let requestSequence = 0;
const requestTimers = new Map<number, RequestTimerEntry>();

/**
 * API 요청을 추적하고 일정 시간 이상 걸리면 로딩 UI 표시
 */
export function trackRequest(config: RetryableRequestConfig) {
  if (typeof window === 'undefined') {
    return;
  }

  const requestId = ++requestSequence;
  config._requestId = requestId;

  const timeoutId = window.setTimeout(() => {
    const entry = requestTimers.get(requestId);
    if (!entry) {
      return;
    }
    entry.visible = true;
    useFullPageLoadingStore.getState().show(requestId);
  }, AUTH_CONFIG.SLOW_REQUEST_THRESHOLD);

  requestTimers.set(requestId, { timeoutId, visible: false });
}

/**
 * 요청 추적 정리 및 로딩 UI 숨김
 */
export function clearRequestTracking(config: RetryableRequestConfig) {
  if (typeof window === 'undefined') {
    return;
  }

  const requestId = config._requestId;
  if (!requestId) {
    return;
  }

  const entry = requestTimers.get(requestId);
  if (!entry) {
    return;
  }

  window.clearTimeout(entry.timeoutId);
  if (entry.visible) {
    useFullPageLoadingStore.getState().hide(requestId);
  }

  requestTimers.delete(requestId);
}
