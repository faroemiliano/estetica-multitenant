import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="flex w-full justify-center px-4 py-6">
        <div className="w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
