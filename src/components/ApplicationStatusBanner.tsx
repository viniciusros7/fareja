"use client";

import Link from "next/link";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useApplicationStatus } from "@/lib/hooks/useApplicationStatus";

export function ApplicationStatusBanner() {
  const { status, application, loading } = useApplicationStatus();

  if (loading || status === "none") return null;

  if (status === "pending") {
    return (
      <div className="reveal-step-1 mx-4 sm:mx-auto sm:max-w-3xl mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">Candidatura em análise</span>
          {application?.kennel_name && (
            <span className="text-amber-700"> — {application.kennel_name}</span>
          )}
          <p className="text-xs text-amber-600 mt-0.5">Nossa equipe irá revisar em breve.</p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="reveal-step-1 mx-4 sm:mx-auto sm:max-w-3xl mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">Candidatura aprovada!</span>
          {application?.kennel_name && (
            <span className="text-green-700"> — {application.kennel_name}</span>
          )}
          {application?.approval_message && (
            <p className="text-xs text-green-600 mt-0.5">{application.approval_message}</p>
          )}
        </div>
        <Link
          href="/painel/canil"
          className="shrink-0 text-xs font-semibold text-green-700 hover:text-green-900 underline"
        >
          Ver canil
        </Link>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="reveal-step-1 mx-4 sm:mx-auto sm:max-w-3xl mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-earth-100 border border-earth-200 text-sm text-earth-700">
        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-earth-400" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">Candidatura não aprovada</span>
          {application?.reject_reason && (
            <p className="text-xs text-earth-500 mt-0.5">{application.reject_reason}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
