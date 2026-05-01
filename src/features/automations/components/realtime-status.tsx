"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type RealtimeState = "Conectando" | "Online" | "Erro";

export function RealtimeStatus() {
  const [state, setState] = useState<RealtimeState>("Conectando");
  const [lastEvent, setLastEvent] = useState("Aguardando eventos");

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("finance-automations")
      .on("broadcast", { event: "automation_event" }, (payload) => {
        setLastEvent(
          typeof payload.payload?.message === "string"
            ? payload.payload.message
            : "Evento Realtime recebido",
        );
      })
      .subscribe((status) => {
        setState(status === "SUBSCRIBED" ? "Online" : status === "CHANNEL_ERROR" ? "Erro" : "Conectando");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const isOnline = state === "Online";

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
      <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
      Supabase Realtime: {state}
      <span className="hidden font-normal text-blue-600 sm:inline">- {lastEvent}</span>
    </span>
  );
}
