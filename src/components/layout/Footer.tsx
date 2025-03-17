
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-cream-100 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight inline-block mb-4">
              artisan<span className="text-terracotta-600">link</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting artisans with conscious consumers, celebrating craftsmanship and sustainable values.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-terracotta-100">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-terracotta-100">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-terracotta-100">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/artisans" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Artisans
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="md:col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-terracotta-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our newsletter to receive updates on new artisans, special offers and upcoming events.
            </p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-r-none focus:ring-1 focus:ring-terracotta-300 border-r-0"
              />
              <Button className="bg-terracotta-600 hover:bg-terracotta-700 rounded-l-none text-white">
                <Mail className="h-4 w-4 mr-2" />
                <span>Join</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} artisanlink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
