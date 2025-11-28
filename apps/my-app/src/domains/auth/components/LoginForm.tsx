import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@repo/shared/components/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLogin } from '../hooks/useLogin';

// 로그인 폼 스키마 정의
const loginSchema = z.object({
  userName: z.string().min(1, '사용자명을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const { loginAsync, isLoading, isError, error } = useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    await loginAsync(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isError && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error instanceof Error ? error.message : '로그인에 실패했습니다.'}</p>
              <p className="text-muted-foreground mt-1 text-xs">사용자명과 비밀번호를 확인하고 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="userName" className="text-sm font-medium">
          사용자명
        </label>
        <Input id="userName" type="text" placeholder="사용자명을 입력하세요" disabled={isLoading} {...register('userName')} />
        {errors.userName && <p className="text-destructive text-sm text-red-500">{errors.userName.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input id="password" type="password" placeholder="••••••••" disabled={isLoading} {...register('password')} />
        {errors.password && <p className="text-destructive text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
}
