# Loan Master Data, CSV Templates, and Dashboard Year Filter Design

## Scope

Add three connected capabilities to the PCAF app:

1. A combined Loan Configuration master table that shows all configured loans across asset classes.
2. Master Data management for dropdown values used by loan configuration and CSV import.
3. A Dashboard year filter/toggle that updates KPIs and charts by reporting year.

The implementation should preserve the existing asset-class-specific tabs and imports while adding a broader management layer.

## Current Context

Loan configurations are stored in `loan_configurations` with common columns and asset-specific fields in `extra_data`. The frontend currently hardcodes loan configuration dropdown options such as sectors and asset classes. CSV import validation is also frontend-local and uses hardcoded asset class values. Dashboard data is loaded from the backend without a year selector in the UI.

There are existing loan configuration tabs for:

- Business Loans
- Commercial Real Estate
- Motor Vehicle
- Mortgage

Business Loans currently has the richest add/edit modal. Other asset classes are mainly displayed and deleted.

## Recommended Approach

Implement Master Data as a backend-backed table and API, then consume it in the frontend for dropdowns and import validation.

This is preferable to adding more frontend constants because admins need to add, edit, select, and deactivate dropdown values without code changes.

## Backend Design

Add a `master_data` table:

- `id`
- `category`
- `value`
- `label`
- `is_active`
- `sort_order`
- `created_at`
- `updated_at`

Initial categories:

- `asset_class`
- `country`
- `city`
- `sector`
- `borrower_type`
- `loan_status`
- `company_type`
- `property_category`
- `property_type`
- `vehicle_type`
- `fuel_type`
- `data_quality`

Add backend repository/service/controller/routes for:

- List all master data grouped by category.
- List active options for one category.
- Create an option.
- Update an option.
- Deactivate/delete an option.

Seed default values from the hardcoded values and seed loan examples. Existing data should continue to render even if a value is later inactive.

## Frontend Design

### Loan Configuration Master Table

Add a `Master Table` tab before existing asset-class tabs.

The table shows:

- Loan ID
- Asset Class
- Borrower Name
- Borrower Type
- Sector
- City
- Country
- Registration Number
- Loan Amount
- Loan Tenure
- Start Date
- End Date
- Status
- Asset-specific summary fields
- Actions

Asset-specific summary fields should display compactly:

- Business Loans: Type of Company
- Commercial Real Estate: Property ID, Property Type, Property Value, Floor Area Financed
- Motor Vehicle: Vehicle Type, Vehicle Number, Make/Model, Fuel Type, Vehicle Value
- Mortgage: Building Name, Property Type, Property Value, Floor Area

Keep existing per-asset tabs for focused views.

### Master Data UI

Place Master Data in the existing Settings area first. Add a new settings section/tab named `Master Data`.

The UI should allow:

- Select category.
- View active/inactive values.
- Add a new value.
- Edit label/value/sort order.
- Toggle active/inactive.

Avoid deleting records physically in the first version unless there are no references. Soft deactivation is safer.

### Dropdown Consumption

Update loan configuration forms to fetch master data and use it for dropdowns. At minimum, replace hardcoded values for:

- Asset Class
- Sector
- Country
- City
- Borrower Type
- Loan Status
- Type of Company

Where a form currently does not exist for an asset class, keep the existing UI but make import validation use master data.

## CSV Import Design

Add template support in the Import CSV modal.

Templates:

- All Loans Master
- Business Loans
- Commercial Real Estate
- Motor Vehicle
- Mortgage
- Master Data

Each template should be downloadable from the modal.

CSV validation should:

- Require common fields: `Loan ID`, `Asset Class`, `Borrower Name`.
- Validate asset class against active master data.
- Validate dropdown fields against active master data when the field is provided.
- Reject inactive master data values during CSV import, even if similar values exist on older records.
- Continue validating numeric fields.
- Continue detecting duplicate Loan IDs inside the uploaded CSV.

The parser should map headers case-insensitively and tolerate spaces/underscores as it does today.

## Dashboard Year Filter

Add a year selector/toggle near the Dashboard page header.

Behavior:

- Derive available years from capture activity periods returned by the backend, or fetch from a lightweight dashboard metadata endpoint if needed.
- Default to the latest available year.
- Dashboard KPIs, charts, and rankings should update based on the selected year.
- If no data exists for the selected year, show empty states instead of stale totals.

Backend can support this by accepting a `year` query parameter on dashboard APIs and filtering `data_captures.activity_period`.

## Data Flow

1. App loads master data from the backend.
2. Loan forms and import modal use active master data options.
3. CSV import validates rows in the frontend before POST.
4. Backend import still validates required fields and performs upsert.
5. Dashboard loads data with selected year and re-fetches when the year changes.

## Error Handling

- Master data fetch failure: show toast and keep existing fallback defaults if available.
- Duplicate master data value in same category: backend returns a validation error.
- CSV invalid values: show row-level validation errors before upload.
- Dashboard year with no data: show empty dashboard states with selected year visible.

## Testing

Add focused tests where the project supports them. If no test runner exists, add pure helper modules that can be type-checked and manually verified.

Test targets:

- CSV template generation includes expected headers for every case.
- CSV parser maps aliases and validates master data options.
- Master data option grouping returns active values in sort order.
- Dashboard year filtering sends the selected year and handles empty results.

## Implementation Order

1. Add shared master data constants/types and backend table/API.
2. Seed default master data.
3. Add frontend master data API hook.
4. Add Master Table tab in Loan Configuration.
5. Update Import CSV modal with template download and master data validation.
6. Add Settings Master Data UI.
7. Add Dashboard year selector and backend year filtering.
8. Run build/type-check and any available tests.

## Out Of Scope For First Pass

- Full add/edit modal for every asset class.
- Historical tracking of master data option changes.
- Complex dependency rules such as city-by-country filtering.
- Physical deletion of master data values with existing references.

