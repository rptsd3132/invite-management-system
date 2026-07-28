import { cn } from "../../lib/utils";

interface DesignTypography {
  title_classes: string;
  accent_classes: string;
  body_classes: string;
}

interface DesignSchema {
  container_classes: string;
  background: string;
  decorations: string[];
  typography: DesignTypography;
  required_fields: string[];
}

interface TemplateRendererProps {
  designSchema: DesignSchema;
  fieldData: Record<string, string | undefined>;
}

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldStyle(
  field: string,
  requiredFields: string[],
  typography: DesignTypography,
  idx: number,
): string {
  const isFirst = idx === 0;
  const isLast = idx === requiredFields.length - 1;
  const isDateOrLocation =
    field.includes("date") || field.includes("location");
  const isName = field.includes("name") || field.includes("person");

  if (isFirst && isName) return typography.title_classes;
  if (isFirst) return typography.title_classes;
  if (isDateOrLocation) return typography.body_classes;
  if (isLast) return typography.body_classes;
  return typography.accent_classes;
}

export function TemplateRenderer({
  designSchema,
  fieldData,
}: TemplateRendererProps): React.ReactElement {
  const { container_classes, background, decorations, typography, required_fields } =
    designSchema;

  return (
    <div className={cn(container_classes, background)}>
      {decorations.map((deco, i) => (
        <div key={`deco-${i}`} className={deco} />
      ))}

      <div className="flex flex-col items-center justify-center flex-1 w-full px-6 z-10">
        {required_fields.map((field, idx) => {
          const value = fieldData[field];
          const display = value ?? formatFieldName(field);
          const style = fieldStyle(field, required_fields, typography, idx);

          return (
            <div key={field} className={cn(style, value ? "" : "opacity-60")}>
              {display}
            </div>
          );
        })}
      </div>
    </div>
  );
}
