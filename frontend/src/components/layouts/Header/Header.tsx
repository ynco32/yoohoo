'use client';
import { useState } from 'react';
import { BackButton } from './BackButton';
import { MenuToggleButton } from './MenuToggleButton';
import { NavigationMenu } from './NavigationMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-header mx-auto w-full max-w-[430px]">
      <header className="h-[56px]">
        <div className="flex h-full items-center justify-between px-md">
          <BackButton onClick={handleBack} />
          <MenuToggleButton onClick={openMenu} />
        </div>
      </header>

      <NavigationMenu
        isMenuOpen={isMenuOpen}
        onItemClick={() => {
          setIsMenuOpen(false);
        }}
      />
    </div>
  );
};

export default Header;