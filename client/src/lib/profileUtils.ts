import type { User } from "@shared/schema";

export function isProfileComplete(user: User | null): boolean {
  if (!user) return false;
  
  // Required fields for a complete profile
  return !!(
    user.firstName?.trim() &&
    user.lastName?.trim() &&
    user.age &&
    user.gender &&
    user.city?.trim() &&
    user.state?.trim() &&
    user.country?.trim()
  );
}

export function getIncompleteFields(user: User | null): string[] {
  if (!user) return ["All profile information"];
  
  const missingFields: string[] = [];
  
  if (!user.firstName?.trim()) missingFields.push("First Name");
  if (!user.lastName?.trim()) missingFields.push("Last Name");
  if (!user.age) missingFields.push("Age");
  if (!user.gender) missingFields.push("Gender");
  if (!user.city?.trim()) missingFields.push("City");
  if (!user.state?.trim()) missingFields.push("State");
  if (!user.country?.trim()) missingFields.push("Country");
  
  return missingFields;
}