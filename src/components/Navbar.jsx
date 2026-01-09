import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import FeatureMenu from './FeatureMenu';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedTitle from './AnimatedTitle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <AnimatedTitle name="KisanPulse" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <FeatureMenu />
            <LanguageSwitcher />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-lg">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <FeatureMenu />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
