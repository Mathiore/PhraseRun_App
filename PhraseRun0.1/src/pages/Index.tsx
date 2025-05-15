
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [user.isAuthenticated, navigate]);

  return <LoginForm />;
};

export default Index;
