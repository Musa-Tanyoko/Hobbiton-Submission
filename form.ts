// Utility Functions for Motor Insurance Quotation App

const FORM_VERSION = '1.0.0';
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

// Input sanitization
function sanitizeInput(input) {
    return input.replace(/[<>"'%;()&]/g, '');
}

// Error logging
function logError(message, error) {
    const log = { timestamp: new Date().toISOString(), message, error: error.message };
    const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    logs.push(log);
    localStorage.setItem('errorLogs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
    console.error(message, error);
}

// Analytics tracking
function trackEvent(eventName, data) {
    console.log('Analytics Event:', { eventName, ...data, timestamp: new Date().toISOString() });
    // Simulate sending to analytics server
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ eventName, data }) });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate field
function validateField(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    let isValid = true;
    let errorMessage = '';

    switch (input.id) {
        case 'model':
            isValid = /^[A-Za-z0-9\s-]+$/.test(input.value);
            errorMessage = 'Model can only contain letters, numbers, spaces, and hyphens';
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            errorMessage = 'Please enter a valid email (e.g., example@domain.com)';
            break;
        case 'phone':
            isValid = /^[0-9]{10}$/.test(input.value);
            errorMessage = 'Please enter a 10-digit phone number';
            break;
        case 'engineSize':
            isValid = input.value >= 500 && input.value <= 5000;
            errorMessage = 'Engine size must be between 500 and 5000 CC';
            break;
        case 'age':
            isValid = input.value >= 18 && input.value <= 100;
            errorMessage = 'Age must be between 18 and 100';
            break;
        default:
            isValid = input.checkValidity();
            errorMessage = `Please enter a valid ${input.name || input.id}`;
    }

    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? 'none' : 'block';
    input.classList.toggle('invalid', !isValid);
    return isValid;
}

// Calculate quote
function calculateQuote(formData) {
    try {
        let basePremium = 2000;

        // Vehicle factors
        const year = parseInt(formData.year || 0);
        const currentYear = new Date().getFullYear();
        const vehicleAge = currentYear - year;
        if (vehicleAge < 3) basePremium *= 1.5;
        else if (vehicleAge < 7) basePremium *= 1.2;

        const engineSize = parseInt(formData.engineSize || 0);
        if (engineSize > 2000) basePremium *= 1.3;
        else if (engineSize > 1600) basePremium *= 1.1;

        // Driver factors
        const age = parseInt(formData.age || 0);
        if (age < 25) basePremium *= 1.8;
        else if (age < 35) basePremium *= 1.2;
        else if (age > 65) basePremium *= 1.3;

        const experience = formData.experience;
        if (experience === '0-2') basePremium *= 1.5;
        else if (experience === '3-5') basePremium *= 1.2;

        const accidents = formData.accidents;
        if (accidents === '1') basePremium *= 1.3;
        else if (accidents === '2+') basePremium *= 1.8;

        // Coverage factors
        const coverage = formData.coverage;
        if (coverage === 'comprehensive') basePremium *= 1.5;
        else if (coverage === 'standard') basePremium *= 1.2;

        const excess = parseInt(formData.excess || 0);
        if (excess === 500) basePremium *= 1.2;
        else if (excess === 1000) basePremium *= 1.1;
        else if (excess === 2000) basePremium *= 0.95;
        else if (excess === 5000) basePremium *= 0.85;

        // Additional factors
        const usage = formData.usage;
        if (usage === 'commercial') basePremium *= 1.3;
        else if (usage === 'mixed') basePremium *= 1.15;

        // Security and loyalty discounts
        let discount = 0;
        if (formData.alarm) discount += 0.05;
        if (formData.immobilizer) discount += 0.05;
        if (formData.tracker) discount += 0.1;

        // Loyalty discount
        const lastQuoteTime = localStorage.getItem('lastQuoteTime');
        if (lastQuoteTime && (Date.now() - parseInt(lastQuoteTime)) < 365 * 24 * 60 * 60 * 1000) {
            discount += 0.1; // 10% loyalty discount
        }
        basePremium *= (1 - discount);

        return Math.round(basePremium);
    } catch (error) {
        logError('Quote calculation failed', error);
        return 0;
    }
}

// Update model suggestions
function updateModelSuggestions() {
    const make = document.getElementById('make').value;
    const modelInput = document.getElementById('model');
    const suggestions = {
        Toyota: ['Camry', 'Corolla', 'RAV4', 'Prius'],
        Honda: ['Civic', 'Accord', 'CR-V', 'Fit'],
        Ford: ['Focus', 'Mustang', 'F-150', 'Explorer'],
        Nissan: ['Altima', 'Sentra', 'Rogue', 'Leaf'],
        BMW: ['3 Series', '5 Series', 'X5', 'M3'],
        Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLC'],
        Audi: ['A3', 'A4', 'Q5', 'Q7']
    };
    modelInput.placeholder = make && suggestions[make] ? `e.g., ${suggestions[make][0]}` : 'e.g., Camry, Civic, Focus';
}