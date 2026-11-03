
// Genie – sistem probnog perioda
// Verzija 1.1
// Probni period: tačno 60 dana

export const GENIE_TRIAL_DAYS = 60;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTrialEndDate(startDate) {
  const start = new Date(startDate);

  if (Number.isNaN(start.getTime())) {
    throw new Error("Neispravan datum početka probnog perioda.");
  }

  return new Date(
    start.getTime() + GENIE_TRIAL_DAYS * DAY_IN_MS
  );
}

export function isTrialActive(startDate, currentDate = new Date()) {
  if (!startDate) return false;

  const endDate = getTrialEndDate(startDate);
  const now = new Date(currentDate);

  if (Number.isNaN(now.getTime())) {
    return false;
  }

  return now < endDate;
}
