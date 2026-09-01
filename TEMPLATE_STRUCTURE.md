# Invitation Template System Overview

## Current Project Structure

Your invitation management system uses a **three-tier template architecture**:

### 1. Database Layer (Backend)
```
backend/app/
├── models/template.py          # Template DB model
├── schemas/template.py         # Template validation schemas
├── crud/template.py            # Database operations
├── api/v1/endpoints/templates.py  # API endpoints
└── db/seed_templates.py        # Pre-defined templates
```

**Template Database Model:**
```python
class Template(Base):
    id: UUID                    # Unique identifier
    user_id: UUID | None        # User who created it (nullable for system templates)
    name: str                   # "English Wedding", "Sinhala Birthday", etc.
    category: str               # "Wedding", "Birthday", "Office"
    thumbnail_url: str          # Image URL for preview
    design_schema: dict (JSON)  # Layout configuration (text positions, colors, fonts)
    created_at: datetime        # Timestamp
```

---

## Currently Active Templates (6 Total)

### ✅ Active Templates in System

| # | Name | Category | Language | Component |
|---|------|----------|----------|-----------|
| 1 | **English Wedding** | Wedding | English | `WeddingInvitationTemplate.tsx` |
| 2 | **Sinhala Wedding** | Wedding | Sinhala | `SinhalaWeddingTemplate.tsx` |
| 3 | **English Birthday** | Birthday | English | `BirthdayInvitationTemplate.tsx` |
| 4 | **Sinhala Birthday** | Birthday | Sinhala | `SinhalaBirthdayTemplate.tsx` |
| 5 | **English Office** | Office | English | `OfficeInvitationTemplate.tsx` |
| 6 | **Sinhala Office** | Office | Sinhala | `SinhalaOfficeInvitationTemplate.tsx` |

**Filter Code Location:** `frontend/src/pages/events/TemplateSelectionStep.tsx` (lines 30-38)
```typescript
const ACTIVE_TEMPLATE_NAMES = new Set([
  "English Wedding",
  "Sinhala Wedding",
  "English Birthday",
  "Sinhala Birthday",
  "English Office",
  "Sinhala Office",
]);
```

---

## Backend Template Seed Data

**File:** `backend/app/db/seed_templates.py`

### Available Template Designs in Seed
These are defined but only 6 are active (filtered by name):

**Wedding Templates (7 total, 1 per English version):**
- Wedding Floral Classic
- Wedding Elegant Classic
- Wedding Modern Classic
- Black and Gold Elegant Wedding
- Blue Elegant Wedding
- Blue Gold Elegant Wedding
- Green and White Wedding

**Birthday & Office Templates:** Also defined in seed

### Template Definition Example

```python
make_template(
    name="Wedding Floral Classic",           # Template name
    category="Wedding",                       # Category
    image="wedding/1.png",                   # Thumbnail image
    style_key="wedding-botanical",           # CSS style reference
    required_fields=WEDDING_FIELDS,          # Fields to populate
    layout={                                 # Text positioning config
        "bride_name": text_pos(
            x=50, y=31, width=58,           # Position as % of container
            size="hero", color="#F6DA84",   # Font size (hero/xl/lg/md/sm/xs), color
            family="serif", weight=600,     # Font family, weight
        ),
        # ... more fields
    },
)
```

---

## Frontend Component Structure

### Template Component Files

```
frontend/src/components/assets/
├── wedding/
│   ├── WeddingInvitationTemplate.tsx      # English version
│   ├── SinhalaWeddingTemplate.tsx         # Sinhala version
│   ├── WeddingInvitation.tsx              # Card design/styling
│   └── assets/
│       ├── traditional-wedding-template.png
│       └── [other template images]
├── birthday/
│   ├── BirthdayInvitationTemplate.tsx     # English version
│   ├── SinhalaBirthdayTemplate.tsx        # Sinhala version
│   ├── BirthdayInvitation.tsx             # Card design/styling
│   └── assets/
│       └── [birthday template images]
└── office/
    ├── OfficeInvitationTemplate.tsx       # English version
    ├── SinhalaOfficeInvitationTemplate.tsx # Sinhala version
    ├── OfficeInvitation.tsx               # Card design/styling
    └── assets/
        └── [office template images]
```

### Core Template Rendering System

**File:** `frontend/src/components/ui/TemplateRenderer.tsx`

Handles dynamic rendering of any template using:
- `designSchema` (from database) - text positions, colors, fonts
- `fieldData` - actual invitation content
- `language` - en or si

**Supported Style Keys:**
```
wedding-botanical, wedding-minimal, wedding-pastel, wedding-luxury
birthday-playful, birthday-elegant
office-modern, office-professional
```

---

## Data Flow: How Templates Work

### 1. **Template Selection (User Creates Event)**

```
User selects "English Wedding"
↓
Frontend filters by ACTIVE_TEMPLATE_NAMES
↓
Component displays WeddingInvitationTemplate
↓
Template schema stored in event.selectedTemplateId
```

### 2. **Invitation Rendering**

```
Event created with template + guest data
↓
Backend provides template's design_schema
↓
TemplateRenderer receives:
  - design_schema (JSON with text positions)
  - fieldData (bride_name, groom_name, etc.)
  - language (en/si)
↓
Dynamic HTML generated + styled
↓
Guest views invitation card
```

### 3. **Required Fields by Category**

**WEDDING:**
```python
["event_name", "bride_name", "groom_name", "event_date_time", 
 "event_location", "participant_name"]
```

**BIRTHDAY:**
```python
["event_name", "birthday_person_name", "event_date_time", 
 "event_location", "participant_name"]
```

**OFFICE:**
```python
["event_name", "participant_name", "event_date_time", "event_location"]
```

---

## How to Add New Templates

### **Option 1: Add New Design to Existing Category (No Schema Changes)**

#### Step 1: Add Backend Template Definition
**File:** `backend/app/db/seed_templates.py`

```python
TEMPLATES_DATA = [
    # ... existing templates ...
    
    make_template(
        name="Rose Garden Wedding",        # Must match frontend filter
        category="Wedding",                # Existing category
        image="wedding/rose-garden.png",  # New image path
        style_key="wedding-romantic",     # New style key
        required_fields=WEDDING_FIELDS,   # Use existing field list
        layout={
            "bride_name": text_pos(
                50, 35, 54, "xl", "#D4536F",
                family="serif", weight=600,
            ),
            "groom_name": text_pos(
                50, 50, 54, "xl", "#D4536F",
                family="serif", weight=600,
            ),
            # ... position all required fields ...
        },
    ),
]
```

#### Step 2: Add Frontend Component
**File:** `frontend/src/components/assets/wedding/RoseGardenTemplate.tsx`

```typescript
import type { ReactElement } from "react";
import roseGardenImage from "./assets/rose-garden.png";

interface RoseGardenTemplateProps {
  eventName: string;
  location: string;
  date: string;
  language?: "en" | "si";
}

export default function RoseGardenTemplate({
  eventName,
  location,
  date,
  language = "en",
}: RoseGardenTemplateProps): ReactElement {
  const isSinhala = language === "si";
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5e6d3]">
      <div
        className="relative aspect-[2/3] w-full max-w-[620px] overflow-hidden"
        style={{
          backgroundImage: `url(${roseGardenImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Your card content here */}
      </div>
    </div>
  );
}
```

#### Step 3: Update Active Templates List
**File:** `frontend/src/pages/events/TemplateSelectionStep.tsx`

```typescript
const ACTIVE_TEMPLATE_NAMES = new Set([
  "English Wedding",
  "Sinhala Wedding",
  "English Birthday",
  "Sinhala Birthday",
  "English Office",
  "Sinhala Office",
  "Rose Garden Wedding",  // Add new template
]);
```

#### Step 4: Add Routing Logic
**File:** `frontend/src/pages/events/TemplateSelectionStep.tsx` (around line 220)

```typescript
if (templateKind === "wedding-en") {
  // Check if it's the new template
  if (selectedTemplate?.name === "Rose Garden Wedding") {
    return (
      <RoseGardenTemplate
        eventName={eventName}
        location={location}
        date={eventDate}
        language="en"
      />
    );
  }
  
  return (
    <WeddingInvitationTemplate
      eventName={eventName}
      location={location}
      date={eventDate}
      category="Wedding"
      language="en"
    />
  );
}
```

---

### **Option 2: Add New Category (Requires Minor Schema Extension)**

Would need to:
1. Define new required fields in seed file
2. Add field enum to database
3. Create category-specific components
4. Update routing logic

---

## File Organization Summary

### Backend
- **Models:** Define data structure ✅
- **CRUD:** Database operations ✅
- **Schemas:** API validation ✅
- **Seeds:** Template data + designs ✅
- **API:** Endpoints to fetch templates ✅

### Frontend
- **Pages:** Template selection & event creation ✅
- **Components:** Individual template renderers ✅
- **UI:** Generic TemplateRenderer for schema-driven rendering ✅

---

## Image Assets Required

Place template images in:
```
frontend/public/templates/
├── wedding/
│   ├── 1.png
│   ├── 2.png
│   └── [etc.]
├── birthday/
│   └── [images]
└── office/
    └── [images]
```

Or embed as imported assets in components.

---

## Key Takeaways

✅ **Current Design:** 6 active templates (3 categories × 2 languages)
✅ **Easy to Extend:** Add new designs within same category/fields
✅ **Schema Stable:** No database changes needed for new designs
✅ **Language Support:** Built-in English/Sinhala for all categories
✅ **Component-Based:** Each template is a React component for full control

**To add a new template:** Only modify `seed_templates.py`, create new component, update active list + routing. No schema changes needed!
