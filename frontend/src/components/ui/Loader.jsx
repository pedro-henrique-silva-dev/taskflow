function Loader({ size = 'md', label }) {
  return (
    <span className={`loader loader--${size}`} role={label ? 'status' : undefined}>
      <span className="loader__spinner" aria-hidden="true" />
      {label && <span className="loader__label">{label}</span>}
    </span>
  );
}

export default Loader;
