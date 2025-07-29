let currentStep = 1;
    const totalSteps = 5;

    
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

    function updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const stepIndicator = document.getElementById('stepIndicator');
        
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressBar.style.width = progressPercentage + '%';
        stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
    }

    function showStep(stepNumber) {
        
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        
        document.getElementById(`step${stepNumber}`).classList.add('active');
        
        // Update buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (stepNumber === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }
        
        if (stepNumber === totalSteps) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
            nextBtn.textContent = stepNumber === totalSteps - 1 ? 'Get Quote' : 'Next';
        }
        
        updateProgress();
    }

    function validateStep(stepNumber) {
        let isValid = true;
        
        switch(stepNumber) {
            case 1:
                const make = document.getElementById('make').value;
                const model = document.getElementById('model').value;
                const year = document.getElementById('year').value;
                const engineSize = document.getElementById('engineSize').value;
                
                if (!make || !model || !year || !engineSize) {
                    isValid = false;
                }
                break;
                
            case 2:
                const fullName = document.getElementById('fullName').value;
                const age = document.getElementById('age').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                
                if (!fullName || !age || !email || !phone) {
                    isValid = false;
                }
                break;
                
            case 3:
                const experience = document.querySelector('input[name="experience"]:checked');
                const accidents = document.querySelector('input[name="accidents"]:checked');
                
                if (!experience || !accidents) {
                    isValid = false;
                }
                break;
                
            case 4:
                const coverage = document.querySelector('input[name="coverage"]:checked');
                const excess = document.getElementById('excess').value;
                
                if (!coverage || !excess) {
                    isValid = false;
                }
                break;
        }
        
        return isValid;
    }

    function calculateQuote() {
        // base premium calculation
        let basePremium = 2000;
        
        // 
        const year = parseInt(document.getElementById('year').value);
        const currentYear = new Date().getFullYear();
        const vehicleAge = currentYear - year;
        
        if (vehicleAge < 3) basePremium *= 1.5;
        else if (vehicleAge < 7) basePremium *= 1.2;
        
        const engineSize = parseInt(document.getElementById('engineSize').value);
        if (engineSize > 2000) basePremium *= 1.3;
        else if (engineSize > 1600) basePremium *= 1.1;
        
        // age of applicant 
        const age = parseInt(document.getElementById('age').value);
        if (age < 25) basePremium *= 1.8;
        else if (age < 35) basePremium *= 1.2;
        else if (age > 65) basePremium *= 1.3;
        
        // experience of the driver
        const experience = document.querySelector('input[name="experience"]:checked').value;
        if (experience === '0-2') basePremium *= 1.5;
        else if (experience === '3-5') basePremium *= 1.2;
        
        // accidents history
        const accidents = document.querySelector('input[name="accidents"]:checked').value;
        if (accidents === '1') basePremium *= 1.3;
        else if (accidents === '2+') basePremium *= 1.8;
        
        // type of coverage
        const coverage = document.querySelector('input[name="coverage"]:checked').value;
        if (coverage === 'comprehensive') basePremium *= 1.5;
        else if (coverage === 'standard') basePremium *= 1.2;
        
        
        const excess = parseInt(document.getElementById('excess').value);
        if (excess === 500) basePremium *= 1.2;
        else if (excess === 1000) basePremium *= 1.1;
        else if (excess === 2000) basePremium *= 0.95;
        else if (excess === 5000) basePremium *= 0.85;
        
        return Math.round(basePremium);
    }

    function displayQuote() {
        const quote = calculateQuote();
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const coverage = document.querySelector('input[name="coverage"]:checked').value;
        const excess = document.getElementById('excess').value;
        
        document.getElementById('quoteAmount').textContent = `K${quote.toLocaleString()}`;
        document.getElementById('vehicleDetails').textContent = `${year} ${make} ${model}`;
        document.getElementById('coverageDetails').textContent = coverage.charAt(0).toUpperCase() + coverage.slice(1);
        document.getElementById('excessDetails').textContent = `K${excess}`;
        
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        document.getElementById('validUntil').textContent = validUntil.toLocaleDateString();
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                if (currentStep === 5) {
                    displayQuote();
                }
                showStep(currentStep);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    }

    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function proceedToPayment() {
        alert('Redirecting to payment gateway...\n\nThank you for choosing Hobbiton Insurance!');
    }

   
    initYearDropdown();
    updateProgress();