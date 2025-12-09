## @repo/eslint-config

ESLint + Prettier 기본 설정 묶음입니다. Flat config를 사용하며 React/Node/라이브러리에서 공통 룰을 재사용합니다.

### React/Vite 프로젝트

```js
// eslint.config.js
import { reactConfig } from '@repo/eslint-config';

export default reactConfig;
```

### 라이브러리/Node 프로젝트

```js
import { baseConfig } from '@repo/eslint-config/base';

export default baseConfig;
```

### Prettier 설정만 가져가기

```js
import prettierConfig from '@repo/eslint-config/prettier';
export default prettierConfig;
```

### 포함 내용

- ESLint Recommended + TypeScript ESLint Recommended
- Prettier 연동 (`eslint-plugin-prettier/recommended`)
- simple-import-sort
- React Hooks/React Refresh(reactConfig)
- 기본 ignore: `dist`, `build`, `.turbo`, `storybook-static` 등

Peer dependency: `typescript >= 5.0.0`
