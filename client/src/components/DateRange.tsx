import React, { createContext, useState, useContext, ReactNode } from 'react';

type DateRangeState = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangeContextType = {
  dateRange: DateRangeState;
  setDateRange: (dateRange: DateRangeState) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

type DateRangeProviderProps = {
  children: ReactNode;
};

export const DateRangeProvider: React.FC<DateRangeProviderProps> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: new Date(),
    endDate: new Date(),
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};
