
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRate {
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  rate_against_eur: number;
  last_updated: string;
}

interface CurrencyContextType {
  currentCurrency: string;
  currencySymbol: string;
  currencyRates: CurrencyRate[];
  changeCurrency: (currencyCode: string) => void;
  convertPrice: (priceInEur: number, targetCurrency?: string) => number;
  formatPrice: (priceInEur: number, targetCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currentCurrency: 'EUR',
  currencySymbol: '€',
  currencyRates: [],
  changeCurrency: () => {},
  convertPrice: (price) => price,
  formatPrice: (price) => `${price}€`,
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    return localStorage.getItem('yaad-currency') || 'EUR';
  });
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState('€');

  // Fetch currency rates from Supabase
  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const { data, error } = await supabase
          .from('currency_rates')
          .select('*')
          .order('currency_code');

        if (error) {
          console.error('Error fetching currency rates:', error);
          return;
        }

        setCurrencyRates(data || []);
        
        // Set currency symbol for current currency
        const currentRate = data?.find(rate => rate.currency_code === currentCurrency);
        if (currentRate) {
          setCurrencySymbol(currentRate.currency_symbol);
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error);
      }
    };

    fetchCurrencyRates();
  }, [currentCurrency]);

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('yaad-currency', currentCurrency);
    const currentRate = currencyRates.find(rate => rate.currency_code === currentCurrency);
    if (currentRate) {
      setCurrencySymbol(currentRate.currency_symbol);
    }
  }, [currentCurrency, currencyRates]);

  const changeCurrency = (currencyCode: string) => {
    setCurrentCurrency(currencyCode);
  };

  const convertPrice = (priceInEur: number, targetCurrency?: string): number => {
    const currency = targetCurrency || currentCurrency;
    if (currency === 'EUR') return priceInEur;

    const rate = currencyRates.find(r => r.currency_code === currency);
    if (!rate) return priceInEur;

    return priceInEur * rate.rate_against_eur;
  };

  const formatPrice = (priceInEur: number, targetCurrency?: string): string => {
    const currency = targetCurrency || currentCurrency;
    const convertedPrice = convertPrice(priceInEur, currency);
    const rate = currencyRates.find(r => r.currency_code === currency);
    const symbol = rate?.currency_symbol || '€';
    
    // Special formatting for Japanese Yen (no decimals)
    if (currency === 'JPY') {
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      currencySymbol,
      currencyRates,
      changeCurrency,
      convertPrice,
      formatPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
