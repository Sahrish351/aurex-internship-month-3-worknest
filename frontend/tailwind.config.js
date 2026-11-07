/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FAF9F6',
          white: '#FFFFFF',
          forest: '#173D32',
          primary: '#286B52',
          sage: '#E7EFE9',
          muted: '#747C77',
          border: '#E9EAE5',
          peach: '#E9A58C',
          hoverGreen: '#1E533F',
          darkGreen: '#122E26',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 61, 50, 0.05), 0 1px 2px 0 rgba(23, 61, 50, 0.03)',
        'card': '0 4px 6px -1px rgba(23, 61, 50, 0.05), 0 2px 4px -1px rgba(23, 61, 50, 0.03)',
        'elevated': '0 10px 15px -3px rgba(23, 61, 50, 0.08), 0 4px 6px -2px rgba(23, 61, 50, 0.04)',
      }
    },
  },
  plugins: [],
}
