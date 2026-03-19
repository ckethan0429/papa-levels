import { ChecklistExperienceLoader } from "@/components/papa/checklist-experience-loader";
import { isPapaChecklistTab, type PapaChecklistTab } from "@/lib/papa-context";

function resolveRequestedTab(value: string | null): PapaChecklistTab | null {
  return isPapaChecklistTab(value) ? value : null;
}

export default async function ChecklistPage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const params = (await searchParams) ?? {};
  return <ChecklistExperienceLoader requestedTab={resolveRequestedTab(params.tab ?? null)} />;
}
