// 인증 토큰 쌍
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// 인증 토큰 API 응답
export interface AuthTokenResponse {
  result?: AuthTokens;
}

// 인증된 사용자 정보
export interface AuthUser {
  [key: string]: unknown;
}

// 로그인 요청 페이로드
export interface LoginPayload {
  userName: string;
  password: string;
}

// 리프레시 토큰 요청 페이로드
export interface RefreshTokenPayload {
  refreshToken: string;
}
