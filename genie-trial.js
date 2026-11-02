// Genie – sistem probnog perioda
// Verzija 1.0
// Probni period: 60 dana

export const GENIE_TRIAL_DAYS = 60;

export function getTrialEndDate(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + GENIE_TRIAL_DAYS);
  return endDate;
}

export function isTrialActive(startDate, currentDate = new Date()) {
  if (!startDate) return false;

  const endDate = getTrialEndDate(startDate);

  return currentDate < endDate;
}
