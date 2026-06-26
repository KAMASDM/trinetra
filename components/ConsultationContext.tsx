"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ConsultationContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<ConsultationContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>;
}

export function useConsultation() {
  const value = useContext(ConsultationContext);
  if (!value) throw new Error("useConsultation must be used inside ConsultationProvider");
  return value;
}
