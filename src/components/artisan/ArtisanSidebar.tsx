
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  PackageOpen,
  Settings,
  Users,
  ShoppingCart,
  MessageSquare,
  BarChart2,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => (
  <Button
    asChild
    variant={active ? 'default' : 'ghost'}
    className={cn(
      'w-full justify-start',
      active ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white' : ''
    )}
  >
    <Link to={href}>
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  </Button>
);

export function ArtisanSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="h-screen w-64 border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-serif font-bold text-xl"
        >
          <span>yaad</span>
          <span className="text-terracotta-600">.com</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-2">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            DASHBOARD
          </h2>
          <div className="space-y-1">
            <NavItem 
              href="/artisan/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              label="Overview" 
              active={isActive('/artisan/dashboard')}
            />
            <NavItem 
              href="/artisan/products" 
              icon={<PackageOpen size={18} />} 
              label="Products" 
              active={isActive('/artisan/products')}
            />
            <NavItem 
              href="/artisan/orders" 
              icon={<ShoppingCart size={18} />} 
              label="Orders" 
              active={isActive('/artisan/orders')}
            />
          </div>
          
          <h2 className="mt-6 mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            ANALYTICS
          </h2>
          <div className="space-y-1">
            <NavItem 
              href="/artisan/stats" 
              icon={<BarChart2 size={18} />} 
              label="Statistics" 
              active={isActive('/artisan/stats')}
            />
          </div>
          
          <h2 className="mt-6 mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            ACCOUNT
          </h2>
          <div className="space-y-1">
            <NavItem 
              href="/artisan/messages" 
              icon={<MessageSquare size={18} />} 
              label="Messages" 
              active={isActive('/artisan/messages')}
            />
            <NavItem 
              href="/artisan/customers" 
              icon={<Users size={18} />} 
              label="Customers" 
              active={isActive('/artisan/customers')}
            />
            <NavItem 
              href="/artisan/settings" 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={isActive('/artisan/settings')}
            />
            <NavItem 
              href="/artisan/help" 
              icon={<HelpCircle size={18} />} 
              label="Help & Support" 
              active={isActive('/artisan/help')}
            />
          </div>
        </div>
        <div className="mt-6 px-4 py-2">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut size={18} className="mr-2" /> 
            Log Out
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default ArtisanSidebar;
