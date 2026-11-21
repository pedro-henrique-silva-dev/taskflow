import Loader from './Loader.jsx';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader size="sm" />}
      {children}
    </button>
  );
}

export default Button;
