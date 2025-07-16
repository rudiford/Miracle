import type { User } from "@shared/schema";

export function isProfileComplete(user: User | null, language?: string): boolean {
  if (!user) return false;
  
  // Required fields for a complete profile
  const baseRequirements = !!(
    user.firstName?.trim() &&
    user.lastName?.trim() &&
    user.age &&
    user.gender &&
    user.country?.trim()
  );
  
  // For English speakers, city and state are required (US-focused)
  // For Spanish speakers, city and state are optional (international)
  if (language === 'es') {
    return baseRequirements;
  } else {
    return baseRequirements && !!(
      user.city?.trim() &&
      user.state?.trim()
    );
  }
}

export function getIncompleteFields(user: User | null, language?: string): string[] {
  if (!user) return ["All profile information"];
  
  const missingFields: string[] = [];
  
  if (!user.firstName?.trim()) missingFields.push("First Name");
  if (!user.lastName?.trim()) missingFields.push("Last Name");
  if (!user.age) missingFields.push("Age");
  if (!user.gender) missingFields.push("Gender");
  if (!user.country?.trim()) missingFields.push("Country");
  
  // Only require city and state for English speakers (US-focused)
  if (language !== 'es') {
    if (!user.city?.trim()) missingFields.push("City");
    if (!user.state?.trim()) missingFields.push("State");
  }
  
  return missingFields;
}