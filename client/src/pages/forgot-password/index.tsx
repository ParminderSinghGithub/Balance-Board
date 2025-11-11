import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    InputAdornment,
    Alert,
    Fade,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Email, Lock, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

    const handleRequestOTP = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!email.trim()) {
            setError('Please enter your email address.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            setSuccess('OTP sent to your email! Please check your inbox.');
            setActiveStep(1);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/'), 2000);
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
                        {/* Back Button */}
                        <Button
                            onClick={() => navigate('/')}
                            sx={{
                                mb: 2,
                                color: theme.palette.primary.main,
                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                            }}
                        >
                            ← Back to Login
                        </Button>

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
                                Reset Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                                We'll help you recover your account
                            </Typography>
                        </Box>

                        {/* Stepper */}
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

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

                        {/* Step 1: Email Input */}
                        {activeStep === 0 && (
                            <form onSubmit={handleRequestOTP}>
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

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isLoading}
                                    sx={{
                                        mt: 3,
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
                                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send OTP'}
                                </Button>
                            </form>
                        )}

                        {/* Step 2 & 3: OTP and New Password */}
                        {activeStep === 1 && (
                            <form onSubmit={handleResetPassword}>
                                <TextField
                                    type="text"
                                    label="Enter 6-Digit OTP"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    inputProps={{ maxLength: 6 }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            letterSpacing: '8px',
                                            fontSize: '1.5rem',
                                            textAlign: 'center',
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    type="password"
                                    label="New Password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
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
                                    type="password"
                                    label="Confirm New Password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
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
                                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                                </Button>
                            </form>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
