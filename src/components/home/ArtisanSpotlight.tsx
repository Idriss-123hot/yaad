
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SAMPLE_ARTISANS } from '@/models/types';

export function ArtisanSpotlight() {
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
              Meet the Makers
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Featured Artisans</h2>
          </div>
          <Button variant="link" className="text-terracotta-600 hover:text-terracotta-700 p-0 hidden md:flex">
            View All Artisans <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SAMPLE_ARTISANS.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} className="hover-lift" />
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="border-terracotta-200 hover:bg-terracotta-50">
            View All Artisans <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ArtisanSpotlight;
