"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { ApiUnauthorizedError } from "@/lib/api";

export function useUnauthorizedHandler() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuth, getToken, setIsAuth } = useContext(AuthContext);

  const verifyToken = () => {
    const token = getToken();
    if (!token || !isAuth) {
      setIsAuth(false);
      router.push("/");
    }
  };

  const unauthorizedHandler = (error: unknown) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    if (error instanceof ApiUnauthorizedError) {
      setIsAuth(false);
      toast({
        title: error.message,
        variant: "destructive",
        duration: toastDurationInMiliseconds,
      });
      router.push("/");
    } else {
      toast({
        title: "Houve um erro inesperado, tente novamente.",
        variant: "destructive",
        duration: toastDurationInMiliseconds,
      });
    }
  };

  return { verifyToken, unauthorizedHandler };
}
