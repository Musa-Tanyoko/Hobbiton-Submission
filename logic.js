let currentStep = 1;
const totalSteps = 6;
let formData = {};
let lastActivityTime = Date.now();

// Initialize year dropdown
function initYearDropdown() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Load saved form data
function loadSavedData() {
    const savedData = localStorage.getItem('insuranceQuote');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.version === FORM_VERSION) {
            formData = parsedData.data;
            Object.keys(formData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'radio' || element.type === 'checkbox') {
                        const target = document.querySelector(`input[name="${key}"][value="${formData[key]}"]`);
                        if (target) target.checked = true;
                    } else {
                        element.value = formData[key];
                    }
                }
            });
            updateSummary();
            trackEvent('form_loaded', { version: FORM_VERSION });
        } else {
            console.warn('Saved data version mismatch. Clearing old data.');
            localStorage.removeItem('insuranceQuote');
        }
    }
}

// Save form data
function saveFormData() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'radio' && !input.checked) return;
        if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else if (input.value) {
            formData[input.id] = sanitizeInput(input.value);
        }
    });
    localStorage.setItem('insuranceQuote', JSON.stringify({ version: FORM_VERSION, data: formData }));
    updateSummary();
    updateQuotePreview();
    trackEvent('form_saved', { step: currentStep });
}

// Update summary panel
function updateSummary() {
    const summaryPanel = document.getElementById('summaryPanel');
    const summaries = document.getElementById('summaries');
    summaries.innerHTML = '';
    summaryPanel.style.display = currentStep > 1 ? 'block' : 'none';

    const summaryItems = [
        { label: 'Vehicle', value: `${formData.year || ''} ${formData.make || ''} ${formData.model || ''}`, step: 1 },
        { label: 'Driver', value: formData.fullName || '', step: 2 },
        { label: 'Coverage', value: formData.coverage ? formData.coverage.charAt(0).toUpperCase() + formData.coverage.slice(1) : '', step: 5 },
        { label: 'Excess', value: formData.excess ? `K${formData.excess}` : '', step: 5 },
        { label: 'Estimated Quote', value: calculateQuote(formData) ? `K${calculateQuote(formData).toLocaleString()}` : 'Not available', step: 5 }
    ];

    summaryItems.forEach(item => {
        if (item.value.trim()) {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
            if (item.step < currentStep) {
                div.style.cursor = 'pointer';
                div.onclick = () => {
                    currentStep = item.step;
                    showStep(currentStep);
                    trackEvent('summary_jump', { step: item.step });
                };
            }
            summaries.appendChild(div);
        }
    });
}

// Update progress bar
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const stepIndicator = document.getElementById('stepIndicator');
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
}

// Show specific step
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.style.display = stepNumber === 1 ? 'none' : 'block';
    nextBtn.style.display = stepNumber === totalSteps ? 'none' : 'block';
    nextBtn.textContent = stepNumber === totalSteps - 1 ? 'Get Quote' : 'Next';

    updateProgress();
    updateSummary();
    if (stepNumber === 5) {
        renderCoverageChart();
    }
    trackEvent('step_viewed', { step: stepNumber });
}

// Setup validation
function setupValidation() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            validateField(input);
            saveFormData();
        }, 300));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && currentStep < totalSteps) {
                nextStep();
            }
        });
    });

    document.getElementById('make').addEventListener('change', updateModelSuggestions);
}

// Validate entire step
function validateStep(stepNumber) {
    let isValid = true;
    const fields = {
        1: ['make', 'model', 'year', 'engineSize'],
        2: ['fullName', 'age', 'email', 'phone'],
        3: ['experience', 'accidents'],
        4: ['usage'],
        5: ['coverage', 'excess']
    };

    if (fields[stepNumber]) {
        fields[stepNumber].forEach(field => {
            const input = document.querySelector(`#${field}, input[name="${field}"]:checked`);
            if (!input || !input.value || (input.type === 'radio' && !document.querySelector(`input[name="${field}"]:checked`))) {
                isValid = false;
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.style.display = 'block';
                    errorElement.textContent = `Please select a valid ${field}`;
                }
            } else if (input.type !== 'radio' && !validateField(input)) {
                isValid = false;
            }
        });
    }

    return isValid;
}

// Display quote
function displayQuote() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    setTimeout(() => {
        const quote = calculateQuote(formData);
        document.getElementById('quoteAmount').textContent = `K${quote.toLocaleString()}`;
        document.getElementById('vehicleDetails').textContent = `${formData.year} ${formData.make} ${formData.model}`;
        document.getElementById('coverageDetails').textContent = formData.coverage ? formData.coverage.charAt(0).toUpperCase() + formData.coverage.slice(1) : '';
        document.getElementById('excessDetails').textContent = `K${formData.excess}`;
        
        const validUntil = new Date('2025-07-17T11:25:00+02:00'); // Using provided date and time (CAT)
        validUntil.setDate(validUntil.getDate() + 30);
        document.getElementById('validUntil').textContent = validUntil.toLocaleDateString();

        const discounts = [];
        if (formData.alarm) discounts.push('Alarm System (5%)');
        if (formData.immobilizer) discounts.push('Immobilizer (5%)');
        if (formData.tracker) discounts.push('GPS Tracker (10%)');
        if (localStorage.getItem('lastQuoteTime')) discounts.push('Loyalty (10%)');
        document.getElementById('discountDetails').textContent = discounts.length ? discounts.join(', ') : 'None';

        loadingOverlay.style.display = 'none';
        showPremiumBreakdown();
        trackEvent('quote_displayed', { amount: quote });
    }, 1000);
}

// Premium breakdown modal
function showPremiumBreakdown() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Premium Breakdown</h2>
            <div>
                <p><strong>Base Premium:</strong> K2,000</p>
                <p><strong>Vehicle Age Factor:</strong> x${formData.year ? (new Date().getFullYear() - parseInt(formData.year) < 3 ? 1.5 : 1.2) : 1}</p>
                <p><strong>Engine Size Factor:</strong> x${formData.engineSize ? (parseInt(formData.engineSize) > 2000 ? 1.3 : parseInt(formData.engineSize) > 1600 ? 1.1 : 1) : 1}</p>
                <p><strong>Age Factor:</strong> x${formData.age ? (parseInt(formData.age) < 25 ? 1.8 : parseInt(formData.age) < 35 ? 1.2 : parseInt(formData.age) > 65 ? 1.3 : 1) : 1}</p>
                <p><strong>Experience Factor:</strong> x${formData.experience ? (formData.experience === '0-2' ? 1.5 : formData.experience === '3-5' ? 1.2 : 1) : 1}</p>
                <p><strong>Accidents Factor:</strong> x${formData.accidents ? (formData.accidents === '1' ? 1.3 : formData.accidents === '2+' ? 1.8 : 1) : 1}</p>
                <p><strong>Coverage Factor:</strong> x${formData.coverage ? (formData.coverage === 'comprehensive' ? 1.5 : formData.coverage === 'standard' ? 1.2 : 1) : 1}</p>
                <p><strong>Excess Factor:</strong> x${formData.excess ? (parseInt(formData.excess) === 500 ? 1.2 : parseInt(formData.excess) === 1000 ? 1.1 : parseInt(formData.excess) === 2000 ? 0.95 : 0.85) : 1}</p>
                <p><strong>Usage Factor:</strong> x${formData.usage ? (formData.usage === 'commercial' ? 1.3 : formData.usage === 'mixed' ? 1.15 : 1) : 1}</p>
                <p><strong>Total Discounts:</strong> ${((formData.alarm ? 0.05 : 0) + (formData.immobilizer ? 0.05 : 0) + (formData.tracker ? 0.1 : 0) + (localStorage.getItem('lastQuoteTime') ? 0.1 : 0)) * 100}%</p>
            </div>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    trackEvent('breakdown_viewed', {});
}

// Render coverage comparison chart
function renderCoverageChart() {
    ```chartjs
    {
        "type": "bar",
        "data": {
            "labels": ["Basic", "Standard", "Comprehensive"],
            "datasets": [{
                "label": "Coverage Level",
                "data": [50, 75, 100],
                "backgroundColor": ["#4CAF50", "#2196F3", "#FF9800"],
                "borderColor": ["#45a049", "#1976D2", "#F57C00"],
                "borderWidth": 1
            }]
        },
        "options": {
            "responsive": true,
            "maintainAspectRatio": false,
            "plugins": {
                "legend": {
                    "display": false
                },
                "title": {
                    "display": true,
                    "text": "Coverage Comparison",
                    "color": "#333"
                }
            },
            "scales": {
                "y": {
                    "beginAtZero": true,
                    "title": {
                        "display": true,
                        "text": "Protection Level (%)",
                        "color": "#333"
                    },
                    "ticks": {
                        "color": "#333"
                    }
                },
                "x": {
                    "ticks": {
                        "color": "#333"
                    }
                }
            }
        }
    }