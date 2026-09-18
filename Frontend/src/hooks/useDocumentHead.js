import { useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings.js';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Lightweight per-route <head> manager for this SPA (no react-helmet dependency).
 * Sets title, meta description, canonical URL, Open Graph/Twitter tags, robots directive,
 * and applies the agency's name/logo (from Site Settings) to the tab title/favicon everywhere.
 */
export function useDocumentHead({ title, description, image, noIndex = false } = {}) {
  const { data: settings } = useSiteSettings();
  const agencyName = settings?.branding?.agencyName;
  const logoUrl = settings?.branding?.logoUrl;

  useEffect(() => {
    const fullTitle = title ? (agencyName ? `${title} | ${agencyName}` : title) : agencyName;
    if (fullTitle) document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', window.location.href);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setLink('canonical', window.location.origin + window.location.pathname);
  }, [title, description, image, noIndex, agencyName]);

  useEffect(() => {
    if (logoUrl) setLink('icon', logoUrl);
  }, [logoUrl]);
}
