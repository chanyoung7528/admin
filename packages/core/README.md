# @repo/core

핵심 인프라 패키지 - API 클라이언트 및 공통 유틸리티

## 📦 모듈

- **api**: Axios 기반 HTTP 클라이언트
- **config**: 환경 변수 관리

## 사용법

```typescript
import { api } from '@repo/core/api';

// API 호출
const users = await api.get('/users');
```
