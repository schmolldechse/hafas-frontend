import type {Config} from "tailwindcss";

export default {
    darkMode: "media",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'text': 'var(--text)',
                'background': 'var(--background)',
                'primary': 'var(--primary)',
                'secondary': 'var(--secondary)',
                'accent': 'var(--accent)',
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
