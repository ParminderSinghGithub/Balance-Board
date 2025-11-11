import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import ExpenseFormModal from "../../components/ExpenseFormModal";
import { useState } from "react";

const gridTemplateLargeScreens = `
    "a a a"
    "b c d"
    "e e f"
`;

const gridTemplateSmallScreens = `
    "a"
    "b"
    "c"
    "d"
    "e"
    "f"
`;

const CashFlow = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleExpenseAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Box
            width="100%"
            height="100%"
            display="grid"
            gap="1.5rem"
            p="1.5rem"
            sx={
                isAboveMediumScreens
                    ? {
                          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                          gridTemplateRows: "repeat(3, minmax(350px, auto))",
                          gridTemplateAreas: gridTemplateLargeScreens,
                      }
                    : {
                          gridTemplateColumns: "1fr",
                          gridAutoRows: "minmax(350px, auto)",
                          gridTemplateAreas: gridTemplateSmallScreens,
                      }
            }
        >
            <Row1 key={`row1-${refreshKey}`} />
            <Row2 key={`row2-${refreshKey}`} />
            <ExpenseFormModal onExpenseAdded={handleExpenseAdded} />
        </Box>
    );
};

export default CashFlow;
