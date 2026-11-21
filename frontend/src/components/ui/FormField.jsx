function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="form-field__error" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="form-field__hint">{hint}</p>
      )}
    </div>
  );
}

export default FormField;
