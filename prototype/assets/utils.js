/**
 * Everypay Prototype — Shared Utilities
 * Common helper functions used across multiple pages.
 * Load this after Tailwind config, before page-specific scripts.
 */

(function() {
    // Make utilities available globally
    window.EP = window.EP || {};

    /**
     * Get Tailwind color class for a status string
     * @param {string} status - 'Paid', 'Received', 'Pending', 'Overdue', etc.
     * @returns {string} Tailwind text color class
     */
    EP.getStatusColor = function(status) {
        switch(status) {
            case 'Paid': return 'text-green-600';
            case 'Received': return 'text-green-600';
            case 'Pending': return 'text-yellow-600';
            case 'Overdue': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    /**
     * Format a number as currency string
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (default: 'USD')
     * @returns {string} Formatted currency string
     */
    EP.formatCurrency = function(amount, currency = 'USD') {
        const symbols = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', HKD: 'HK$' };
        const symbol = symbols[currency] || currency + ' ';
        return symbol + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    /**
     * Format a date string for display
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date string
     */
    EP.formatDate = function(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    /**
     * Safely query a DOM element
     * @param {string} selector - CSS selector
     * @returns {Element|null}
     */
    EP.$ = function(selector) {
        return document.querySelector(selector);
    };

    /**
     * Safely query all DOM elements
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
 EP.$$ = function(selector) {
        return document.querySelectorAll(selector);
    };

    /**
     * Show a toast notification
     * @param {string} message - Toast message
     * @param {string} type - 'success', 'error', 'info' (default: 'info')
     * @param {number} duration - Duration in ms (default: 3000)
     */
    EP.showToast = function(message, type = 'info', duration = 3000) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-everypay-600'
        };

        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-[100] ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0 opacity-100`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

})();
