import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate } from "react-router";
import { useSession } from "../SessionContext";
import { mockSignInWithCredentials } from "../auth/auth";

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();

  return (
    <SignInPage
      providers={[{ id: "credentials", name: "Credentials" }]}
      signIn={async (provider, formData, callbackUrl) => {
        if (provider.id !== "credentials") {
          return { error: "Provider não suportado." };
        }

        const email = formData.get("email");
        const password = formData.get("password");

        if (typeof email !== "string" || typeof password !== "string") {
          return { error: "Email e senha são obrigatórios." };
        }

        const result = await mockSignInWithCredentials({ email, password });

        if (result.success && result.user) {
          setSession({ user: result.user });
          navigate(callbackUrl || "/", { replace: true });
          return {};
        }

        return { error: result.error ?? "Erro desconhecido" };
      }}
    />
  );
}
