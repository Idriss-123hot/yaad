
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
}

export function CurrencySelector({ className }: CurrencySelectorProps) {
  const { currentCurrency, currencyRates, changeCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <DollarSign className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencyRates.map((currency) => (
          <DropdownMenuItem 
            key={currency.currency_code}
            onClick={() => changeCurrency(currency.currency_code)}
            className={currentCurrency === currency.currency_code ? 'bg-terracotta-50 text-terracotta-600' : ''}
          >
            <span className="mr-2">{currency.currency_symbol}</span>
            {currency.currency_name} ({currency.currency_code})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrencySelector;
