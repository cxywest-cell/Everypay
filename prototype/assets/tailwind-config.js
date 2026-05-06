/**
 * Everypay Prototype — Shared Tailwind Config
 * Load this right after the Tailwind CDN <script> tag, before </head>.
 * Replaces the duplicated inline config blocks across all pages.
 */

tailwind.config = {
    theme: {
        extend: {
            colors: {
                everypay: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
                cregis: { gold: '#D4AF37', dark: '#1a1a1a' }
            }
        }
    }
};
