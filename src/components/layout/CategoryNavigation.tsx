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

  // ... (les fonctions handleNavigateTo... restent inchangées)

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {categoriesData.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger
              onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
              className={cn(
                navigationMenuTriggerStyle(),
                // MODIFICATION 1: Pour le texte du bouton "Nos produits" (ou nom de catégorie)
                // Assurez-vous que ces couleurs contrastent bien avec le fond de votre header
                "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 data-[active]:bg-gray-100 data-[state=open]:bg-gray-100"
                // Alternative si le fond du header est `bg-background` et que vous voulez utiliser les couleurs sémantiques de shadcn:
                // "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent data-[active]:bg-accent data-[state=open]:bg-accent"
              )}
            >
              {category.name} <ChevronDown className="ml-1 h-3 w-3" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:grid-cols-2"> {/* Le fond ici est probablement blanc (bg-popover) */}
                <li className="col-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to={`/search?category=${category.id}`}
                      className="flex items-center select-none space-y-1 rounded-md bg-terracotta-50 p-3 leading-none no-underline outline-none transition-colors hover:bg-terracotta-100 hover:text-terracotta-900 focus:bg-terracotta-100 focus:text-terracotta-900"
                      onClick={onClose}
                    >
                      {/* MODIFICATION 2: Pour le texte "Tous les {category.name}" */}
                      <div className="text-sm font-medium leading-none text-terracotta-800"> {/* ou text-gray-800 par exemple */}
                        Tous les {category.name}
                      </div>
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
                        {/* MODIFICATION 3: Pour le texte des sous-catégories */}
                        <div className="text-sm font-medium leading-none text-popover-foreground"> {/* ou text-gray-800 par exemple */}
                          {subcategory.name}
                        </div>
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
