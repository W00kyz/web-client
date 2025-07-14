import * as React from "react";
import { useNavigate, Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation, Session } from "@toolpad/core/AppProvider";
import SessionContext from "./SessionContext";
import ptBr from "./locales/ptbr";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { createTheme } from "@mui/material";

const NAVIGATION: Navigation = [
  { kind: "header", title: "Main items" },
  { title: "Dashboard", icon: <DashboardIcon /> },
  { title: "Conformidade", icon: <AssignmentIcon />, segment: "conformity" },
];
const BRANDING = { title: "VeraAI", logo: "" };

const lightAppBarColor = "#0D2B70";
const darkAppBarColor = "#0D2B70";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiAppBar: {
      defaultProps: { color: "primary", enableColorOnDark: true },
      styleOverrides: {
        root: {
          backgroundColor: lightAppBarColor,
          color: "#fff",
          "& .MuiTypography-root, & svg": {
            color: "#fff",
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: "#ffffff",
        },
        root: {
          backgroundColor: darkAppBarColor,
          color: "#fff",
          "& .MuiTypography-root, & svg": {
            color: "#fff",
          },
        },
      },
    },
  },
});

export const appTheme = { light: lightTheme, dark: darkTheme };

export default function App() {
  const navigate = useNavigate();

  const [session, setSession] = React.useState<Session | null>(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? { user: JSON.parse(saved) } : null;
  });

  const signIn = React.useCallback(() => navigate("/sign-in"), [navigate]);
  const signOut = React.useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setSession(null);
    navigate("/sign-in");
  }, [navigate]);

  const ctx = React.useMemo(() => ({ session, setSession }), [session]);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={{ signIn, signOut }}
      localeText={ptBr}
      theme={appTheme}
    >
      <SessionContext.Provider value={ctx}>
        <Outlet />
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}
