import { useNavigate } from "react-router-dom";
import { clearSession } from "../auth/session";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();//localStorage.removeItem("token"); // borra el token
    navigate("/login");               // redirige al login
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}

export default LogoutButton;
