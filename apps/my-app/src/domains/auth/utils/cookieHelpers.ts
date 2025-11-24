export function getCookieSecurityOptions() {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser ? window.location.protocol === 'https:' : true;
  return {
    sameSite: 'strict' as const,
    secure: isHttps,
    path: '/',
  };
}
