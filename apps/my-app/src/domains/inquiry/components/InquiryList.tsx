import { useInquiriesQuery } from '../hooks';

export default function InquiryList() {
  const { data, isLoading } = useInquiriesQuery();

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">1:1 문의 목록</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((inquiry, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{inquiry.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {inquiry.user} • {inquiry.date}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    inquiry.status === '답변완료' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">문의 내역이 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}
