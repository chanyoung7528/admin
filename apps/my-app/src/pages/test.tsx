import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: TestComponent,
});

function TestComponent() {
  return (
    <div className="p-2">
      <h3>test</h3>
    </div>
  );
}
