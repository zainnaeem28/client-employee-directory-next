import React from 'react';
import { motion } from 'framer-motion';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}) => {
  // Conditionally set text color: gray-400 for placeholder, gray-900 for selected
  const isPlaceholder = !props.value;
  const baseClasses = 'block w-full px-3 py-3 space-y-2 border border-gray-300 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
  const textColor = isPlaceholder ? 'text-gray-400' : 'text-gray-900';
  const classes = `${baseClasses} ${errorClasses} ${textColor} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.select
        className={classes}
        whileFocus={{ scale: 1.01 }}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        name={props.name}
        id={props.id}
        disabled={props.disabled}
        required={props.required}
      >
        {/* Placeholder option: disabled and hidden when a value is selected */}
        <option value="" disabled hidden>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      <div className="space-y-2"></div>
    </div>
  );
};

export default Select; 