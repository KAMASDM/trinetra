export const consultationTypes = [
  "Bridal Trousseau",
  "Custom Lehenga / Saree",
  "Suit / Kurta Tailoring",
  "Styling Consultation",
  "Other",
] as const;

export type ConsultationType = (typeof consultationTypes)[number];
