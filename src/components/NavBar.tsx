import { Stack, Button, Typography, Divider, alpha } from '@mui/material';
import {
  useNavigation,
  useActivePage,
  ThemeSwitcher,
  Account,
} from '@toolpad/core';
import { useNavigate } from 'react-router';

const CustomActions = () => (
  <Stack direction="row" alignItems="center" spacing={1}>
    {/* <ThemeSwitcher /> */}
    <Account
      slotProps={{
        preview: { slotProps: { avatarIconButton: { sx: { border: '0' } } } },
      }}
    />
  </Stack>
);

const renderNavigationItems = (
  items: Array<{
    kind?: string;
    title?: string;
    segment?: string;
    icon?: React.ReactNode;
    pattern?: string;
  }>,
  activePath: string | undefined,
  navigate: (path: string) => void
): React.ReactNode =>
  items.flatMap((item, index) => {
    const kind = item.kind ?? 'page';

    switch (kind) {
      case 'page': {
        const path = item.segment ? `/${item.segment}` : '/';
        const isActive = activePath === path;
        return (
          <Button
            key={item.segment ?? `page-${index}`}
            color={'inherit'}
            variant={isActive ? 'contained' : 'text'}
            startIcon={item.icon}
            onClick={() => navigate(path)}
            size="small"
            sx={{
              ...(isActive && {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.3),
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                  boxShadow: 'none',
                },
              }),
            }}
          >
            {item.title}
          </Button>
        );
      }
      case 'header':
        return (
          <Typography
            key={`header-${index}`}
            variant="subtitle2"
            color="textSecondary"
            sx={{
              userSelect: 'none',
              cursor: 'default',
              px: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {item.icon}
            {item.title}
          </Typography>
        );
      case 'divider':
        return (
          <Divider
            key={`divider-${index}`}
            orientation="vertical"
            flexItem
            sx={{ bgcolor: 'divider', mx: 1 }}
          />
        );
      default:
        return null;
    }
  });

export const NavBar = () => {
  const navigation = useNavigation();
  const activePage = useActivePage();
  const navigate = useNavigate();

  return (
    <Stack direction="row" alignItems="center" spacing={10}>
      <Stack direction="row" spacing={1} alignItems="center" flexGrow={1}>
        {renderNavigationItems(navigation, activePage?.path, (path) =>
          navigate(path)
        )}
      </Stack>
      <CustomActions />
    </Stack>
  );
};
