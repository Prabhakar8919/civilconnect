# Implementation Plan

- [ ] 1. Update database schema and create utility functions
  - [x] 1.1 Create SQL migration script for address columns


    - Add house_number, plot_number, street, area, village, mandal, district columns to profiles table
    - Add same columns to land_listings table
    - _Requirements: 1.1, 1.2, 1.3_


  
  - [ ] 1.2 Create address formatting utility functions
    - Create src/lib/addressUtils.ts file
    - Implement formatAddress() function for full address display
    - Implement formatCompactAddress() function for card display


    - _Requirements: 8.1, 8.3, 8.4_

- [ ] 2. Create reusable AddressInputSection component
  - [ ] 2.1 Create AddressInputSection component
    - Create src/components/AddressInputSection.tsx
    - Implement grid layout with all address fields
    - Add proper labels, placeholders, and validation
    - Make city and state required fields
    - _Requirements: 2.4, 3.3, 4.3_

- [ ] 3. Update Signup Form (Auth.tsx)
  - [ ] 3.1 Add address fields to signup form state
    - Update profile state to include all address fields
    - Initialize all address fields as empty strings
    - _Requirements: 2.1_
  
  - [ ] 3.2 Integrate AddressInputSection in signup form
    - Replace simple city/state inputs with AddressInputSection component
    - Wire up onChange handlers for address fields
    - _Requirements: 2.1, 2.4_
  
  - [x] 3.3 Update signup form submission


    - Include all address fields in the profiles insert query
    - Handle validation for required city and state fields
    - _Requirements: 2.2, 2.3_


- [ ] 4. Update Profile Edit Page (ProfileEdit.tsx)
  - [ ] 4.1 Add address fields to profile state
    - Update profile state interface to include address fields
    - Load existing address data in fetchProfile()

    - _Requirements: 3.1_
  
  - [ ] 4.2 Replace location section with AddressInputSection
    - Remove old city/state inputs
    - Add AddressInputSection component in Location Information card

    - Wire up onChange handlers
    - _Requirements: 3.3_
  
  - [x] 4.3 Update profile save handler

    - Include all address fields in the update query
    - Handle optional fields properly
    - _Requirements: 3.2, 3.4_

- [x] 5. Update Land Listing Form (ProfileEdit.tsx - Land Tab)

  - [ ] 5.1 Add address fields to land listing state
    - Update landListing state to include all address fields
    - Initialize address fields as empty strings
    - _Requirements: 4.1_
  



  - [ ] 5.2 Replace location section with AddressInputSection
    - Remove old city/state inputs in land listing form
    - Add AddressInputSection component
    - Wire up onChange handlers for land listing
    - _Requirements: 4.3, 4.5_
  
  - [ ] 5.3 Update land listing submission
    - Include all address fields in land_listings insert query
    - Validate required fields
    - _Requirements: 4.2, 4.4_

- [ ] 6. Update ProfileCard component
  - [ ] 6.1 Update address display in ProfileCard
    - Import formatCompactAddress utility
    - Replace city/state display with formatted address
    - Handle truncation for long addresses
    - Add tooltip or title attribute for full address on hover
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Update ProfileViewModal component
  - [ ] 7.1 Add detailed address section to modal
    - Create dedicated "Location Details" section
    - Display each address field with label
    - Show only populated fields
    - Add complete formatted address at bottom
    - Use grid layout for organized display
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8. Update Land Listing display components
  - [ ] 8.1 Update land listing cards to show complete address
    - Update LandRecords.tsx or relevant land listing components
    - Use formatAddress() or formatCompactAddress() for display
    - Ensure address is visible on listing cards
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [ ] 8.2 Update land listing detail view
    - Show complete address with all fields in detail view
    - Use proper formatting and labels
    - _Requirements: 7.3, 7.5_

- [ ] 9. Run database migration and test
  - [ ] 9.1 Execute SQL migration in Supabase
    - Run the migration script in Supabase SQL Editor
    - Verify columns are added to both tables
    - Test with sample data
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ] 9.2 Test all forms and displays
    - Test signup with complete address
    - Test profile edit with address updates
    - Test land listing creation with address
    - Verify address display on profile cards
    - Verify address display in profile modal
    - Verify address display on land listings
    - Test with missing/partial address data
    - _Requirements: All_
