import type { Session } from "@toolpad/core/AppProvider";

export async function signInWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: Session["user"]; error?: string }> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { success: false, error: "Credenciais incorretas" };
    }

    const token = response.headers
      .get("Authorization")
      ?.replace(/^Bearer\s+/i, "");
    const data = await response.json();

    if (!token && !data.token) {
      return { success: false, error: "Token JWT não encontrado" };
    }

    const finalToken = token ?? data.token;

    sessionStorage.setItem("token", finalToken);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    return {
      success: true,
      user: {
        id: data.user.id ?? null,
        name: data.user.name ?? null,
        email: data.user.email ?? null,
        image: data.user.image ?? null,
      },
    };
  } catch {
    return { success: false, error: "Erro na requisição" };
  }
}

export async function mockSignInWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: Session["user"]; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (password === "password") {
        const user = {
          id: "123",
          name: "Mock User",
          email,
          image: "https://i.pravatar.cc/150?u=mockuser",
        };
        sessionStorage.setItem("token", "mock-token-123");
        sessionStorage.setItem("user", JSON.stringify(user));
        resolve({ success: true, user });
      } else {
        resolve({ success: false, error: "Credenciais incorretas" });
      }
    }, 1000);
  });
}

export function signOut() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}
