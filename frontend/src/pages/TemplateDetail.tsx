import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTemplates } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import type { Template } from "../types";

const sampleData: Record<string, Record<string, string>> = {
  Wedding: {
    event_name: "Our Wedding Day",
    bride_name: "Sarah",
    groom_name: "James",
    participant_name: "Emily & Family",
    event_date_time: "Saturday, June 14, 2026 at 4:00 PM",
    event_location: "The Grand Rose Garden, 123 Blossom Lane",
  },
  Office: {
    event_name: "Annual Innovation Summit 2026",
    participant_name: "Alex",
    event_date_time: "Friday, May 22, 2026 at 9:00 AM",
    event_location: "Convention Center, 456 Business Ave",
  },
  Birthday: {
    event_name: "Emma's 16th Birthday Bash",
    participant_name: "Sophie",
    birthday_person_name: "Emma",
    event_date_time: "Saturday, August 8, 2026 at 7:00 PM",
    event_location: "The Party Palace, 789 Celebration Blvd",
  },
};

const fallbackData: Record<string, string> = {
  bride_name: "Sarah",
  groom_name: "James",
  event_name: "Annual Gala 2026",
  participant_name: "Guest",
  birthday_person_name: "Alex",
  event_date_time: "Saturday, June 14, 2026 at 4:00 PM",
  event_location: "Grand Venue, 123 Main Street",
};

export function TemplateDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: templates, isLoading, isError, error } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template: Template | undefined = templates?.find((t) => t.id === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-100 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-neutral-100 rounded-xl" />
            <div className="space-y-3">
              <div className="h-6 bg-neutral-100 rounded w-3/4" />
              <div className="h-4 bg-neutral-100 rounded w-1/2" />
              <div className="h-4 bg-neutral-100 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/templates")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700">
            {!template ? "Template not found" : (error as Error)?.message ?? "Failed to load template."}
          </p>
        </div>
      </div>
    );
  }

  const schema = template.design_schema;
  const categorySample = sampleData[template.category] ?? fallbackData;
  const previewData: Record<string, string | undefined> = { ...categorySample };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate("/templates")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Templates
      </Button>

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-neutral-900">{template.name}</h1>
          <span className={cn(
            "text-xs px-2.5 py-0.5 rounded-full border font-medium",
            template.category === "Wedding" && "bg-pink-100 text-pink-700 border-pink-200",
            template.category === "Office" && "bg-blue-100 text-blue-700 border-blue-200",
            template.category === "Birthday" && "bg-yellow-100 text-yellow-700 border-yellow-200",
          )}>
            {template.category}
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          Requires: {schema.required_fields.join(", ")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <TemplateRenderer designSchema={schema} fieldData={previewData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Preview Data</h2>
            <div className="space-y-3">
              {schema.required_fields.map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    {field.replace(/_/g, " ")}
                  </label>
                  <div className="text-sm text-neutral-800 bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-100">
                    {previewData[field] ?? `{{${field}}}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/create-event", { state: { templateId: id } })}
              className="flex-1"
            >
              Use This Template
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
