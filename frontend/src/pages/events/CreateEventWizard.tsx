import { useCallback, useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { EventDetailsStep } from "./EventDetailsStep";
import { TemplateSelectionStep } from "./TemplateSelectionStep";
import { GuestListStep } from "./GuestListStep";
import { ReviewConfirmStep } from "./ReviewConfirmStep";
import { StepIndicator } from "../../components/events/StepIndicator";
import { useEventStore, type EventDraft } from "../../store/useEventStore";
import { useAuthStore } from "../../store/authStore";

export interface WizardState {
  eventData: EventDraft;
  selectedTemplateId: string | null;
  guests: Array<{ guestName: string; email: string }>;
}

export type WizardAction =
  | { type: "SET_EVENT_DATA"; payload: Partial<WizardState["eventData"]> }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "ADD_GUESTS"; payload: Array<{ guestName: string; email: string }> }
  | { type: "REMOVE_GUEST"; payload: number }
  | { type: "RESET" };

const STEP_LABELS = ["Choose Template", "Event Details", "Guests", "Review"];
const TOTAL_STEPS = 4;

export function CreateEventWizard(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStep = parseInt(searchParams.get("step") ?? "1", 10);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    eventData,
    selectedTemplateId,
    guests,
    setEventData,
    setTemplate,
    addGuests,
    removeGuest,
    reset,
  } = useEventStore();

  const state: WizardState = { eventData, selectedTemplateId, guests };

  const dispatch = useCallback(
    (action: WizardAction) => {
      switch (action.type) {
        case "SET_EVENT_DATA":
          setEventData(action.payload);
          break;
        case "SET_TEMPLATE":
          setTemplate(action.payload);
          break;
        case "ADD_GUESTS":
          addGuests(action.payload);
          break;
        case "REMOVE_GUEST":
          removeGuest(action.payload);
          break;
        case "RESET":
          reset();
          break;
      }
    },
    [setEventData, setTemplate, addGuests, removeGuest, reset],
  );

  useEffect(() => {
    const templateId = searchParams.get("templateId");
    if (templateId && selectedTemplateId !== templateId) {
      setTemplate(templateId);
    }
  }, [searchParams, selectedTemplateId, setTemplate]);

  const goToStep = useCallback(
    (s: number) => {
      if (s < 1 || s > TOTAL_STEPS) return;
      setSearchParams(s === 1 ? {} : { step: String(s) });
    },
    [setSearchParams],
  );

  const handleFinish = useCallback(() => {
    reset();
    navigate("/dashboard");
  }, [reset, navigate]);

  const step =
    requestedStep > 1 && !selectedTemplateId
      ? 1
      : Math.min(Math.max(requestedStep, 1), TOTAL_STEPS);

  if (step >= 3 && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: `/events/create?step=${step}` }}
        replace
      />
    );
  }

  const stepProps = { state, dispatch, goToStep, handleFinish };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-2xl border border-zinc-200/80 bg-white/70 px-5 py-4 shadow-sm shadow-zinc-900/5 backdrop-blur-sm sm:px-6">
        <StepIndicator currentStep={step} labels={STEP_LABELS} onStepClick={goToStep} />
      </div>

      {step === 1 && <TemplateSelectionStep {...stepProps} />}
      {step === 2 && <EventDetailsStep {...stepProps} />}
      {step === 3 && <GuestListStep {...stepProps} />}
      {step === 4 && <ReviewConfirmStep {...stepProps} />}
    </div>
  );
}
