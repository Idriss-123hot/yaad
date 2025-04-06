import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  FolderTree,
  BuildingStorefront
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const linkClasses = (isActive: boolean) => {
  return `flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
    isActive ? 'bg-gray-100 font-bold' : 'text-gray-700'
  }`;
};

export function AdminSidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Admin Dashboard</SheetTitle>
            <SheetDescription>
              Manage your store settings and content.
            </SheetDescription>
          </SheetHeader>
          <nav className="mt-4">
            <div className="space-y-6">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Catalogue</div>
                <div className="space-y-1">
                  <NavLink 
                    to="/admin/dashboard" 
                    className={({isActive}) => linkClasses(isActive)} 
                    end
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Tableau de bord</span>
                  </NavLink>
                  
                  <div className="pt-2">
                    <NavLink 
                      to="/admin/products" 
                      className={({isActive}) => linkClasses(isActive)} 
                      end
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Produits</span>
                    </NavLink>
                  </div>
                  
                  <div className="pt-2">
                    <NavLink 
                      to="/admin/categories" 
                      className={({isActive}) => linkClasses(isActive)} 
                      end
                    >
                      <FolderTree className="h-5 w-5" />
                      <span>Catégories</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Artisans</div>
                <div className="space-y-1">
                  <NavLink 
                    to="/admin/artisans" 
                    className={({isActive}) => linkClasses(isActive)} 
                    end
                  >
                    <Users className="h-5 w-5" />
                    <span>Artisans</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Desktop sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 hidden w-64 bg-white shadow-lg transition-transform duration-300 lg:block ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-terracotta-600 text-white rounded flex items-center justify-center">
                <BuildingStorefront className="h-5 w-5" />
              </div>
              <div className="font-semibold">Admin Dashboard</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-6">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Catalogue</div>
                <div className="space-y-1">
                  <NavLink 
                    to="/admin/dashboard" 
                    className={({isActive}) => linkClasses(isActive)} 
                    end
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Tableau de bord</span>
                  </NavLink>
                  
                  <div className="pt-2">
                    <NavLink 
                      to="/admin/products" 
                      className={({isActive}) => linkClasses(isActive)} 
                      end
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Produits</span>
                    </NavLink>
                  </div>
                  
                  <div className="pt-2">
                    <NavLink 
                      to="/admin/categories" 
                      className={({isActive}) => linkClasses(isActive)} 
                      end
                    >
                      <FolderTree className="h-5 w-5" />
                      <span>Catégories</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Artisans</div>
                <div className="space-y-1">
                  <NavLink 
                    to="/admin/artisans" 
                    className={({isActive}) => linkClasses(isActive)} 
                    end
                  >
                    <Users className="h-5 w-5" />
                    <span>Artisans</span>
                  </NavLink>
                </div>
              </div>
              
              
            </nav>
          </div>
          
          <div className="border-t p-4">
            
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
