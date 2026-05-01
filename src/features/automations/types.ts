export type AutomationOwnerArea =
  | "Faturas"
  | "Accounts Receivable"
  | "Statements"
  | "Reports";

export type AutomationStatus =
  | "queued"
  | "mock"
  | "sync pending"
  | "failed"
  | "completed";

export type AutomationRule = {
  id: string;
  title: string;
  description: string;
  ownerArea: AutomationOwnerArea;
  cadence: string;
  enabled: boolean;
};

export type AutomationJob = {
  id: string;
  job: string;
  origin: string;
  destination: string;
  nextRun: string;
  status: AutomationStatus;
};

export type AutomationIntegration = {
  id: string;
  name: string;
  detail: string;
  status: "online" | "mock" | "boundary" | "failed";
};

export type AutomationEvent = {
  id: string;
  time: string;
  description: string;
  ownerArea: AutomationOwnerArea;
  status: AutomationStatus;
};
