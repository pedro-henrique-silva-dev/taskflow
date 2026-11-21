import { useState } from 'react';
import { Outlet } from 'react-router';
import Icon from '../ui/Icon.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import Sidebar from './Sidebar.jsx';

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
      {isMenuOpen && <div className="sidebar-backdrop" onClick={closeMenu} aria-hidden="true" />}

      <div className="app-layout__content">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Icon name="menu" />
          </button>
          <span className="brand-logo" aria-hidden="true">
            <Icon name="check" size={16} />
          </span>
          <span className="brand-name">TaskFlow</span>
          <span className="topbar__spacer" />
          <ThemeToggle />
        </header>
        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
