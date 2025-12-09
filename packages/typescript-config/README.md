## @repo/typescript-config

공통 TSConfig 세트를 제공합니다. `base` → `react` → `vite` 순으로 확장합니다.

### 라이브러리(React 없이)

```json
{
  "extends": "@repo/typescript-config/base",
  "include": ["src"]
}
```

### React 라이브러리

```json
{
  "extends": "@repo/typescript-config/react",
  "include": ["src"]
}
```

### Vite 기반 앱

```json
{
  "extends": "@repo/typescript-config/vite",
  "include": ["src"]
}
```

주요 옵션: `strict` on, `noUnusedLocals/Parameters`, `declaration` 출력, `jsx: react-jsx`(react), `types: ["vite/client", "node"]`(vite).
