import { prisma } from './prisma';
import type { User } from '@prisma/client';

/**
 * 카카오 ID로 사용자 조회
 */
export async function findUserByKakaoId(kakaoId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { kakaoId },
  });

  return user;
}

/**
 * 우리 서비스의 사용자 ID로 조회
 */
export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

/**
 * 신규 사용자 생성 (카카오 회원가입)
 */
export async function createUser(data: { kakaoId: string; email: string | null; nickname: string | null; profileImage: string | null }): Promise<User> {
  const user = await prisma.user.create({
    data: {
      kakaoId: data.kakaoId,
      email: data.email,
      nickname: data.nickname,
      profileImage: data.profileImage,
      provider: 'kakao',
    },
  });

  console.log('✅ [DB] 신규 사용자 생성:', user.id, user.nickname);

  return user;
}

/**
 * 사용자 정보 업데이트 (프로필, 마지막 로그인 시간 등)
 */
export async function updateUser(
  id: string,
  data: {
    email?: string | null;
    nickname?: string | null;
    profileImage?: string | null;
    lastLoginAt?: Date;
  }
): Promise<User | null> {
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  console.log('✅ [DB] 사용자 정보 업데이트:', id);

  return user;
}

/**
 * 마지막 로그인 시간 업데이트
 */
export async function updateLastLogin(id: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });

  console.log('✅ [DB] 마지막 로그인 시간 업데이트:', id);
}
