/**
 * Normalizes image URLs so that local relative paths (like 'is-your-child-smart.png', 
 * '/src/assets/images/...', '/assets/images/...', or 'src/assets/images/...')
 * are reliably resolved into accessible public URLs.
 */
export function formatImageUrl(url?: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800';
  }

  const trimmed = url.trim();

  // Return full HTTP/HTTPS/data URLs as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Strip leading slashes and prefixes
  let clean = trimmed.replace(/^\/+/, '');
  if (clean.startsWith('public/')) clean = clean.replace(/^public\//, '');
  
  // If it's already src/assets/images/... or assets/images/...
  if (clean.startsWith('src/assets/images/')) {
    return `/${clean}`;
  }
  if (clean.startsWith('assets/images/')) {
    return `/${clean}`;
  }
  
  // If it's src/assets/...
  if (clean.startsWith('src/assets/')) {
    return `/${clean}`;
  }
  if (clean.startsWith('assets/')) {
    return `/${clean}`;
  }

  // If it's just a filename like "is-your-child-smart.png"
  if (clean.includes('.')) {
    return `/assets/images/${clean.replace(/^images\//, '')}`;
  }

  return `/${clean}`;
}

/**
 * Returns referrerPolicy attribute value: only 'no-referrer' for external URLs,
 * undefined for local images (to prevent CORS/iframe referrer issues in dev sandbox).
 */
export function getReferrerPolicy(url?: string): "no-referrer" | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'no-referrer';
  }
  return undefined;
}
