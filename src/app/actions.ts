'use server';

import { fairSplitSuggestion } from '@/ai/flows/ai-fair-split-suggestion';

export async function getFairSplitSuggestion(tipAmount: number, numPeople: number) {
  if (numPeople <= 1) {
    return { suggestion: "Splitting is only needed for more than one person." };
  }
  if (tipAmount <= 0) {
    return { suggestion: "No tip to split." };
  }

  const tipInCents = Math.round(tipAmount * 100);
  if (tipInCents % numPeople === 0) {
    return { suggestion: "The tip amount divides evenly, no special suggestion needed." };
  }

  try {
    const result = await fairSplitSuggestion({ tipAmount, numPeople });
    return result;
  } catch (error) {
    console.error("Error getting fair split suggestion:", error);
    return { suggestion: "Sorry, I couldn't come up with a suggestion right now. Please try again." };
  }
}
