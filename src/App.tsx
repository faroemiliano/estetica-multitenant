// import { useEffect, useState } from "react";

// import LandingPage from "./pages/LandingPage";

// import DashboardPage from "./pages/DashboardPage";

// import CompletarPerfilPage from "./pages/CompletarPerfil";

// import { obtenerMiPerfil, completarPerfil } from "./services/clientes";
// import AdminPage from "./pages/AdminPage";
// import { useAuth } from "./context/AuthContext";

// function App() {
//   const { token, user } = useAuth();

//   const [perfilCompleto, setPerfilCompleto] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     estetica_id: 2,
//     nombre_completo: "",
//     fecha_nacimiento: "",
//     telefono: "",
//   });

//   const guardarPerfil = async () => {
//     try {
//       await completarPerfil(token, form);

//       setPerfilCompleto(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);

//       return;
//     }

//     obtenerMiPerfil(token)
//       .then(() => {
//         setPerfilCompleto(true);
//       })

//       .catch(() => {
//         setPerfilCompleto(false);
//       })

//       .finally(() => {
//         setLoading(false);
//       });
//   }, [token]);

//   if (loading) {
//     return <h1>Cargando...</h1>;
//   }

//   if (!token) {
//     return <LandingPage />;
//   }

//   if (!perfilCompleto) {
//     return (
//       <CompletarPerfilPage
//         form={form}
//         setForm={setForm}
//         completarPerfil={guardarPerfil}
//       />
//     );
//   }

//   const isAdmin = user?.role === "admin";

//   if (isAdmin) {
//     return <AdminPage />;
//   }

//   return <DashboardPage />;
// }

// export default App;
import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
