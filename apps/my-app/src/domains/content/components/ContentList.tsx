export function ContentList() {
  const contents = [
    {
      id: 'CNT-2025-001',
      title: '명상 가이드 프로그램',
      provider: '마음챙김 스튜디오',
      type: '동영상',
      sites: 12,
      status: '제공중',
      contractEnd: '2026-12-31',
    },
    {
      id: 'CNT-2025-002',
      title: '스트레스 관리 워크북',
      provider: '힐링 퍼블리셔',
      type: '전자책',
      sites: 8,
      status: '제공중',
      contractEnd: '2026-06-30',
    },
    {
      id: 'CNT-2025-003',
      title: '수면 개선 오디오',
      provider: '슬립 미디어',
      type: '오디오',
      sites: 15,
      status: '계약만료',
      contractEnd: '2025-10-31',
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">콘텐츠 제공 현황</h2>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">신규 계약 등록</button>
      </div>

      <p className="text-muted-foreground mb-6">MY MIND 콘텐츠 계약 및 제공 현황을 관리합니다</p>

      {/* 콘텐츠 요약 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">총 콘텐츠</p>
          <p className="mt-1 text-2xl font-bold">48개</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
          <p className="text-sm text-green-700 dark:text-green-300">제공중</p>
          <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">42개</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">갱신대기</p>
          <p className="mt-1 text-2xl font-bold text-yellow-900 dark:text-yellow-100">4개</p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">계약만료</p>
          <p className="mt-1 text-2xl font-bold text-red-900 dark:text-red-100">2개</p>
        </div>
      </div>

      {/* 콘텐츠 테이블 */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">콘텐츠명</th>
              <th className="px-4 py-3 text-left text-sm font-medium">제공사</th>
              <th className="px-4 py-3 text-left text-sm font-medium">유형</th>
              <th className="px-4 py-3 text-center text-sm font-medium">제공 Site</th>
              <th className="px-4 py-3 text-left text-sm font-medium">계약만료일</th>
              <th className="px-4 py-3 text-center text-sm font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.id} className="hover:bg-muted/50 border-t">
                <td className="px-4 py-3 text-sm font-medium">{content.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{content.title}</td>
                <td className="px-4 py-3 text-sm">{content.provider}</td>
                <td className="px-4 py-3 text-sm">{content.type}</td>
                <td className="px-4 py-3 text-center text-sm">{content.sites}개</td>
                <td className="px-4 py-3 text-sm">{content.contractEnd}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      content.status === '제공중'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : content.status === '갱신대기'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {content.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
