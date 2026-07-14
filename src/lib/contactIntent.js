export const CONTACT_INTENT_KEY = "lassenRents.contactIntent";

export const contactInterestOptions = ["Containers", "Accessories", "Modifications", "Delivery", "Trucking", "Gallery"];

export function saveContactIntent(intent) {
  if (typeof window === "undefined" || !intent) return;
  window.sessionStorage.setItem(CONTACT_INTENT_KEY, intent);
}

export function readContactIntent() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(CONTACT_INTENT_KEY) || "";
}
