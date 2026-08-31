import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Templates } from "./pages/Templates";
import { TemplateDetail } from "./pages/TemplateDetail";
import { CreateEvent } from "./pages/CreateEvent";
import { CreateEventWizard } from "./pages/events/CreateEventWizard";
import { EventDetail } from "./pages/EventDetail";
import { InvitationPage } from "./pages/InvitationPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import WeddingInvitation from "./components/templates/wedding/WeddingInvitation";
import WeddingInvitationTemplate from "./components/templates/wedding/WeddingInvitationTemplate";
import SinhalaWeddingTemplate from "./components/templates/wedding/SinhalaWeddingTemplate";

import BirthdayInvitation from "./components/templates/birthday/BirthdayInvitation";
import BirthdayInvitationTemplate from "./components/templates/birthday/BirthdayInvitationTemplate";
import SinhalaBirthdayTemplate from "./components/templates/birthday/SinhalaBirthdayTemplate";

import OfficeInvitation from "./components/templates/office/OfficeInvitation";
import OfficeInvitationTemplate from "./components/templates/office/OfficeInvitationTemplate";
import SinhalaOfficeInvitationTemplate from "./components/templates/office/SinhalaOfficeInvitationTemplate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* =====================================================
              MAIN APPLICATION ROUTES
          ====================================================== */}

          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/events/create" element={<CreateEventWizard />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* =====================================================
              REAL PUBLIC INVITATION ROUTE
          ====================================================== */}

          <Route
            path="/invitation/:token"
            element={<InvitationPage />}
          />

          {/* =====================================================
              OLD WEDDING ANIMATION TEST
          ====================================================== */}

          <Route
            path="/test-wedding"
            element={
              <WeddingInvitation
                guestName="Induwara Lakshan"
                brideName="Amali"
                groomName="Kasun"
                date="20 December 2026"
                time="4:30 PM"
                location="The Grand Kandyan, Kandy"
              />
            }
          />

          {/* =====================================================
              ENGLISH WEDDING TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-wedding-template"
            element={
              <WeddingInvitation
                guestName="Induwara Lakshan"
                brideName="Amali"
                groomName="Kasun"
                date="20 December 2026"
                time="4:30 PM"
                location="The Grand Kandyan, Kandy"
              >
                <WeddingInvitationTemplate
                  eventName="Kasun & Amali"
                  location="The Grand Kandyan, Kandy"
                  date="2026-12-20T16:30:00"
                  category="Wedding"
                  language="en"
                />
              </WeddingInvitation>
            }
          />

          {/* =====================================================
              SINHALA WEDDING TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-sinhala-wedding"
            element={
              <WeddingInvitation
                guestName="ඉඳුවර ලක්ෂාන්"
                brideName="නෙත්මි"
                groomName="කසුන්"
                date="20 දෙසැම්බර් 2026"
                time="4:30 PM"
                location="The Grand Kandyan, Kandy"
              >
                <SinhalaWeddingTemplate
                  eventName="කසුන් සහ නෙත්මි"
                  location="The Grand Kandyan, Kandy"
                  date="2026-12-20T16:30:00"
                  category="Wedding"
                  language="si"
                />
              </WeddingInvitation>
            }
          />

          {/* =====================================================
              OLD BIRTHDAY ANIMATION TEST
          ====================================================== */}

          <Route
            path="/test-birthday"
            element={
              <BirthdayInvitation
                guestName="Induwara Lakshan"
                birthdayPerson="Nethmi"
                age="25"
                date="18 July 2026"
                time="6:30 PM"
                location="Colombo Rooftop Lounge"
              />
            }
          />

          {/* =====================================================
              ENGLISH BIRTHDAY TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-birthday-template"
            element={
              <BirthdayInvitation
                guestName="Induwara Lakshan"
                birthdayPerson="Nethmi"
                age="25"
                date="18 July 2026"
                time="6:30 PM"
                location="Colombo Rooftop Lounge"
              >
                <BirthdayInvitationTemplate
                  eventName="Nethmi's Birthday Celebration"
                  birthdayPerson="Nethmi"
                  age="25"
                  location="Colombo Rooftop Lounge"
                  date="2026-07-18T18:30:00"
                  category="Birthday"
                  language="en"
                />
              </BirthdayInvitation>
            }
          />

          {/* =====================================================
              SINHALA BIRTHDAY TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-sinhala-birthday"
            element={
              <BirthdayInvitation
                guestName="ඉඳුවර ලක්ෂාන්"
                birthdayPerson="නෙත්මි"
                age="25"
                date="18 ජූලි 2026"
                time="6:30 PM"
                location="Colombo Rooftop Lounge"
              >
                <SinhalaBirthdayTemplate
                  eventName="නෙත්මිගේ උපන් දින සැමරුම"
                  birthdayPerson="නෙත්මි"
                  age="25"
                  location="Colombo Rooftop Lounge"
                  date="2026-07-18T18:30:00"
                  category="Birthday"
                  language="si"
                />
              </BirthdayInvitation>
            }
          />

          {/* =====================================================
              ENGLISH OFFICE TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-office"
            element={
              <OfficeInvitation
                guestName="Induwara Lakshan"
                eventName="Annual Innovation Summit 2026"
                companyName="Aurevia Technologies"
                date="21 August 2026"
                time="9:30 AM"
                location="Grand Conference Hall, Colombo"
              >
                <OfficeInvitationTemplate
                  eventName="Annual Innovation Summit 2026"
                  companyName="Aurevia Technologies"
                  location="Grand Conference Hall, Colombo"
                  date="2026-08-21T09:30:00"
                  category="Technology"
                  language="en"
                />
              </OfficeInvitation>
            }
          />

          {/* =====================================================
              SINHALA OFFICE TEMPLATE + ANIMATION
          ====================================================== */}

          <Route
            path="/test-sinhala-office"
            element={
              <OfficeInvitation
                guestName="ඉඳුවර ලක්ෂාන්"
                eventName="වාර්ෂික නවෝත්පාදන සමුළුව 2026"
                companyName="Aurevia Technologies"
                date="21 අගෝස්තු 2026"
                time="9:30 AM"
                location="Grand Conference Hall, Colombo"
              >
                <SinhalaOfficeInvitationTemplate
                  eventName="වාර්ෂික නවෝත්පාදන සමුළුව 2026"
                  companyName="Aurevia Technologies"
                  location="Grand Conference Hall, Colombo"
                  date="2026-08-21T09:30:00"
                  category="Office"
                  language="si"
                />
              </OfficeInvitation>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;