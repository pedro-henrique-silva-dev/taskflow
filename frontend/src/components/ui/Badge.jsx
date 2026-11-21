function Badge({ children, variant = 'neutral', color }) {
  const style = color ? { '--badge-color': color } : undefined;
  return (
    <span className={`badge badge--${color ? 'custom' : variant}`} style={style}>
      {children}
    </span>
  );
}

export default Badge;
