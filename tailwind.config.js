/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      // This configuration adds the monday.com colors to the Tailwind CSS palette
      colors: {
        // Semantic colors
        'primary-color': 'var(--primary-color)',
        'primary-hover-color': 'var(--primary-hover-color)',
        'primary-selected-color': 'var(--primary-selected-color)',
        'primary-selected-hover-color': 'var(--primary-selected-hover-color)',
        'primary-highlighted-color': 'var(--primary-highlighted-color)',
        'positive-color': 'var(--positive-color)',
        'positive-color-hover': 'var(--positive-color-hover)',
        'positive-color-selected': 'var(--positive-color-selected)',
        'positive-color-selected-hover': 'var(--positive-color-selected-hover)',
        'negative-color': 'var(--negative-color)',
        'negative-color-hover': 'var(--negative-color-hover)',
        'negative-color-selected': 'var(--negative-color-selected)',
        'negative-color-selected-hover': 'var(--negative-color-selected-hover)',
        'warning-color': 'var(--warning-color)',
        'warning-color-hover': 'var(--warning-color-hover)',
        'warning-color-selected': 'var(--warning-color-selected)',
        'warning-color-selected-hover': 'var(--warning-color-selected-hover)',
        'private-color': 'var(--private-color)',
        'shareable-color': 'var(--shareable-color)',
        'inverted-color-background': 'var(--inverted-color-background)',
        'icon-color': 'var(--icon-color)',
        'fixed-light-color': 'var(--fixed-light-color)',
        'fixed-dark-color': 'var(--fixed-dark-color)',

        // Background colors
        'primary-background-color': 'var(--primary-background-color)',
        'secondary-background-color': 'var(--secondary-background-color)',
        'primary-background-hover-color': 'var(--primary-background-hover-color)',
        'inverted-color-background': 'var(--inverted-color-background)',
        'grey-background-color': 'var(--grey-background-color)',
        'allgrey-background-color': 'var(--allgrey-background-color)',
        'ui-background-color': 'var(--ui-background-color)',

        // Text colors
        'primary-text-color': 'var(--primary-text-color)',
        'secondary-text-color': 'var(--secondary-text-color)',
        'secondary-text-on-secondary-color': 'var(--secondary-text-on-secondary-color)',
        'text-color-on-inverted': 'var(--text-color-on-inverted)',
        'text-color-on-primary': 'var(--text-color-on-primary)',
        'disabled-text-color': 'var(--disabled-text-color)',
        'placeholder-color': 'var(--placeholder-color)',
        'link-color': 'var(--link-color)',

        // Border colors
        'ui-border-color': 'var(--ui-border-color)',
        'layout-border-color': 'var(--layout-border-color)',
      },
    },
  },
  plugins: [],
};
