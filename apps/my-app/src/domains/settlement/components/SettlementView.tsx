import { FormViewer } from '@repo/shared/components/form';
export function SettlementView() {
  return (
    <FormViewer
      title="메뉴 정보"
      rows={[
        {
          fields: [
            { label: '메뉴명', value: '김치찌개' },
            { label: '가격', value: '12,000원' },
          ],
        },
        {
          fields: [
            {
              label: '태그',
              value: (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">매운맛</span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">인기메뉴</span>
                </div>
              ),
              span: 2,
            },
          ],
        },
      ]}
    />
  );
}
