
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, User, ShoppingBag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Artisans', href: '/admin/artisans', icon: User },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-xl font-bold text-terracotta-800">Craft Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-terracotta-100 text-terracotta-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      isActive ? 'text-terracotta-700' : 'text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
