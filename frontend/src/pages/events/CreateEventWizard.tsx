import { useCallback, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EventDetailsStep } from "./EventDetailsStep";
import { TemplateSelectionStep } from "./TemplateSelectionStep";
import { GuestListStep } from "./GuestListStep";
import { ReviewConfirmStep } from "./ReviewConfirmStep";
<<<<<<< HEAD
import { StepIndicator } from "../../components/events/StepIndicator";
=======
import type { InvitationLanguage } from "../../lib/invitationLanguage";
>>>>>>> main

export interface WizardState {
  eventData: {
    eventName: string;
    location: string;
    eventDate: string;
    category: string;
    language: InvitationLanguage;
    metadata: Record<string, string>;
  };
  selectedTemplateId: string | null;
  guests: Array<{ guestName: string; email: string }>;
}

export type WizardAction =
  | { type: "SET_EVENT_DATA"; payload: Partial<WizardState["eventData"]> }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "ADD_GUESTS"; payload: Array<{ guestName: string; email: string }> }
  | { type: "REMOVE_GUEST"; payload: number }
  | { type: "RESET" };

const STEP_LABELS = ["Event Details", "Choose Template", "Guests", "Review"];

const initialState: WizardState = {
  eventData: {
    eventName: "",
    location: "",
    eventDate: "",
    category: "Wedding",
    language: "en",
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
      <div className="mb-10 rounded-2xl border border-zinc-200/80 bg-white/70 px-5 py-4 shadow-sm shadow-zinc-900/5 backdrop-blur-sm sm:px-6">
        <StepIndicator currentStep={step} labels={STEP_LABELS} onStepClick={goToStep} />
      </div>

      {step === 1 && <EventDetailsStep {...stepProps} />}
      {step === 2 && <TemplateSelectionStep {...stepProps} />}
      {step === 3 && <GuestListStep {...stepProps} />}
      {step === 4 && <ReviewConfirmStep {...stepProps} />}
    </div>
  );
}