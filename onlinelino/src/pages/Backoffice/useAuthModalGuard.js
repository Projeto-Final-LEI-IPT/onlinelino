import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthModalGuard(showModal) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authorization");
    if (!token) {
      showModal(
        "Autenticação necessária",
        "Por favor, faça login para continuar.",
        "warning",
        () => navigate("/backoffice/login")
      );
    }

    setChecked(true);
  }, [navigate, showModal]);

  return checked; 
}
