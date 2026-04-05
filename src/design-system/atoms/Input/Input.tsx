/**
 * Atom Component - Input
 * Reusable input component with validation states
 */

import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const wrapperClassNames = [
      'ds-input-wrapper',
      fullWidth && 'ds-input-wrapper--full-width',
      disabled && 'ds-input-wrapper--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClassNames = [
      'ds-input',
      hasError && 'ds-input--error',
      leftIcon && 'ds-input--with-left-icon',
      rightIcon && 'ds-input--with-right-icon',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassNames}>
        {label && (
          <label htmlFor={inputId} className="ds-input-label">
            {label}
          </label>
        )}
        <div className="ds-input-container">
          {leftIcon && <span className="ds-input-icon ds-input-icon--left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClassNames}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && <span className="ds-input-icon ds-input-icon--right">{rightIcon}</span>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="ds-input-error">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className="ds-input-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

