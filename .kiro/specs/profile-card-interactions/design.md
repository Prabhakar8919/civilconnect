# Design Document

## Overview

This design document outlines the architecture and implementation approach for the Profile Card Interactions system in CivilConnect. The system provides a unified, authentication-aware profile viewing experience across all role-based pages using reusable React components and consistent interaction patterns.

## Architecture

### Component Hierarchy

```
ProfileCard (existing, enhanced)
├── ProfileViewModal (new)
│   ├── ProfileHeader
│   ├── ProfileBasicInfo
│   ├── ProfileProfessionalDetails
│   ├── ProfileActions
│   └── LoginPrompt (for unauthenticated users)
├── PhotoPreviewModal (new)
│   ├── ZoomControls
│   └── ImageViewer
└── Card Click Handler
```

### Data Flow

```
User Click → ProfileCard
    ↓
Check Authentication Status
    ↓
    ├─→ Authenticated: Show Full Profile Modal
    │       ↓
    │   Display: Name, Photo, Bio, Experience, Pricing, Projects, Ratings, Contact Options
    │
    └─→ Unauthenticated: Show Restricted Profile Modal
            ↓
        Display: Name, Photo, Role, Location, Rating + Login Prompt
```

## Components and Interfaces

### 1. ProfileViewModal Component

**Purpose:** Display profile information in a modal dialog with authentication-aware content

**Props Interface:**
```typescript
interface ProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  isAuthenticated: boolean;
  onLogin: () => void;
  onConnect?: () => void;
}
```

**Key Features:**
- Responsive dialog with max-width constraints
- Scrollable content area
- Conditional rendering based on authentication
- Smooth open/close animations
- Focus trap for accessibility



### 2. PhotoPreviewModal Component

**Purpose:** Display enlarged profile photo with zoom capabilities

**Props Interface:**
```typescript
interface PhotoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt: string;
}
```

**Key Features:**
- Full-screen modal overlay
- Zoom in/out controls (+/- buttons)
- Pinch-to-zoom support on touch devices
- Image quality preservation
- Keyboard navigation (ESC to close, +/- to zoom)

### 3. Enhanced ProfileCard Component

**Current State:** ProfileCard already exists with basic functionality

**Enhancements Needed:**
- Add onClick handler for card body
- Add separate onClick handler for profile photo
- Prevent event propagation between photo and card clicks
- Add cursor pointer styling
- Add hover state visual feedback

**Modified Props:**
```typescript
interface ProfileCardProps {
  profile: Profile;
  currentUserId?: string;
  connectionStatus?: 'none' | 'pending' | 'accepted';
  connectionId?: string;
  onConnect?: () => void;
  onRatingSubmitted?: () => void;
  // New props
  onCardClick?: () => void;
  onPhotoClick?: () => void;
  isAuthenticated: boolean;
}
```

## Data Models

### Profile Data Structure

```typescript
interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  city: string;
  state: string;
  user_type: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
  professional_profiles?: ProfessionalProfile[];
  worker_profiles?: WorkerProfile[];
}

interface ProfessionalProfile {
  experience_years?: number;
  price_per_sqft?: number;
  total_projects?: number;
  rating?: number;
}

interface WorkerProfile {
  experience_years?: number;
  price_per_sqft?: number;
  total_projects?: number;
  rating?: number;
}
```



## Error Handling

### Authentication Check Failures
- **Scenario:** Unable to verify user authentication status
- **Handling:** Default to unauthenticated state, show login prompt
- **User Message:** "Please login to view full profile details"

### Profile Data Loading Errors
- **Scenario:** Profile data fails to load or is incomplete
- **Handling:** Display available data, show placeholder for missing fields
- **User Message:** "Some profile information is currently unavailable"

### Image Loading Failures
- **Scenario:** Profile photo fails to load
- **Handling:** Display fallback avatar with user initials
- **User Message:** No explicit message, graceful fallback

### Network Errors
- **Scenario:** API calls fail due to network issues
- **Handling:** Show error state in modal with retry option
- **User Message:** "Unable to load profile. Please try again."

## Testing Strategy

### Unit Tests
1. **ProfileViewModal Component**
   - Renders correctly with authenticated user
   - Renders correctly with unauthenticated user
   - Shows/hides content based on authentication
   - Calls onLogin when login button clicked
   - Closes when close button clicked

2. **PhotoPreviewModal Component**
   - Opens and displays image correctly
   - Zoom in/out functions work
   - Closes on ESC key press
   - Closes on outside click
   - Handles missing image gracefully

3. **ProfileCard Enhancements**
   - Card click triggers onCardClick
   - Photo click triggers onPhotoClick
   - Photo click doesn't trigger card click
   - Hover states apply correctly

### Integration Tests
1. **Authentication Flow**
   - Unauthenticated user sees restricted view
   - Login button redirects to auth page
   - Authenticated user sees full profile
   - Authentication state persists across modals

2. **Cross-Page Consistency**
   - Same behavior on Engineers page
   - Same behavior on Architects page
   - Same behavior on Civil Workers page
   - Same behavior on Contractors page
   - Same behavior on Material Sellers page
   - Same behavior on Land Records page
   - Same behavior on Services page



### Accessibility Tests
1. **Keyboard Navigation**
   - Tab through modal elements
   - ESC closes modals
   - Enter/Space activates buttons
   - Focus trap works in modals

2. **Screen Reader Support**
   - Modal announces when opened
   - All images have alt text
   - Buttons have descriptive labels
   - Status changes are announced

3. **Visual Accessibility**
   - Contrast ratios meet WCAG 2.1 AA
   - Text is readable at all sizes
   - Focus indicators are visible
   - Color is not sole indicator

### Performance Tests
1. **Modal Open Speed**
   - Modal opens within 200ms
   - No layout shift on open
   - Smooth animation performance

2. **Image Loading**
   - Progressive image loading
   - Lazy loading for off-screen images
   - Proper caching implementation

## Implementation Notes

### Existing Code Reuse
- Leverage existing Dialog component from shadcn/ui
- Use existing Button, Badge, Card components
- Reuse authentication context/hooks
- Utilize existing Supabase client setup

### New Dependencies
- No new external dependencies required
- All functionality achievable with existing libraries

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)
- Desktop: > 1024px (xl)

### Animation Specifications
- Modal fade-in: 200ms ease-out
- Modal fade-out: 150ms ease-in
- Zoom transition: 300ms ease-in-out
- Hover effects: 150ms ease

