import React, { useState, useContext } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    InputAdornment,
    IconButton,
    Alert,
    Fade,
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff, Email, Lock, TrendingUp } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
    const theme = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = auth;

    const switchModeHandler = () => {
        setIsLogin((prevMode) => !prevMode);
        setError('');
        setSuccess('');
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (email.trim().length === 0 || password.trim().length < 6) {
            setError('Please enter a valid email and password (min 6 characters).');
            setIsLoading(false);
            return;
        }

        const endpoint = isLogin ? 'login' : 'signup';
        const url = `http://localhost:8000/auth/${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            if (isLogin) {
                // Login successful
                login(data.token, data.userId);
            } else {
                // Signup successful - auto login
                setSuccess('Account created successfully! Logging you in...');
                // Immediately login the user after signup
                setTimeout(async () => {
                    try {
                        const loginResponse = await fetch('http://localhost:8000/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email, password }),
                        });
                        const loginData = await loginResponse.json();
                        if (loginResponse.ok) {
                            login(loginData.token, loginData.userId);
                        }
                    } catch (err) {
                        setError('Account created but auto-login failed. Please login manually.');
                        setIsLogin(true);
                    }
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${(theme.palette.tertiary as any)[600]} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                },
            }}
        >
            <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            padding: { xs: 3, sm: 5 },
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 4,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Logo/Brand Section */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary[500]})`,
                                    mb: 2,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                }}
                            >
                                <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary[500]})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                Balance Board
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                                {isLogin ? 'Welcome back!' : 'Start your financial journey'}
                            </Typography>
                        </Box>

                        {/* Error/Success Messages */}
                        {error && (
                            <Fade in>
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}
                        {success && (
                            <Fade in>
                                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {/* Form */}
                        <form onSubmit={submitHandler}>
                            <TextField
                                type="email"
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary[500]})`,
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : isLogin ? (
                                    'Sign In'
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                </Typography>
                                <Button
                                    variant="text"
                                    onClick={switchModeHandler}
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default LoginPage;
