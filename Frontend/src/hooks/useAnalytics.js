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

const LANDING_PAGE_KEY = 'agency_landing_page';

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

/**
 * Records the very first page this browser session landed on. Safe to call on every
 * page view - it only writes once per session, so it reflects true first-touch entry.
 */
function captureLandingPage() {
  try {
    if (!sessionStorage.getItem(LANDING_PAGE_KEY)) {
      sessionStorage.setItem(LANDING_PAGE_KEY, window.location.href);
    }
    return sessionStorage.getItem(LANDING_PAGE_KEY);
  } catch {
    return window.location.href;
  }
}

/**
 * Source/UTM metadata attached to an enquiry submission (flat keys, matching
 * Backend/src/validators/enquiry.validator.js's `source` shape) - distinct from the
 * nested `utm: {...}` object used for first-party analytics events above.
 */
export function getEnquirySourceMeta() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
    landingPage: captureLandingPage(),
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
    captureLandingPage();
    trackEvent('page_view');
  }, [location.pathname]);
}
