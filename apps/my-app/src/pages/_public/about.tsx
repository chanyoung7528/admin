import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/about')({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">About</h1>
        <p className="text-muted-foreground mt-4">관리자 시스템 정보</p>
      </div>
    </div>
  );
}
