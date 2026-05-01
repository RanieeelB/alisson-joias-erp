type InternalFinanceUser = {
  app_metadata?: Record<string, unknown>;
  email?: string | null;
};

function getAllowedInternalEmails() {
  const rawValue = process.env.INTERNAL_FINANCE_ALLOWED_EMAILS ?? "";

  return rawValue
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isInternalFinanceUser(user: InternalFinanceUser | null) {
  const role = user?.app_metadata?.role;

  if (role === "admin" || role === "staff") {
    return true;
  }

  const email = user?.email?.trim().toLowerCase();

  if (!email) {
    return false;
  }

  return getAllowedInternalEmails().includes(email);
}
