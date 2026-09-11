import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publicApi } from '../api/publicApi.js';

function getSessionId() {
  try {
    let id = sessionStorage.getItem('agency_session_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('agency_session_id', id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

function getUtm() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined,
  };
}

export function trackEvent(type, extra = {}) {
  publicApi.trackEvent({
    type,
    path: window.location.pathname,
    referrer: document.referrer,
    utm: getUtm(),
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    sessionId: getSessionId(),
    ...extra,
  });
}

/** Fires a page_view event on every route change. */
export function usePageViewTracking() {
  const location = useLocation();
  useEffect(() => {
    trackEvent('page_view');
  }, [location.pathname]);
}
