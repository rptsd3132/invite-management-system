export type InvitationLanguage = "en" | "si";

export interface InvitationCopy {
  invitation: string;
  invitationLanguage: string;
  english: string;
  sinhala: string;
  eventDetails: string;
  eventDetailsHelp: string;
  eventName: string;
  location: string;
  dateTime: string;
  category: string;
  wedding: string;
  birthday: string;
  office: string;
  brideName: string;
  groomName: string;
  birthdayPersonName: string;
  nextEventDetails: string;
  continueToGuests: string;
  continueToReview: string;
  reviewConfirm: string;
  reviewHelp: string;
  name: string;
  date: string;
  template: string;
  guests: string;
  noGuests: string;
  invitationPreview: string;
  back: string;
  createEvent: string;
  createEventInvitations: string;
  creating: string;
  createdSuccessfully: string;
  invitationNotFound: string;
  invalidInvitation: string;
  invitedAs: string;
  rsvpStatus: string;
  confirmAttendance: string;
  decline: string;
  poweredBy: string;
  pending: string;
  accepted: string;
  declined: string;
  guest: string;
  required: string;
}

export const invitationCopy: Record<InvitationLanguage, InvitationCopy> = {
  en: {
    invitation: "Invitation",
    invitationLanguage: "Invitation Language",
    english: "English",
    sinhala: "සිංහල",
    eventDetails: "Event Details",
    eventDetailsHelp: "Tell us about your event.",
    eventName: "Event Name",
    location: "Location",
    dateTime: "Date & Time",
    category: "Category",
    wedding: "Wedding",
    birthday: "Birthday",
    office: "Office",
    brideName: "Bride Name",
    groomName: "Groom Name",
    birthdayPersonName: "Birthday Person Name",
    nextEventDetails: "Next: Event Details",
    continueToGuests: "Continue to Guests",
    continueToReview: "Continue to Review",
    reviewConfirm: "Review & Confirm",
    reviewHelp: "Verify everything looks correct before creating.",
    name: "Name",
    date: "Date",
    template: "Template",
    guests: "Guests",
    noGuests: "No guests added.",
    invitationPreview: "Invitation Preview",
    back: "Back",
    createEvent: "Create Event",
    createEventInvitations: "Create Event & Invitations",
    creating: "Creating...",
    createdSuccessfully: "Event created successfully!",
    invitationNotFound: "Invitation Not Found",
    invalidInvitation: "This invitation link is invalid or has expired.",
    invitedAs: "You are invited as",
    rsvpStatus: "RSVP Status",
    confirmAttendance: "Confirm Attendance",
    decline: "Decline",
    poweredBy: "Powered by Invite Management System",
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    guest: "Guest",
    required: "is required",
  },

  si: {
    invitation: "ආරාධනය",
    invitationLanguage: "ආරාධනා භාෂාව",
    english: "English",
    sinhala: "සිංහල",
    eventDetails: "උත්සව විස්තර",
    eventDetailsHelp: "ඔබගේ උත්සවයේ විස්තර ඇතුළත් කරන්න.",
    eventName: "උත්සවයේ නම",
    location: "ස්ථානය",
    dateTime: "දිනය සහ වේලාව",
    category: "වර්ගය",
    wedding: "විවාහ මංගල්‍යය",
    birthday: "උපන්දිනය",
    office: "නිල / කාර්යාලීය",
    brideName: "මනාලියගේ නම",
    groomName: "මනාලයාගේ නම",
    birthdayPersonName: "උපන්දිනය සමරන අයගේ නම",
    nextEventDetails: "ඊළඟට: උත්සව විස්තර",
    continueToGuests: "ආරාධිතයින් වෙත යන්න",
    continueToReview: "සමාලෝචනය වෙත යන්න",
    reviewConfirm: "පරීක්ෂා කර තහවුරු කරන්න",
    reviewHelp: "සාදීමට පෙර සියලු විස්තර නිවැරදිදැයි පරීක්ෂා කරන්න.",
    name: "නම",
    date: "දිනය",
    template: "ආරාධනා පත්‍රය",
    guests: "ආරාධිතයින්",
    noGuests: "ආරාධිතයින් එක් කර නැත.",
    invitationPreview: "ආරාධනා පත්‍ර පෙරදසුන",
    back: "ආපසු",
    createEvent: "උත්සවය සාදන්න",
    createEventInvitations: "උත්සවය සහ ආරාධනා සාදන්න",
    creating: "සාදමින්...",
    createdSuccessfully: "උත්සවය සාර්ථකව සාදන ලදී!",
    invitationNotFound: "ආරාධනය හමු නොවීය",
    invalidInvitation: "මෙම ආරාධනා සබැඳිය වලංගු නොවේ හෝ කල් ඉකුත් වී ඇත.",
    invitedAs: "ඔබට ආරාධනා කර ඇත්තේ",
    rsvpStatus: "සහභාගීත්ව තත්ත්වය",
    confirmAttendance: "සහභාගීත්වය තහවුරු කරන්න",
    decline: "සහභාගී නොවෙමි",
    poweredBy: "Invite Management System මඟින් බලගන්වයි",
    pending: "තහවුරු කිරීමට ඇත",
    accepted: "තහවුරු කර ඇත",
    declined: "ප්‍රතික්ෂේප කර ඇත",
    guest: "ආරාධිත අමුත්තා",
    required: "අවශ්‍ය වේ",
  },
};

export function getInvitationCopy(
  language: InvitationLanguage,
): InvitationCopy {
  return invitationCopy[language] ?? invitationCopy.en;
}

export function normalizeInvitationLanguage(
  value: unknown,
): InvitationLanguage {
  return value === "si" ? "si" : "en";
}

export function categoryLabel(
  category: string,
  language: InvitationLanguage,
): string {
  const copy = getInvitationCopy(language);

  if (category === "Wedding") return copy.wedding;
  if (category === "Birthday") return copy.birthday;
  if (category === "Office") return copy.office;

  return category;
}

export function fieldLabel(
  field: string,
  language: InvitationLanguage,
): string {
  const copy = getInvitationCopy(language);

  const labels: Record<string, string> = {
    event_name: copy.eventName,
    event_location: copy.location,
    location: copy.location,
    event_date_time: copy.dateTime,
    event_date: copy.dateTime,
    participant_name: language === "si" ? "ආරාධිතයාගේ නම" : "Guest Name",
    bride_name: copy.brideName,
    groom_name: copy.groomName,
    birthday_person_name: copy.birthdayPersonName,
  };

  return (
    labels[field] ??
    field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

export function formatInvitationDate(
  value: string | Date,
  language: InvitationLanguage,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const locale = language === "si" ? "si-LK" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatReviewDate(
  value: string | Date,
  language: InvitationLanguage,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const locale = language === "si" ? "si-LK" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function rsvpStatusLabel(
  status: string,
  language: InvitationLanguage,
): string {
  const copy = getInvitationCopy(language);

  if (status === "pending") return copy.pending;
  if (status === "accepted" || status === "confirmed") return copy.accepted;
  if (status === "declined") return copy.declined;

  return status;
}
