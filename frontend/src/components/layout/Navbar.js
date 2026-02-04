import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { 
  Menu, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Globe
} from 'lucide-react';

export const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/#about', label: t('nav.about') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.substring(1);
    return location.pathname.startsWith(href);
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/' && location.hash) {
      // If we're on homepage with a hash, prevent default Link behavior
      e.preventDefault();
      // Clear the hash and scroll to top
      window.history.pushState('', document.title, window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // If we're on a different page, let the Link component handle navigation normally
  };

  const handleNavClick = (href) => {
    setIsOpen(false);
    
    if (href === '/') {
      // Handle home navigation
      if (location.pathname === '/' && location.hash) {
        // Clear hash and scroll to top
        window.history.pushState('', document.title, window.location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      if (location.pathname === '/') {
        // If we're already on the homepage, just scroll to the element
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // If we're on a different page, navigate to home first
        // The hash will be handled by the useEffect in HomePage
        window.location.href = href;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            data-testid="logo-link"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src="/logo.jpg" 
                alt="Pulgax 3D Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white hidden sm:block">
              Pulgax <span className="text-blue-600">3D</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => {
                  if (link.href === '/' && location.pathname === '/' && location.hash) {
                    e.preventDefault();
                  }
                  handleNavClick(link.href);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-9 w-9 text-slate-600 dark:text-slate-300"
              data-testid="language-toggle"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">{language === 'pt' ? 'EN' : 'PT'}</span>
            </Button>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              {language}
            </span>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-slate-600 dark:text-slate-300"
              data-testid="theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Cart */}
            <Link to="/cart" data-testid="cart-link">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-600 dark:text-slate-300 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="mobile-menu-toggle">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full pt-8">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={(e) => {
                          if (link.href === '/' && location.pathname === '/' && location.hash) {
                            e.preventDefault();
                          }
                          handleNavClick(link.href);
                        }}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {t('nav.admin')}
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
