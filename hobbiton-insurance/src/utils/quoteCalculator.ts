import type { FormData } from '../types/index';

export const calculateQuote = (formData: FormData): number => {
  let basePremium = 500; // Base premium in Kwacha
  
  // Vehicle factors
  if (formData.year) {
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age <= 3) basePremium += 200;
    else if (age <= 7) basePremium += 100;
    else if (age <= 10) basePremium += 50;
    else basePremium -= 100; // Older cars get discount
  }
  
  // Mileage factor
  if (formData.mileage) {
    const mileage = parseInt(formData.mileage);
    if (mileage > 50000) basePremium += 150;
    else if (mileage > 30000) basePremium += 100;
    else if (mileage > 15000) basePremium += 50;
  }
  
  // Driver age factor
  if (formData.age) {
    const age = parseInt(formData.age);
    if (age < 25) basePremium += 300;
    else if (age < 30) basePremium += 200;
    else if (age < 50) basePremium += 50;
    else if (age > 65) basePremium += 150;
  }
  
  // License years factor
  if (formData.licenseYears) {
    const years = parseInt(formData.licenseYears);
    if (years < 2) basePremium += 250;
    else if (years < 5) basePremium += 150;
    else if (years >= 10) basePremium -= 100; // Discount for experienced drivers
  }
  
  // Claims history factor
  if (formData.claims) {
    const claims = parseInt(formData.claims);
    basePremium += claims * 200; // 200 Kwacha per claim
  }
  
  // Coverage type factor
  if (formData.coverage) {
    switch (formData.coverage) {
      case 'comprehensive':
        basePremium *= 1.5;
        break;
      case 'third-party':
        basePremium *= 0.7;
        break;
      case 'third-party-fire-theft':
        basePremium *= 0.9;
        break;
    }
  }
  
  // Excess factor
  if (formData.excess) {
    const excess = parseInt(formData.excess);
    if (excess >= 1000) basePremium -= 100;
    else if (excess >= 500) basePremium -= 50;
  }
  
  return Math.max(basePremium, 200); // Minimum premium of 200 Kwacha
};

export const getPremiumBreakdown = (formData: FormData) => {
  const breakdown = {
    basePremium: 500,
    vehicleFactor: 0,
    mileageFactor: 0,
    ageFactor: 0,
    experienceFactor: 0,
    claimsFactor: 0,
    coverageMultiplier: 1,
    excessDiscount: 0,
    total: 0
  };
  
  // Vehicle factors
  if (formData.year) {
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age <= 3) breakdown.vehicleFactor = 200;
    else if (age <= 7) breakdown.vehicleFactor = 100;
    else if (age <= 10) breakdown.vehicleFactor = 50;
    else breakdown.vehicleFactor = -100;
  }
  
  // Mileage factor
  if (formData.mileage) {
    const mileage = parseInt(formData.mileage);
    if (mileage > 50000) breakdown.mileageFactor = 150;
    else if (mileage > 30000) breakdown.mileageFactor = 100;
    else if (mileage > 15000) breakdown.mileageFactor = 50;
  }
  
  // Driver age factor
  if (formData.age) {
    const age = parseInt(formData.age);
    if (age < 25) breakdown.ageFactor = 300;
    else if (age < 30) breakdown.ageFactor = 200;
    else if (age < 50) breakdown.ageFactor = 50;
    else if (age > 65) breakdown.ageFactor = 150;
  }
  
  // License years factor
  if (formData.licenseYears) {
    const years = parseInt(formData.licenseYears);
    if (years < 2) breakdown.experienceFactor = 250;
    else if (years < 5) breakdown.experienceFactor = 150;
    else if (years >= 10) breakdown.experienceFactor = -100;
  }
  
  // Claims history factor
  if (formData.claims) {
    const claims = parseInt(formData.claims);
    breakdown.claimsFactor = claims * 200;
  }
  
  // Coverage type factor
  if (formData.coverage) {
    switch (formData.coverage) {
      case 'comprehensive':
        breakdown.coverageMultiplier = 1.5;
        break;
      case 'third-party':
        breakdown.coverageMultiplier = 0.7;
        break;
      case 'third-party-fire-theft':
        breakdown.coverageMultiplier = 0.9;
        break;
    }
  }
  
  // Excess factor
  if (formData.excess) {
    const excess = parseInt(formData.excess);
    if (excess >= 1000) breakdown.excessDiscount = -100;
    else if (excess >= 500) breakdown.excessDiscount = -50;
  }
  
  breakdown.total = Math.max(
    (breakdown.basePremium + breakdown.vehicleFactor + breakdown.mileageFactor + 
     breakdown.ageFactor + breakdown.experienceFactor + breakdown.claimsFactor + 
     breakdown.excessDiscount) * breakdown.coverageMultiplier, 
    200
  );
  
  return breakdown;
}; 