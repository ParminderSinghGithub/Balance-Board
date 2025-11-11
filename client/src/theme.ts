// Extend Material-UI Palette types
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: {
      [key: number]: string;
    };
  }
  interface PaletteOptions {
    tertiary?: {
      [key: number]: string;
    };
  }
}

export const tokens = {
    grey: {
        100: "#f5f5f7",
        200: "#e8e9ed",
        300: "#d1d3da",
        400: "#9a9ca5",
        500: "#6c6e78",
        600: "#4a4c56",
        700: "#35373e",
        800: "#26272e",
        900: "#1a1b20",
    },
    primary: {
        // Modern teal/cyan
        100: "#d4f4f7",
        200: "#a9e9ef",
        300: "#7edde7",
        400: "#53d2df",
        500: "#28c7d7",
        600: "#209fac",
        700: "#187781",
        800: "#105056",
        900: "#08282b",
    },
    secondary: {
        // Warm coral/orange
        100: "#ffe8d9",
        200: "#ffd1b3",
        300: "#ffba8d",
        400: "#ffa367",
        500: "#ff8c41",
        600: "#cc7034",
        700: "#995427",
        800: "#66381a",
        900: "#331c0d",
    },
    tertiary: {
        500: "#6366f1",
        600: "#4f46e5",
    },
    success: {
        500: "#10b981",
        600: "#059669",
    },
    warning: {
        500: "#f59e0b",
        600: "#d97706",
    },
    error: {
        500: "#ef4444",
        600: "#dc2626",
    },
    background: {
        light: "#ffffff",
        main: "#f8fafc",
        dark: "#0f172a",
        paper: "#ffffff",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
};

export const themeSettings = {
    palette: {
        mode: 'light' as const,
        primary: {
            ...tokens.primary,
            main: tokens.primary[500],
            light: tokens.primary[300],
            dark: tokens.primary[700],
            contrastText: '#ffffff',
        },
        secondary: {
            ...tokens.secondary,
            main: tokens.secondary[500],
            light: tokens.secondary[300],
            dark: tokens.secondary[700],
            contrastText: '#ffffff',
        },
        tertiary: {
            ...tokens.tertiary,
        },
        success: {
            ...tokens.success,
            main: tokens.success[500],
        },
        warning: {
            ...tokens.warning,
            main: tokens.warning[500],
        },
        error: {
            ...tokens.error,
            main: tokens.error[500],
        },
        grey: {
            ...tokens.grey,
            main: tokens.grey[500],
        },
        background: {
            default: tokens.background.main,
            paper: tokens.background.paper,
            light: tokens.background.light,
            dark: tokens.background.dark,
        },
        text: {
            primary: tokens.grey[900],
            secondary: tokens.grey[600],
        },
    },
    typography: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        fontSize: 14,
        h1: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 28,
            fontWeight: 600,
        },
        h4: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 20,
            fontWeight: 600,
        },
        h5: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 16,
            fontWeight: 500,
        },
        h6: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 14,
            fontWeight: 500,
        },
        body1: {
            fontSize: 14,
            lineHeight: 1.5,
        },
        body2: {
            fontSize: 13,
            lineHeight: 1.43,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        '0px 16px 32px rgba(0,0,0,0.14)',
        '0px 20px 40px rgba(0,0,0,0.16)',
        '0px 24px 48px rgba(0,0,0,0.18)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 2px 4px rgba(0,0,0,0.05)',
    ] as any,
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    borderRadius: 12,
                    fontWeight: 500,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                    },
                    variants: [],
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    variants: [],
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
                    variants: [],
                },
            },
        },
    },
};
