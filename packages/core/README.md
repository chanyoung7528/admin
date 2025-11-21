# @repo/core

핵심 인프라 패키지 - API 클라이언트 및 공통 유틸리티

## 📦 모듈

- **api**: Axios 기반 HTTP 클라이언트
- **config**: 환경 변수 관리
- **utils**: Cookie, Storage 유틸리티

## 사용법

```typescript
import { api } from '@repo/core/api';
import { cookie, localStore } from '@repo/core/utils';

// API 호출
const users = await api.get('/users');

// 쿠키 관리 (비동기)
await cookie.set('token', 'abc123', { expires: new Date(Date.now() + 3600000) });
const token = await cookie.get('token');

// 스토리지 관리 (동기)
localStore.set('user', { id: 1, name: 'Kim' });
const user = localStore.get<{ id: number }>('user');
```

## 📖 상세 가이드

- [Cookie & Storage 가이드](/docs/COOKIE_STORAGE_GUIDE.md)

## 🔗 참고 문서

- [Cookie Store API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API)
- [Web Storage API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Axios 공식 문서](https://axios-http.com/)
