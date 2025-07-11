import React from 'react';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, loading } = useCurrency();

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <DollarSign className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currencies.find(curr => curr.code === currency)?.flag} {currency}
        </span>
        {loading && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2 min-w-[180px]">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => setCurrency(curr.code as any)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                currency === curr.code ? 'bg-burgundy-50 text-burgundy-900' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{curr.flag}</span>
              <div>
                <div className="text-sm font-medium">{curr.code}</div>
                <div className="text-xs text-gray-500">{curr.name}</div>
              </div>
              <span className="ml-auto text-sm">{curr.symbol}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;