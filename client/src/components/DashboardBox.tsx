import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    border: `1px solid ${theme.palette.grey[200]}`,
    transition: "all 0.3s ease",
    "&:hover": {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        transform: "translateY(-2px)",
    },
}));

export default DashboardBox;
