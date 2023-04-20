/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}"
	],
	darkMode: "class",
	theme: {
		extend: {			
			animation: {
				fadeIn: 'fadeIn 500ms var(--fade-delay)',
				slideLTR: 'slideLTR 250ms var(--slide-delay)'
			},

			keyframes: theme => ({
				fadeIn: {
					'0%': { transform: 'translate(0, 4px)', opacity: '0' },
					'100%': { transform: 'translate(0, 0)', opacity: '1' }
				},
				slideLTR: {
					'0%': { transform: 'translate(-4px, 0) scale(0.9)', opacity: '0' },
					'100%': { transform: 'translate(0, 0) scale(1)', opacity: '1' }
				}
			}),

			colors: {
				'neutral': {
					950: "#0e0e0e"
				},
				'zinc': {
					150: "#ececee"
				}
			},
		},
	},
	plugins: [],
}
