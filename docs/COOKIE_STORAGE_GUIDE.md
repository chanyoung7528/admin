# Cookie & Storage 유틸리티 가이드

`@repo/core` 패키지의 쿠키 및 스토리지 관리 유틸리티 사용 가이드입니다.

> **Note**: API 클라이언트와 인증 관련 내용은 [인증 가이드](./AUTHENTICATION_GUIDE.md)를 참고하세요.

## 📦 설치

```typescript
import { cookie, localStore, sessionStore } from '@repo/core/utils';
```

## 🍪 Cookie 유틸리티

비동기 Cookie Store API 기반 ([MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API))

### 기본 사용법

```typescript
// 쿠키 저장
await cookie.set('token', 'abc123', {
  expires: new Date(Date.now() + 3600000), // 1시간
  path: '/',
  secure: true,
  sameSite: 'strict',
});

// 쿠키 조회
const token = await cookie.get('token'); // string | null

// 쿠키 삭제
await cookie.remove('token', { path: '/' });

// 모든 쿠키 조회
const allCookies = await cookie.getAll();
```

### 옵션

| 옵션       | 타입                          | 설명                               |
| ---------- | ----------------------------- | ---------------------------------- |
| `expires`  | `Date \| number \| null`      | 만료일 (Date 객체 또는 타임스탬프) |
| `path`     | `string`                      | 경로 (기본값: `/`)                 |
| `domain`   | `string \| null`              | 도메인                             |
| `secure`   | `boolean`                     | HTTPS 전용 여부                    |
| `sameSite` | `'strict' \| 'lax' \| 'none'` | SameSite 정책                      |

### 브라우저 호환성

- 모던 브라우저: 네이티브 Cookie Store API 사용
- 레거시 브라우저: [cookie-store 폴리필](https://github.com/markcellus/cookie-store) 자동 적용

---

## 💾 Storage 유틸리티

LocalStorage 및 SessionStorage 래퍼 ([MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API))

### 기본 사용법

```typescript
// 데이터 저장 (자동 JSON 직렬화)
localStore.set('user', { id: 1, name: 'Kim' });

// 데이터 조회 (제네릭 타입 지원)
const user = localStore.get<{ id: number; name: string }>('user');

// 존재 여부 확인
if (localStore.has('user')) {
  // ...
}

// 데이터 삭제
localStore.remove('user');

// 전체 삭제
localStore.clear();
```

### SessionStorage

```typescript
sessionStore.set('tempData', 'value');
const data = sessionStore.get('tempData');
```

### 특징

- ✅ JSON 자동 변환 (객체/배열 저장 가능)
- ✅ SSR 안전 (서버 환경에서도 에러 없음)
- ✅ 타입 안정성 (제네릭 지원)
- ✅ 할당량 초과 에러 처리

---

## 📚 추가 문서

- [Cookie Store API 명세](https://wicg.github.io/cookie-store/)
- [Web Storage API 명세](https://html.spec.whatwg.org/multipage/webstorage.html)
- [인증 가이드](./AUTHENTICATION_GUIDE.md) - API 클라이언트 및 인증 시스템
- [프로젝트 구조 가이드](./ALIAS_GUIDE.md)
