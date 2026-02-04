import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Instagram } from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const handleLogoClick = (e) => {
    if (location.pathname === '/' && location.hash) {
      // If we're on homepage with a hash, prevent default Link behavior
      e.preventDefault();
      // Clear the hash and scroll to top
      window.history.pushState('', document.title, window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (href, e) => {
    if (href === '/' && location.pathname === '/' && location.hash) {
      e.preventDefault();
      window.history.pushState('', document.title, window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      if (location.pathname === '/') {
        e.preventDefault();
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const socialLinks = [
    { 
      href: 'https://www.instagram.com/pulgaxstore/', 
      icon: Instagram, 
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    { 
      href: 'https://www.tiktok.com/@pulgaxstore', 
      icon: TikTokIcon, 
      label: 'TikTok',
      color: 'hover:text-slate-900 dark:hover:text-white'
    }
  ];

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/#about', label: t('nav.about') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" onClick={handleLogoClick}>
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Pulgax 3D Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-xl">
                Pulgax <span className="text-blue-400">3D</span> Store
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('about.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-slate-300">
              Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-slate-300">
              {t('footer.followUs')}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 transition-colors ${social.color}`}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Pulgax 3D Store. {t('footer.rights')}.
          </p>
          <Link
            to="/admin"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};
