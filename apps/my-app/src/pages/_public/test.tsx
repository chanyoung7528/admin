import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/test')({
  component: TestComponent,
});

function TestComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Test Page</h1>
        <p className="text-muted-foreground mt-4">테스트 페이지</p>
      </div>
    </div>
  );
}
