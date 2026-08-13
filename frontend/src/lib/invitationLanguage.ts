export type InvitationLanguage =
  | "en"
  | "si";

export const invitationText = {
  en: {
    invitation: "Invitation",

    weddingInvitation:
      "Wedding Invitation",

    birthdayInvitation:
      "Birthday Invitation",

    officeInvitation:
      "Official Invitation",

    weddingDay:
      "Wedding Day",

    birthdayParty:
      "Birthday Party",

    guest:
      "Guest",

    date:
      "Date",

    time:
      "Time",

    location:
      "Location",

    invitedTo:
      "You are invited",

    weddingMessage:
      "We warmly invite you to celebrate this special day with us.",

    birthdayMessage:
      "Join us for a joyful birthday celebration.",

    officeMessage:
      "You are cordially invited to attend this event.",
  },

  si: {
    invitation:
      "ආරාධනය",

    weddingInvitation:
      "විවාහ මංගල ආරාධනය",

    birthdayInvitation:
      "උපන්දින ආරාධනය",

    officeInvitation:
      "නිල ආරාධනය",

    weddingDay:
      "විවාහ මංගල දිනය",

    birthdayParty:
      "උපන්දින සැමරුම",

    guest:
      "ආරාධිත අමුත්තා",

    date:
      "දිනය",

    time:
      "වේලාව",

    location:
      "ස්ථානය",

    invitedTo:
      "ඔබට ආරාධනා කරමු",

    weddingMessage:
      "අපගේ මෙම සුවිශේෂී දිනය සමරන්නට ඔබට ආදරයෙන් ආරාධනා කරමු.",

    birthdayMessage:
      "මෙම සතුටුදායක උපන්දින සැමරුමට ඔබට ආදරයෙන් ආරාධනා කරමු.",

    officeMessage:
      "මෙම අවස්ථාවට සහභාගී වන ලෙස ඔබට ගෞරවයෙන් ආරාධනා කරමු.",
  },
} as const;