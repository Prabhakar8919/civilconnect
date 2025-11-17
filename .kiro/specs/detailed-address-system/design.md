# Design Document

## Overview

This design implements a comprehensive address system for CivilConnect, replacing simple city/state fields with detailed address information. The system will capture house number, plot number, street, area, village, mandal, district, city, and state across all user-facing forms and display this information consistently on profile cards and modals.

## Architecture

### Data Flow
1. User enters address information in forms (Signup, Profile Edit, Land Listing)
2. Frontend validates and formats address data
3. Data is sent to Supabase via API calls
4. Database stores address in individual columns
5. When displaying profiles, address fields are fetched and formatted
6. Formatted address is displayed on cards and modals

### Component Hierarchy
```
Forms (Input)
├── Auth.tsx (Signup Form)
├── ProfileEdit.tsx (Profile Edit)
└── ProfileEdit.tsx (Land Listing Tab)

Display Components (Output)
├── ProfileCard.tsx
├── ProfileViewModal.tsx
└── LandRecords.tsx (Land Listing Cards)
```

## Components and Interfaces

### 1. Database Schema Changes

**SQL Migration Script:**
```sql
-- Add address columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS plot_number TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS village TEXT,
  ADD COLUMN IF NOT EXISTS mandal TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT;

-- Add address columns to land_listings table
ALTER TABLE land_listings 
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS plot_number TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS village TEXT,
  ADD COLUMN IF NOT EXISTS mandal TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT;
```

### 2. TypeScript Interfaces

```typescript
interface AddressFields {
  house_number?: string;
  plot_number?: string;
  street?: string;
  area?: string;
  village?: string;
  mandal?: string;
  district?: string;
  city: string;
  state: string;
}

interface Profile extends AddressFields {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_image?: string;
  experience_years?: number;
  total_projects?: number;
  cost_per_sqft?: number;
  // ... other fields
}

interface LandListing extends AddressFields {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  // ... other fields
}
```

### 3. Address Formatting Utility

**File:** `src/lib/addressUtils.ts`

```typescript
export const formatAddress = (address: Partial<AddressFields>): string => {
  const parts: string[] = [];
  
  // Add house/plot number
  if (address.house_number) parts.push(`H.No: ${address.house_number}`);
  if (address.plot_number) parts.push(`Plot: ${address.plot_number}`);
  
  // Add street and area
  if (address.street) parts.push(address.street);
  if (address.area) parts.push(address.area);
  
  // Add village and mandal
  if (address.village) parts.push(address.village);
  if (address.mandal) parts.push(`${address.mandal} Mandal`);
  
  // Add district, city, state
  if (address.district) parts.push(address.district);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  
  return parts.join(', ');
};

export const formatCompactAddress = (address: Partial<AddressFields>): string => {
  const parts: string[] = [];
  
  // For compact display, prioritize key fields
  if (address.area) parts.push(address.area);
  if (address.village) parts.push(address.village);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  
  return parts.join(', ') || 'Location not specified';
};
```

### 4. Form Components Design

#### Address Input Section Component

**File:** `src/components/AddressInputSection.tsx`

```typescript
interface AddressInputSectionProps {
  address: Partial<AddressFields>;
  onChange: (field: keyof AddressFields, value: string) => void;
  required?: boolean;
}

export const AddressInputSection = ({ 
  address, 
  onChange, 
  required = false 
}: AddressInputSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: House Number & Plot Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="house_number">House Number</Label>
          <Input
            id="house_number"
            value={address.house_number || ''}
            onChange={(e) => onChange('house_number', e.target.value)}
            placeholder="e.g., 12-34"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="plot_number">Plot Number</Label>
          <Input
            id="plot_number"
            value={address.plot_number || ''}
            onChange={(e) => onChange('plot_number', e.target.value)}
            placeholder="e.g., 567"
          />
        </div>
      </div>

      {/* Row 2: Street & Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="street">Street</Label>
          <Input
            id="street"
            value={address.street || ''}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="e.g., MG Road"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            value={address.area || ''}
            onChange={(e) => onChange('area', e.target.value)}
            placeholder="e.g., Jubilee Hills"
          />
        </div>
      </div>

      {/* Row 3: Village & Mandal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="village">Village</Label>
          <Input
            id="village"
            value={address.village || ''}
            onChange={(e) => onChange('village', e.target.value)}
            placeholder="e.g., Gachibowli"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="mandal">Mandal</Label>
          <Input
            id="mandal"
            value={address.mandal || ''}
            onChange={(e) => onChange('mandal', e.target.value)}
            placeholder="e.g., Serilingampally"
          />
        </div>
      </div>

      {/* Row 4: District, City & State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={address.district || ''}
            onChange={(e) => onChange('district', e.target.value)}
            placeholder="e.g., Rangareddy"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="city">
            City {required && <span className="text-red-600">*</span>}
          </Label>
          <Input
            id="city"
            value={address.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g., Hyderabad"
            required={required}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="state">
            State {required && <span className="text-red-600">*</span>}
          </Label>
          <Input
            id="state"
            value={address.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="e.g., Telangana"
            required={required}
          />
        </div>
      </div>
    </div>
  );
};
```

### 5. Display Components Updates

#### ProfileCard Address Display

Update the location display in ProfileCard.tsx:

```typescript
// Replace the simple city, state display with:
<CardDescription className="flex items-start gap-1.5 mt-1.5 text-sm text-white/80">
  <MapPin className="h-4 w-4 shrink-0 text-primary drop-shadow-md mt-0.5" />
  <span className="line-clamp-2 drop-shadow-sm">
    {formatCompactAddress(profile)}
  </span>
</CardDescription>
```

#### ProfileViewModal Address Display

Add a dedicated address section:

```typescript
{/* Address Section */}
<div className="space-y-3">
  <h3 className="text-lg font-semibold flex items-center gap-2">
    <MapPin className="h-5 w-5 text-primary" />
    Location Details
  </h3>
  <div className="grid grid-cols-2 gap-4 text-sm">
    {profile.house_number && (
      <div>
        <span className="text-muted-foreground">House No:</span>
        <p className="font-medium">{profile.house_number}</p>
      </div>
    )}
    {profile.plot_number && (
      <div>
        <span className="text-muted-foreground">Plot No:</span>
        <p className="font-medium">{profile.plot_number}</p>
      </div>
    )}
    {profile.street && (
      <div>
        <span className="text-muted-foreground">Street:</span>
        <p className="font-medium">{profile.street}</p>
      </div>
    )}
    {profile.area && (
      <div>
        <span className="text-muted-foreground">Area:</span>
        <p className="font-medium">{profile.area}</p>
      </div>
    )}
    {profile.village && (
      <div>
        <span className="text-muted-foreground">Village:</span>
        <p className="font-medium">{profile.village}</p>
      </div>
    )}
    {profile.mandal && (
      <div>
        <span className="text-muted-foreground">Mandal:</span>
        <p className="font-medium">{profile.mandal}</p>
      </div>
    )}
    {profile.district && (
      <div>
        <span className="text-muted-foreground">District:</span>
        <p className="font-medium">{profile.district}</p>
      </div>
    )}
    <div>
      <span className="text-muted-foreground">City:</span>
      <p className="font-medium">{profile.city}</p>
    </div>
    <div>
      <span className="text-muted-foreground">State:</span>
      <p className="font-medium">{profile.state}</p>
    </div>
  </div>
  <div className="pt-2 border-t">
    <p className="text-sm text-muted-foreground">Complete Address:</p>
    <p className="font-medium">{formatAddress(profile)}</p>
  </div>
</div>
```

## Data Models

### Profile State Management

```typescript
// In Auth.tsx, ProfileEdit.tsx
const [profile, setProfile] = useState({
  // ... existing fields
  house_number: "",
  plot_number: "",
  street: "",
  area: "",
  village: "",
  mandal: "",
  district: "",
  city: "",
  state: "",
});

// Handler for address field changes
const handleAddressChange = (field: keyof AddressFields, value: string) => {
  setProfile(prev => ({ ...prev, [field]: value }));
};
```

### Land Listing State Management

```typescript
// In ProfileEdit.tsx (Land Listing Tab)
const [landListing, setLandListing] = useState({
  // ... existing fields
  house_number: "",
  plot_number: "",
  street: "",
  area: "",
  village: "",
  mandal: "",
  district: "",
  city: "",
  state: "",
});
```

## Error Handling

1. **Validation Errors:**
   - Display inline error messages for required fields (city, state)
   - Show toast notifications for save failures

2. **Database Errors:**
   - Catch and log database errors
   - Show user-friendly error messages
   - Maintain form state on error

3. **Display Errors:**
   - Gracefully handle missing address fields
   - Show fallback text when no address is available

## Testing Strategy

### Unit Tests
- Test `formatAddress()` utility with various address combinations
- Test `formatCompactAddress()` with missing fields
- Test address field validation

### Integration Tests
- Test signup form with complete address
- Test profile update with address changes
- Test land listing creation with address
- Test address display on profile cards
- Test address display in modals

### Manual Testing Checklist
- [ ] Signup form accepts all address fields
- [ ] Profile edit page loads existing address data
- [ ] Profile edit page saves address changes
- [ ] Land listing form accepts address fields
- [ ] Profile cards display formatted addresses
- [ ] Profile modal shows complete address details
- [ ] Land listing cards show property addresses
- [ ] Empty address fields are handled gracefully
- [ ] Long addresses are truncated appropriately
- [ ] Address formatting is consistent across components

## Implementation Notes

1. **Backward Compatibility:** All new address fields are optional to support existing profiles
2. **Progressive Enhancement:** Users can add address details gradually
3. **Responsive Design:** Address forms adapt to mobile and desktop layouts
4. **Performance:** Address formatting is done client-side to minimize API calls
5. **Accessibility:** All form fields have proper labels and ARIA attributes
