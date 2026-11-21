import { useTheme } from '../../hooks/useTheme.js';
import Icon from './Icon.jsx';

function ThemeToggle({ showLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

  return (
    <button
      type="button"
      className={`theme-toggle${showLabel ? ' theme-toggle--full' : ''}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={18} />
      {showLabel && <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>}
    </button>
  );
}

export default ThemeToggle;
