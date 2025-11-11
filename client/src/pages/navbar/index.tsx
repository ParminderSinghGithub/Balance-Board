import React, { useContext } from 'react';
import { Box, IconButton, Typography, useTheme, Button, Avatar, Tooltip } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { LogoutOutlined, TrendingUp } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { palette } = useTheme();
  const authContext = useContext(AuthContext);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: palette.background.paper,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${palette.grey[200]}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={onToggleSidebar}
          sx={{
            '&:hover': {
              backgroundColor: palette.primary.main + '15',
            }
          }}
        >
          <MenuIcon sx={{ color: palette.primary.main }} />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.tertiary[500]})`,
            }}
          >
            <TrendingUp sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.tertiary[500]})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Balance Board
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {authContext?.isLoggedIn && (
          <>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {authContext.userId?.toString().charAt(0).toUpperCase()}
            </Avatar>
            <Tooltip title="Logout">
              <Button
                onClick={authContext.logout}
                startIcon={<LogoutOutlined />}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: palette.grey[300],
                  color: palette.text.primary,
                  '&:hover': {
                    borderColor: palette.error.main,
                    color: palette.error.main,
                    backgroundColor: palette.error.main + '10',
                  },
                }}
              >
                Logout
              </Button>
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
