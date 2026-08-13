import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createEvent, getTemplates } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import type { Template } from "../types";
import {
  fieldLabel,
  formatInvitationDate,
  getInvitationCopy,
  type InvitationLanguage,
} from "../lib/invitationLanguage";

const DATE_LABEL_FIELDS = ["event_date_time", "event_date"];
const LOCATION_FIELDS = ["event_location", "location"];
const NAME_FIELDS = ["event_name"];

function formatFieldLabel(
  key: string,
  language: InvitationLanguage,
): string {
  return fieldLabel(key, language);
}

function inputType(field: string): string {
  if (DATE_LABEL_FIELDS.includes(field)) return "datetime-local";
  return "text";
}

export function CreateEvent(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const templateId =
    (location.state as { templateId?: string } | null)?.templateId ??
    searchParams.get("templateId") ??
    "";

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template: Template | undefined = useMemo(
    () => templates?.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const requiredFields = useMemo(
    () => template?.design_schema.required_fields ?? [],
    [template],
  );

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<InvitationLanguage>("en");
  const copy = getInvitationCopy(language);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (requiredFields.length > 0) {
      setFieldValues((prev) => {
        const next = { ...prev };
        for (const f of requiredFields) {
          if (!(f in next)) next[f] = "";
        }
        return next;
      });
    }
  }, [requiredFields]);

  const setField = (field: string, value: string): void => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    for (const f of requiredFields) {
      if (!fieldValues[f]?.trim()) {
        errs[f] =
          language === "si"
            ? `${formatFieldLabel(f, language)} ${copy.required}`
            : `${formatFieldLabel(f, language)} is required`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mutation = useMutation({
    mutationFn: () => {
      const metadata: Record<string, string> = {};
      for (const f of requiredFields) {
        if (!NAME_FIELDS.includes(f) && !LOCATION_FIELDS.includes(f) && !DATE_LABEL_FIELDS.includes(f)) {
          metadata[f] = fieldValues[f] ?? "";
        }
      }
      metadata.language = language;

      return createEvent({
        template_id: templateId,
        event_name: fieldValues["event_name"] ?? "",
        location: fieldValues["event_location"] ?? fieldValues["location"] ?? "",
        event_date: fieldValues["event_date_time"]
          ? new Date(fieldValues["event_date_time"]).toISOString()
          : fieldValues["event_date"]
            ? new Date(fieldValues["event_date"]).toISOString()
            : new Date().toISOString(),
        event_metadata: metadata,
      });
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const fieldData: Record<string, string | undefined> = useMemo(() => {
    const data: Record<string, string | undefined> = {};

    for (const field of requiredFields) {
      const value = fieldValues[field];

      if (!value) {
        data[field] = undefined;
        continue;
      }

      if (DATE_LABEL_FIELDS.includes(field)) {
        data[field] = formatInvitationDate(value, language);
      } else if (field === "participant_name" && value === "Guest") {
        data[field] = copy.guest;
      } else {
        data[field] = value;
      }
    }

    return data;
  }, [copy.guest, fieldValues, language, requiredFields]);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  if (!templateId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-neutral-500">No template selected.</p>
        <Button className="mt-4" onClick={() => navigate("/templates")}>
          Browse Templates
        </Button>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-100 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-neutral-100 rounded-xl" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-neutral-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <h1 className="mt-6 text-3xl font-bold text-neutral-900">{copy.createEvent}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Fill in the details below. The preview updates live.
      </p>

      <form onSubmit={onSubmit} className="mt-8" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="order-2 md:order-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                {copy.invitationLanguage}
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                    language === "en"
                      ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/10"
                      : "border-neutral-200 bg-white text-neutral-700",
                  )}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("si")}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                    language === "si"
                      ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/10"
                      : "border-neutral-200 bg-white text-neutral-700",
                  )}
                >
                  සිංහල
                </button>
              </div>
            </div>

            {requiredFields.map((field) => (
              <div key={field}>
                <label
                  htmlFor={`field-${field}`}
                  className="block text-sm font-medium text-neutral-700"
                >
                  {formatFieldLabel(field, language)}
                </label>
                <input
                  id={`field-${field}`}
                  type={inputType(field)}
                  value={fieldValues[field] ?? ""}
                  onChange={(e) => setField(field, e.target.value)}
                  className={cn(
                    "mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2",
                    errors[field]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-neutral-300 focus:border-brand focus:ring-brand/20",
                  )}
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/templates")}
              >
                Change Template
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {mutation.isPending ? copy.creating : copy.createEvent}
              </Button>
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-600">
                {(mutation.error as Error)?.message ??
                  "Failed to create event."}
              </p>
            )}
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-sm">
              <TemplateRenderer
                designSchema={template.design_schema}
                fieldData={fieldData}
                language={language}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
