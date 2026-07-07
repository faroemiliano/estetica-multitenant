import { Outlet } from "react-router-dom";
import { EsteticaProvider, useEstetica } from "../../context/EsteticaContext";

function LayoutContent() {
  const { loading } = useEstetica();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
}

function EsteticaLayout() {
  return (
    <EsteticaProvider>
      <LayoutContent />
    </EsteticaProvider>
  );
}

export default EsteticaLayout;
