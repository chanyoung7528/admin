'use client';

import './quick.css';

import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_public/m/quick-menu')({
  component: MobileQuickMenuPage,
});

function MobileQuickMenuPage() {
  const [height, setHeight] = useState(0);

  const value = 65;
  const peerValue = 45;

  // 높이에 따라 색상 결정
  const getGradientByValue = (val: number) => {
    if (val >= 80) {
      // 매우 나쁨 (80-100%): 초록 → 노란 → 주황 → 빨강 (빨강이 맨 위)
      return 'linear-gradient(to top, #54e34f 0%, #fbd545 25%, #ff4a00 50%, #f8183c 100%)';
    } else if (val >= 60) {
      // 나쁨 (60-80%): 초록 → 노란 → 주황 (주황이 맨 위)
      return 'linear-gradient(to top, #54e34f 0%, #fbd545 40%, #ff4a00 100%)';
    } else if (val >= 40) {
      // 주의 (40-60%): 초록 → 노란 (노란색이 맨 위)
      return 'linear-gradient(to top, #54e34f 0%, #fbd545 100%)';
    } else if (val >= 20) {
      // 좋음 (20-40%): 초록 → 연두 (연두색이 맨 위)
      return 'linear-gradient(to top, #54e34f 0%, #7ee87a 100%)';
    } else {
      // 매우 좋음 (0-20%): 초록색만 (초록색이 맨 위)
      return 'linear-gradient(to top, #54e34f 0%, #54e34f 100%)';
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 후 약간의 지연을 주어 애니메이션이 확실히 보이게 합니다.
    const timer = setTimeout(() => {
      setHeight(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="bmi-card">
      <div className="content-left">
        <h2>
          비만은 건강에
          <br />
          해로워요
        </h2>
        <p className="description">
          몸매 관리를 위해
          <br />
          식단 조절이
          <br />
          필요해 보이네요
        </p>
        <button className="link-btn">추천 식품은 &gt;</button>
      </div>

      <div className="gauge-section">
        {/* 단계별 라벨 */}
        <div className="labels">
          <span>매우 나쁨</span>
          <span>나쁨</span>
          <span>주의</span>
          <span className="peer-label" style={{ bottom: `${peerValue}%` }}>
            또래 평균
          </span>
          <span>좋음</span>
          <span>매우 좋음</span>
        </div>

        {/* 온도계 본체 */}
        <div className="thermometer-container">
          {/* 병 하단 (넓은 둥근 부분) - 그라데이션 포함 */}
          <div className="bottle-bottom">
            <div
              className="gauge-fill"
              style={{
                height: `${height}%`,
                background: getGradientByValue(value),
              }}
            >
              {/* '나' 마커 아이콘 */}
              <div className="user-marker"></div>
            </div>
          </div>

          {/* 맨 밑 둥근 부분 초록색 채우기 */}
          <div className="bottle-bottom-2"></div>

          {/* 병 상단 (좁은 기둥 부분) - 오버플로우 히든 */}
          <div className="bottle-top">
            {/* 또래 평균 점선 */}
            <div className="peer-line" style={{ bottom: `${peerValue}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
