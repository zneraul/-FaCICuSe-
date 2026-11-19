'use strict';

(function initFacicuseProjectSync() {
  const headerAuthCta = document.getElementById('header-auth-cta');
  const heroAuthCta = document.getElementById('hero-auth-cta');
  const previewAuthCta = document.getElementById('preview-auth-cta');
  const ctaAuthLink = document.getElementById('cta-auth-link');

  // 1. Sync Sign In CTAs using live Express session cookie
  async function syncAuthCtas() {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      const isSignedIn = Boolean(data && (data.authenticated || data.user));
      if (!isSignedIn) return;

      if (headerAuthCta) {
        headerAuthCta.href = '/app/dashboard';
        headerAuthCta.textContent = 'Open Workspace';
        headerAuthCta.removeAttribute('data-open-auth-modal');
      }
      if (heroAuthCta) {
        heroAuthCta.href = '/app/dashboard';
        heroAuthCta.textContent = 'Open Workspace';
        heroAuthCta.removeAttribute('data-open-auth-modal');
      }
      if (previewAuthCta) {
        previewAuthCta.href = '/app/calendar';
        previewAuthCta.textContent = 'Open Calendar & Request';
        previewAuthCta.removeAttribute('data-open-auth-modal');
      }
      if (ctaAuthLink) {
        ctaAuthLink.href = '/app/dashboard';
        ctaAuthLink.textContent = 'Open Workspace';
        ctaAuthLink.removeAttribute('data-open-auth-modal');
      }
      const mobileAuthCta = document.getElementById('mobile-auth-cta');
      if (mobileAuthCta) {
        mobileAuthCta.href = '/app/dashboard';
        mobileAuthCta.textContent = 'Open Workspace';
        mobileAuthCta.removeAttribute('data-open-auth-modal');
      }
    } catch {
      // Keep default Sign In link for visitors
    }
  }

  // 2. Hydrate shared project metadata from backend single source of truth (/api/public/project-info)
  function resolvePath(obj, dotPath) {
    return dotPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  function hydrateProjectFields(project) {
    if (!project) return;
    document.querySelectorAll('[data-project-field]').forEach((el) => {
      const key = el.getAttribute('data-project-field');
      if (!key) return;
      const val = resolvePath(project, key);
      if (typeof val === 'string' || typeof val === 'number') {
        el.textContent = String(val);
        if (key === 'contactEmail' && el.tagName === 'A') {
          el.setAttribute('href', 'mailto:' + val);
        }
      }
    });
  }

  async function initProjectInfo() {
    try {
      const res = await fetch('/api/public/project-info');
      if (!res.ok) return;
      const payload = await res.json();
      if (payload && payload.project) {
        hydrateProjectFields(payload.project);
      }
    } catch {
      // Preserve static HTML fallbacks
    }
  }

  syncAuthCtas();
  initProjectInfo();
})();
