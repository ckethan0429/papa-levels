"use client";

import dynamic from "next/dynamic";

import type { PapaChecklistTab } from "@/lib/papa-context";

const ChecklistExperienceClient = dynamic(
  () =>
    import("@/components/papa/checklist-experience-client").then((module) => module.ChecklistExperienceClient),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-grid-fade" />
  }
);

export function ChecklistExperienceLoader({
  requestedTab
}: {
  requestedTab: PapaChecklistTab | null;
}) {
  return <ChecklistExperienceClient requestedTab={requestedTab} />;
}
