
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 * Interface pour les props du composant de pagination
 */
interface DataTablePaginationProps {
  currentPage: number;  // Page actuelle
  totalPages: number;   // Nombre total de pages
  onPageChange: (page: number) => void;  // Fonction appelée lors du changement de page
  onNextPage: () => void;  // Fonction pour aller à la page suivante
  onPrevPage: () => void;  // Fonction pour aller à la page précédente
  itemsPerPage: number;  // Nombre d'éléments par page
  onItemsPerPageChange: (value: number) => void;  // Fonction pour changer le nombre d'éléments par page
  totalItems: number;  // Nombre total d'éléments
}

/**
 * Composant de pagination pour les tableaux de données
 * 
 * Permet de naviguer entre les différentes pages d'un tableau
 * et de choisir le nombre d'éléments à afficher par page.
 */
export function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: DataTablePaginationProps) {
  // Calculer la plage d'éléments affichés
  const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Affichage des informations sur les éléments montrés */}
      <div className="flex-1 text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <p>
            Affichage de {startItem} à {endItem} sur {totalItems} élément{totalItems !== 1 ? "s" : ""}
          </p>
        ) : (
          <p>Aucun élément</p>
        )}
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Sélecteur du nombre d'éléments par page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Éléments par page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Contrôles de navigation entre les pages */}
        <div className="flex items-center space-x-2">
          {/* Bouton pour aller à la première page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <span className="sr-only">Première page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Bouton pour aller à la page précédente */}
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <span className="sr-only">Page précédente</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Affichage du numéro de page actuelle */}
          <div className="flex items-center gap-1 text-sm font-medium">
            Page {currentPage} sur {totalPages}
          </div>

          {/* Bouton pour aller à la page suivante */}
          <Button
            variant="outline"
            size="icon"
            onClick={onNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8"
          >
            <span className="sr-only">Page suivante</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Bouton pour aller à la dernière page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8"
          >
            <span className="sr-only">Dernière page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
