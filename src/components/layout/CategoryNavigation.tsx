
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { categoriesData } from '@/data/categories';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface CategoryNavigationProps {
  onClose?: () => void;
}

export function CategoryNavigation({ onClose }: CategoryNavigationProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNavigateToCategory = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
    if (onClose) onClose();
  };

  const handleNavigateToSubcategory = (categoryId: string, subcategoryId: string) => {
    navigate(`/search?category=${categoryId}&subcategory=${subcategoryId}`);
    if (onClose) onClose();
  };

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {categoriesData.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger 
              onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-white/20 hover:text-white focus:bg-white/20 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
              )}
            >
              {category.name} <ChevronDown className="ml-1 h-3 w-3" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:grid-cols-2">
                <li className="col-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to={`/search?category=${category.id}`}
                      className="flex items-center select-none space-y-1 rounded-md bg-terracotta-50 p-3 leading-none no-underline outline-none transition-colors hover:bg-terracotta-100 hover:text-terracotta-900 focus:bg-terracotta-100 focus:text-terracotta-900"
                      onClick={onClose}
                    >
                      <div className="text-sm font-medium leading-none">Tous les {category.name}</div>
                      <div className="text-sm line-clamp-2 text-muted-foreground">
                        Découvrez notre collection complète
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/search?category=${category.id}&subcategory=${subcategory.id}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={onClose}
                      >
                        <div className="text-sm font-medium leading-none">{subcategory.name}</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default CategoryNavigation;
