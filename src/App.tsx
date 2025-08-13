import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Authentication, Navigation } from '@toolpad/core/AppProvider';
import SessionContext, { Session } from './hooks/useSession';
import ptBr from './locales/ptbr';
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
  { title: 'Início' },
  {
    title: 'Templates',
    segment: 'templates',
    pattern: 'templates{/:templateId}*',
  },
  {
    title: 'Extração',
    segment: 'extraction',
  },
];

const BRANDING = {
  title: '',
  logo: <img src="src/assets/images/logo_complete.png" />,
};

const primaryColor = '#6750A4';

const lightTheme = createTheme(
  {
    palette: {
      DataGrid: {
        bg: '#FFFFFF',
      },
      mode: 'light',
      primary: {
        main: primaryColor,
        contrastText: '#fff',
      },
      background: { default: '#F5F5FA' },
    },
    components: {
      MuiAppBar: {
        defaultProps: { color: 'primary', enableColorOnDark: true },
        styleOverrides: {
          root: {
            backgroundColor: '#fff', // ← USA O ROXO
            color: primaryColor,
            '& .MuiTypography-root, & svg': {
              color: primaryColor,
            },
          },
        },
      },
    },
  },
  datePtBR,
  gridPtBr
);

const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: primaryColor, // ← COR PRIMÁRIA ROXA
        contrastText: '#fff',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: primaryColor, // ← USA O ROXO
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
