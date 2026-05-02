import { createClient } from "@supabase/supabase-js";

import { getSupabaseServiceEnv } from "./env";

export function createAdminClient() {
  const { serviceRoleKey, url } = getSupabaseServiceEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
