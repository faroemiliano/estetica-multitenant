import { Outlet } from "react-router-dom";
import { EsteticaProvider } from "../../context/EsteticaContext";

function EsteticaLayout() {
  return (
    <EsteticaProvider>
      <Outlet />
    </EsteticaProvider>
  );
}

export default EsteticaLayout;
