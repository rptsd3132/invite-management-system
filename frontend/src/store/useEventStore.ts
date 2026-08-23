import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { InvitationLanguage } from "../lib/invitationLanguage";

export interface EventDraft {
  eventName: string;
  location: string;
  eventDate: string;
  category: string;
  language: InvitationLanguage;
  metadata: Record<string, string>;
  latitude: number | null;
  longitude: number | null;
}

export interface EventWizardState {
  eventData: EventDraft;
  selectedTemplateId: string | null;
  guests: Array<{ guestName: string; email: string }>;
}

interface EventWizardActions {
  setEventData: (partial: Partial<EventDraft>) => void;
  setTemplate: (id: string) => void;
  addGuests: (guests: Array<{ guestName: string; email: string }>) => void;
  removeGuest: (index: number) => void;
  reset: () => void;
}

const INITIAL_EVENT_DATA: EventDraft = {
  eventName: "",
  location: "",
  eventDate: "",
  category: "Wedding",
  language: "en",
  metadata: {},
  latitude: null,
  longitude: null,
};

export const useEventStore = create<EventWizardState & EventWizardActions>()(
  persist(
    (set) => ({
      eventData: { ...INITIAL_EVENT_DATA },
      selectedTemplateId: null,
      guests: [],

      setEventData: (partial) =>
        set((state) => ({
          eventData: { ...state.eventData, ...partial },
        })),

      setTemplate: (id) =>
        set({ selectedTemplateId: id }),

      addGuests: (newGuests) =>
        set((state) => ({
          guests: [...state.guests, ...newGuests],
        })),

      removeGuest: (index) =>
        set((state) => ({
          guests: state.guests.filter((_, i) => i !== index),
        })),

      reset: () =>
        set({
          eventData: { ...INITIAL_EVENT_DATA },
          selectedTemplateId: null,
          guests: [],
        }),
    }),
    {
      name: "event-wizard-draft",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
