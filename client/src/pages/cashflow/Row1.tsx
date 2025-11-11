import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import FinancialMetricBox from '../../components/FinancialMetricsBox';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';

const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface FinancialData {
    report_year: string;
    total_income_value: string;
    expense_category: string;
    total_expense_value: string;
    savings_rate_value: string;
    total_yearly_expenses: string;
    cumulative_net_income_value: string;
}

interface FinancialDetails {
    dates: string;
    category: string;
    amount: string;
}

interface TransformedDataItem {
    month: string;
    [key: string]: string | number;
}

const transformDataForChart = (financialDetails: FinancialDetails[]): TransformedDataItem[] => {
    const transformedData: Record<string, TransformedDataItem> = {};

    financialDetails.forEach(({ dates, category, amount }) => {
        const month = dates;
        if (!transformedData[month]) {
            transformedData[month] = { month };
        }
        transformedData[month][category] = (parseFloat(amount) || 0) + (parseFloat(transformedData[month][category] as string) || 0);
    });

    return Object.values(transformedData);
};

const expenseColors = ["#82ca9d", "#8884d8", "#ffc658"];

const Row1: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [chartData, setChartData] = useState<TransformedDataItem[]>([]);
    const [chartExpense, setChartExpense] = useState<TransformedDataItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (!authContext?.token) return;
        
        const fetchData = async () => {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authContext.token}`
            };

            try {
                const response = await apiFetch(`${baseUrl}/feed/financial-overview`, { headers }, authContext);
                const data: FinancialData[] = await response.json();
                setFinancialData(data);

                const financialResponse = await apiFetch(`${baseUrl}/feed/financial-details`, { headers }, authContext);
                const financialDetails: FinancialDetails[] = await financialResponse.json();
                
                if (Array.isArray(financialDetails)) {
                    const transformedChartData = transformDataForChart(financialDetails);
                    setChartData(transformedChartData);
                }

                const financialExpense = await apiFetch(`${baseUrl}/feed/income-expenses`, { headers }, authContext);
                const financialDetailsExpense: FinancialDetails[] = await financialExpense.json();
                
                if (Array.isArray(financialDetailsExpense)) {
                    const transformedChartDataExpense = transformDataForChart(financialDetailsExpense);
                    setChartExpense(transformedChartDataExpense);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.token]);

    if (isLoading) return (
        <Box sx={{ gridArea: 'a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div>Loading...</div>
        </Box>
    );
    if (error) return (
        <Box sx={{ gridArea: 'a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div>Error loading data.</div>
        </Box>
    );
    if (!financialData.length || !chartData.length || !chartExpense.length) return (
        <Box sx={{ 
            gridArea: 'a / a / span 1 / span 3',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            backgroundColor: 'background.paper',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <Box sx={{ fontSize: '3rem', mb: 2 }}>💰</Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Welcome to Balance Board!
            </Box>
            <Box sx={{ fontSize: '1rem', color: 'text.secondary', mb: 3 }}>
                Start tracking your finances by adding your first expense.
            </Box>
            <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', opacity: 0.7 }}>
                Click the + button below to get started
            </Box>
        </Box>
    );

    const latestMonth = financialData[financialData.length - 1]?.report_year;
    const latestMonthData = financialData.filter(data => data.report_year === latestMonth);
    const { total_income_value, savings_rate_value, total_yearly_expenses, cumulative_net_income_value } = latestMonthData[0] || {};

    return (
        <>
            <DashboardBox sx={{
                gridArea: 'a',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1.5rem',
                overflow: 'auto',
            }}>
                <BoxHeader title="Financial Overview" subtitle="Monthly values of main financial metrics" sideText={`Updated: ${latestMonth || ''}`} />
                
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                    gap: '0.75rem',
                    mt: '0.5rem'
                }}>
                    <FinancialMetricBox title="Acc Income" value={parseFloat(total_income_value) || 0} unit="INR" />
                    <FinancialMetricBox title="Acc Net Income" value={(parseFloat(cumulative_net_income_value)) || 0} unit="INR" />
                    <FinancialMetricBox title="Savings Rate" value={parseFloat(parseFloat(savings_rate_value).toFixed(2)) || 0} unit="%" />
                    <FinancialMetricBox title="Total Expenses" value={parseFloat(parseFloat(total_yearly_expenses).toFixed(2)) || 0} unit="%" />
                </Box>

                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                    gap: '0.75rem'
                }}>
                    {latestMonthData.map((data, index) => (
                        <FinancialMetricBox key={index} title={data.expense_category} value={parseFloat(parseFloat(data.total_expense_value).toFixed(2)) || 0} unit="%" />
                    ))}
                </Box>
            </DashboardBox>

            <DashboardBox sx={{ 
                gridArea: 'b', 
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1.5rem',
                overflow: 'hidden',
            }}>
                <BoxHeader title="Expense/Income" subtitle="Monthly cashflow" sideText={`Updated: ${latestMonth || ''}`} />
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          data={chartExpense}
                          margin={{
                              top: 10, right: 10, left: 0, bottom: 5,
                          }}
                          barGap={10}
                          barCategoryGap={20}
                      >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12}/>
                          <YAxis fontSize={12}>
                              <Label value="INR" angle={-90} position="insideLeft" style={{ fontSize: 12 }} />
                          </YAxis>
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: "5px", fontSize: '12px' }} /> 
                          {Object.keys(chartExpense[0] || {}).filter(key => key !== 'month' && key !== 'Savings').map((key, idx) => (
                              <Bar 
                                  key={idx} 
                                  dataKey={key} 
                                  fill={expenseColors[idx % expenseColors.length]} 
                                  barSize={20}
                              />
                          ))}
                      </BarChart>
                    </ResponsiveContainer>
                </Box>
            </DashboardBox>

            <DashboardBox sx={{ 
                gridArea: 'c', 
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1.5rem',
                overflow: 'hidden',
            }}>
                <BoxHeader title="Savings Rate" subtitle="Monthly savings rate" sideText={`Updated: ${latestMonth || ''}`} />
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          data={chartExpense}
                          margin={{
                              top: 10, right: 10, left: 0, bottom: 5,
                          }}
                          barGap={10}
                          barCategoryGap={20}
                      >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12}/>
                          <YAxis fontSize={12}>
                              <Label value="Percentage (%)" angle={-90} position="insideLeft" style={{ fontSize: 12 }} />
                          </YAxis>
                          <Tooltip />
                          <Legend wrapperStyle={{ paddingTop: "5px", fontSize: '12px' }} /> 
                          {chartExpense.some(data => data.Savings) && (
                              <Bar 
                                  dataKey="Savings" 
                                  fill={expenseColors[0]} 
                                  barSize={20}
                              />
                          )}
                      </BarChart>
                    </ResponsiveContainer>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
