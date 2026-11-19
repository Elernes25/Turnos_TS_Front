import { Navigate } from "react-router-dom";
import { getSession } from "../../auth/session";

export const DashboardPorRol = () => {
   const session =getSession();
  

  switch (session?.rol) {
    case "RECEPCIONISTA":
      return <Navigate to="/recepcion" replace />;

    case "MEDICO":
      return <Navigate to="/medico" replace />;

    case "SUPERVISOR":
      return <Navigate to="/supervisor" replace />;

 //   case RolUsuario.ADMIN:
 //     return <Navigate to="/supervisor" replace />;

    default:
      return <Navigate to="/403" replace />;
  }
};