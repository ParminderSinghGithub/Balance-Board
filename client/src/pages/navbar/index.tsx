import React, { useContext, useState } from 'react';
import { Box, IconButton, Typography, useTheme, Button, Avatar, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { LogoutOutlined, TrendingUp } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { palette } = useTheme();
  const authContext = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authContext?.token}`,
        },
      });

      if (response.ok) {
        authContext?.logout();
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account.');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

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
            <Tooltip title="Account Options">
              <Avatar
                onClick={handleAvatarClick}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: palette.primary.main,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: palette.primary.dark,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {authContext.userName?.charAt(0).toUpperCase() || authContext.userId?.toString().charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleDeleteClick} sx={{ color: palette.error.main }}>
                <LogoutOutlined sx={{ mr: 1, fontSize: 20 }} />
                Delete Account
              </MenuItem>
            </Menu>

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

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: palette.error.main, fontWeight: 600 }}>
          ⚠️ Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is <strong>irreversible</strong> and will permanently delete:
          </DialogContentText>
          <Box component="ul" sx={{ mt: 2, color: palette.text.secondary }}>
            <li>Your profile and personal information</li>
            <li>All your financial transactions and records</li>
            <li>All expense categories and types</li>
            <li>All historical data and reports</li>
          </Box>
          <DialogContentText sx={{ mt: 2, color: palette.error.main, fontWeight: 500 }}>
            This cannot be undone. Please confirm if you want to proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            disabled={isDeleting}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
