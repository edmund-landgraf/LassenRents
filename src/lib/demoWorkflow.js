import { demoWorkflow } from "@/data/siteData";

const quoteLeadStorageKey = "lassen.demo.quoteLeads";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

export function readQuoteLeads() {
  if (!canUseStorage()) return demoWorkflow.quoteLeads;

  try {
    const saved = JSON.parse(window.localStorage.getItem(quoteLeadStorageKey) || "[]");
    return [...saved, ...demoWorkflow.quoteLeads];
  } catch {
    return demoWorkflow.quoteLeads;
  }
}

export function saveQuoteLead(lead) {
  if (!canUseStorage()) return lead;

  const saved = readQuoteLeads().filter((item) => !demoWorkflow.quoteLeads.some((seed) => seed.id === item.id));
  const nextLead = {
    id: `Q-${Date.now().toString().slice(-8)}`,
    receivedAt: "Just now",
    status: "New",
    fit: "Needs review",
    ...lead
  };

  window.localStorage.setItem(quoteLeadStorageKey, JSON.stringify([nextLead, ...saved]));
  return nextLead;
}

export function clearSavedQuoteLeads() {
  if (canUseStorage()) window.localStorage.removeItem(quoteLeadStorageKey);
}
