import { useState } from 'react';
import { CATEGORY_COLORS, CATEGORY_LIMITS } from '../../utils/constants.js';
import { hasErrors, validateCategory } from '../../utils/validation.js';
import Button from '../ui/Button.jsx';
import FormField from '../ui/FormField.jsx';

function CategoryForm({ category, categories, onSubmit, onCancel, idPrefix = 'category' }) {
  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateCategory({ name }, categories, category?.id ?? null);
    if (hasErrors(errors)) {
      setError(errors.name);
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await onSubmit({ name, color });
      if (saved && !category) {
        setName('');
        setColor(CATEGORY_COLORS[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameId = `${idPrefix}-name`;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField label="Nome *" htmlFor={nameId} error={error}>
        <input
          id={nameId}
          className="input"
          type="text"
          placeholder="Ex.: Trabalho"
          value={name}
          maxLength={CATEGORY_LIMITS.NAME_MAX}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${nameId}-error` : undefined}
        />
      </FormField>

      <fieldset className="color-picker">
        <legend className="form-field__label">Cor</legend>
        <div className="color-picker__options">
          {CATEGORY_COLORS.map((option) => (
            <label key={option} className="color-picker__option" style={{ '--swatch': option }}>
              <input
                type="radio"
                name={`${idPrefix}-color`}
                value={option}
                checked={color === option}
                onChange={() => setColor(option)}
              />
              <span className="color-picker__swatch" aria-hidden="true" />
              <span className="sr-only">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {category ? 'Salvar alterações' : 'Adicionar categoria'}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
