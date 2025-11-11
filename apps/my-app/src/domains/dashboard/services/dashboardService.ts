// Dashboard 도메인 서비스

export async function getServiceStats(_service: 'ALL' | 'BODY' | 'FOOD' | 'MIND') {
  // TODO: API 호출
  return {
    totalUsers: 12345,
    revenue: 45000000,
    activeSites: 87,
    usageRate: 94.2,
  };
}

export async function getUsageTrend(_service: 'ALL' | 'BODY' | 'FOOD' | 'MIND', _period: 'daily' | 'weekly' | 'monthly') {
  // TODO: API 호출
  return [];
}
