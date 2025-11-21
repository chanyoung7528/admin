// 문의 목록 조회
export async function getInquiries() {
  // TODO: Implement API call with api from @repo/core/api
  return [
    {
      id: '1',
      title: '서비스 이용 문의',
      user: '홍길동',
      date: '2025-01-15',
      status: '답변대기',
    },
    {
      id: '2',
      title: '결제 오류 신고',
      user: '김철수',
      date: '2025-01-14',
      status: '답변완료',
    },
  ];
}

// 답변 전송
export async function sendReply(data: { inquiryId: string; reply: string }) {
  // TODO: Implement API call
  return data;
}
