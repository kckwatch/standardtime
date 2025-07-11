import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'CNY';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: Record<string, number>;
  convertPrice: (usdPrice: string) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 0.85,
    CNY: 7.2
  });
  const [loading, setLoading] = useState(false);

  // Fetch live exchange rates from multiple sources
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      try {
        // Try multiple free APIs for better reliability
        let rates = null;
        
        // First try: exchangerate-api.com
        try {
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (response.ok) {
            const data = await response.json();
            rates = {
              USD: 1,
              EUR: data.rates.EUR || 0.85,
              CNY: data.rates.CNY || 7.2
            };
          }
        } catch (error) {
          console.log('First API failed, trying backup...');
        }

        // Second try: fixer.io backup
        if (!rates) {
          try {
            const response = await fetch('https://api.fixer.io/latest?base=USD&symbols=EUR,CNY');
            if (response.ok) {
              const data = await response.json();
              rates = {
                USD: 1,
                EUR: data.rates.EUR || 0.85,
                CNY: data.rates.CNY || 7.2
              };
            }
          } catch (error) {
            console.log('Second API failed, trying third...');
          }
        }

        // Third try: currencyapi.net
        if (!rates) {
          try {
            const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_YOUR_API_KEY&base_currency=USD&currencies=EUR,CNY');
            if (response.ok) {
              const data = await response.json();
              rates = {
                USD: 1,
                EUR: data.data.EUR?.value || 0.85,
                CNY: data.data.CNY?.value || 7.2
              };
            }
          } catch (error) {
            console.log('Third API failed, using fallback rates');
          }
        }

        // If all APIs fail, use reasonable fallback rates
        if (!rates) {
          rates = {
            USD: 1,
            EUR: 0.85,
            CNY: 7.2
          };
        }

        setExchangeRates(rates);
        console.log('Exchange rates updated:', rates);
        
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Keep default rates if all fail
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchExchangeRates();

    // Then fetch every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const convertPrice = (usdPrice: string): string => {
    if (!usdPrice) return '$0.00';
    
    // Extract numeric value from price string
    const numericPrice = parseFloat(usdPrice.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) return usdPrice;

    const convertedPrice = numericPrice * exchangeRates[currency];
    
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      CNY: '¥'
    };

    // Format with proper decimal places
    const formatted = convertedPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${currencySymbols[currency]}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRates,
      convertPrice,
      loading
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};