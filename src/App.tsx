import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Authentication, Navigation } from '@toolpad/core/AppProvider';
import SessionContext, { Session } from './hooks/useSession';
import ptBr from './locales/ptbr';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { createTheme } from '@mui/material';
import type { User } from 'firebase/auth';
import {
  firebaseSignOut,
  onAuthStateChanged,
  signInWithGoogle,
} from '../src/auth/auth';
import { ptBR as datePtBR } from '@mui/x-date-pickers/locales';
import { ptBR as gridPtBr } from '@mui/x-data-grid/locales';

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Main items' },
  { title: 'Home', icon: <DashboardIcon /> },
  {
    title: 'Templates',
    segment: 'templates',
    icon: <AssignmentIcon />,
    pattern: 'templates{/:templateId}*',
  },
];
const BRANDING = { title: 'VeraAI', logo: '' };

const lightAppBarColor = '#0D2B70';
const darkAppBarColor = '#0D2B70';

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
    },
    components: {
      MuiAppBar: {
        defaultProps: { color: 'primary', enableColorOnDark: true },
        styleOverrides: {
          root: {
            backgroundColor: lightAppBarColor,
            color: '#fff',
            '& .MuiTypography-root, & svg': {
              color: '#fff',
            },
          },
        },
      },
    },
  },
  datePtBR,
  gridPtBr
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: '#ffffff',
        },
        root: {
          backgroundColor: darkAppBarColor,
          color: '#fff',
          '& .MuiTypography-root, & svg': {
            color: '#fff',
          },
        },
      },
    },
  },
});

const AUTHENTICATION: Authentication = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};

export const appTheme = { light: lightTheme, dark: darkTheme };

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading]
  );

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user: User | null) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || '',
            email: user.email || '',
            image: user.photoURL || '',
            token: (await user.getIdToken()) || '',
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={AUTHENTICATION}
      localeText={ptBr}
      theme={appTheme}
    >
      <SessionContext.Provider value={sessionContextValue}>
        <Outlet />
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}
