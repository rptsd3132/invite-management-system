import { useCallback, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EventDetailsStep } from "./EventDetailsStep";
import { TemplateSelectionStep } from "./TemplateSelectionStep";
import { GuestListStep } from "./GuestListStep";
import { ReviewConfirmStep } from "./ReviewConfirmStep";

export interface WizardState {
  eventData: {
    eventName: string;
    location: string;
    eventDate: string;
    category: string;
    metadata: Record<string, string>;
  };
  selectedTemplateId: string | null;
  guests: Array<{ guestName: string; email: string }>;
}

type WizardAction =
  | { type: "SET_EVENT_DATA"; payload: Partial<WizardState["eventData"]> }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "ADD_GUESTS"; payload: Array<{ guestName: string; email: string }> }
  | { type: "REMOVE_GUEST"; payload: number }
  | { type: "RESET" };

const initialState: WizardState = {
  eventData: {
    eventName: "",
    location: "",
    eventDate: "",
    category: "Wedding",
    metadata: {},
  },
  selectedTemplateId: null,
  guests: [],
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_EVENT_DATA":
      return {
        ...state,
        eventData: { ...state.eventData, ...action.payload },
      };
    case "SET_TEMPLATE":
      return { ...state, selectedTemplateId: action.payload };
    case "ADD_GUESTS":
      return {
        ...state,
        guests: [...state.guests, ...action.payload],
      };
    case "REMOVE_GUEST":
      return {
        ...state,
        guests: state.guests.filter((_, i) => i !== action.payload),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const TOTAL_STEPS = 4;

export function CreateEventWizard(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") ?? "1", 10);
  const [state, dispatch] = useReducer(reducer, initialState);

  const goToStep = useCallback(
    (s: number) => {
      if (s < 1 || s > TOTAL_STEPS) return;
      setSearchParams(s === 1 ? {} : { step: String(s) });
    },
    [setSearchParams],
  );

  const handleFinish = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const stepProps = { state, dispatch, goToStep, handleFinish };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToStep(i + 1)}
              className={cnStep(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                step === i + 1
                  ? "bg-brand text-white"
                  : step > i + 1
                    ? "bg-brand/20 text-brand"
                    : "bg-neutral-100 text-neutral-400",
              )}
            >
              {i + 1}
            </button>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={cnStep(
                  "h-px w-8 sm:w-12 transition-colors",
                  step > i + 1 ? "bg-brand" : "bg-neutral-200",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && <EventDetailsStep {...stepProps} />}
      {step === 2 && <TemplateSelectionStep {...stepProps} />}
      {step === 3 && <GuestListStep {...stepProps} />}
      {step === 4 && <ReviewConfirmStep {...stepProps} />}
    </div>
  );
}

function cnStep(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
