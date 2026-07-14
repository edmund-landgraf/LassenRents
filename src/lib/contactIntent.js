export const CONTACT_INTENT_KEY = "lassenRents.contactIntent";

export const contactInterestOptions = [
  "Rent a container",
  "Move my container",
  "Buy a container",
  "Modify a container",
  "Accessories",
  "General question"
];

export function saveContactIntent(intent) {
  if (typeof window === "undefined" || !intent) return;
  window.sessionStorage.setItem(CONTACT_INTENT_KEY, intent);
}

export function readContactIntent() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(CONTACT_INTENT_KEY) || "";
}
