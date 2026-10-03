const COUNTRY_DAILY_BUDGETS = [
  { pattern: /\b(vietnam|cambodia|laos|nepal|india)\b/i, range: [35, 75] },
  { pattern: /\b(thailand|indonesia|philippines|malaysia|sri lanka)\b/i, range: [45, 95] },
  { pattern: /\b(portugal|greece|turkey|mexico|brazil|poland)\b/i, range: [65, 135] },
  { pattern: /\b(japan|south korea|korea|spain|italy|france|germany)\b/i, range: [90, 180] },
  { pattern: /\b(united states|u\.s\.a?\.?|canada|australia|new zealand|singapore)\b/i, range: [120, 240] },
  { pattern: /\b(switzerland|norway|iceland|denmark|sweden)\b/i, range: [160, 320] },
];

export function estimateDailyTravelBudget(place) {
  const placeText = `${place.title || ''} ${place.desc || ''}`;
  const countryBudget = COUNTRY_DAILY_BUDGETS.find(({ pattern }) =>
    pattern.test(placeText),
  );
  const [minimum, maximum] = countryBudget?.range || [70, 160];

  return `$${minimum}–$${maximum} USD / person / day`;
}
