# View Comp Sets Recipe - User Guide

## Overview

The **View Comp Sets** recipe allows you to interactively view and manage saved comp sets with full property details in a beautiful HTML interface.

## What's New

### 1. Enhanced API Endpoints (server.js)

Four new API endpoints have been added to support comp set management:

- **GET `/api/comp-sets/:name`** - Retrieve a specific comp set with enriched property data
- **DELETE `/api/comp-sets/:name`** - Delete an entire comp set
- **PUT `/api/comp-sets/:name`** - Rename a comp set or update its properties
- **DELETE `/api/comp-sets/:name/properties/:propertyId`** - Remove a single property from a comp set

### 2. New Recipe: view_comp_sets.json

An interactive recipe that:
- Lists all available comp sets
- Prompts you to select which one to view
- Enriches property data from `comparables_data.json`
- Generates a beautiful HTML report at `output/view_comp_set_{name}.html`

### 3. New HTML Template: view_comp_set_template.html

A specialized template featuring:
- Comp set name prominently displayed
- Summary statistics for the comp set
- Management toolbar with Rename/Delete buttons
- Property cards with full details
- "Remove from Comp Set" buttons on each card
- "Add to Other Comp Set" functionality
- Warning badges for properties with missing data
- Confirmation dialogs for destructive actions

## How to Use

### Step 1: Start the Server

```bash
cd /Users/betojuareziii/Applications/Goose\ Recipes/OM_Comparables_Recipe
node server.js
```

The server should start on port 3000.

### Step 2: Run the Recipe

Using Goose:

```bash
goose run view_comp_sets
```

The recipe will:
1. Show you a list of available comp sets
2. Ask you to select which one to view
3. Generate an HTML file: `output/view_comp_set_{name}.html`
4. Provide a clickable link to open the HTML file

### Step 3: Interact with Your Comp Set

The generated HTML file allows you to:

#### View Properties
- See all properties in the comp set with full details
- Properties enriched with data from `comparables_data.json`
- Properties without full data show an orange "⚠ Data Not Found" badge

#### Manage the Comp Set
- **Rename**: Click "🏷️ Rename" button in toolbar
- **Delete**: Click "🗑️ Delete Comp Set" button (with confirmation)

#### Manage Properties
- **Remove**: Click red "🗑️ Remove from {Comp Set Name}" button on any card
- **Add to Other**: Select another comp set from dropdown and click green "➕ Add to Other Comp Set" button

## Features

### Interactive Features
- ✅ Server status indicator (online/offline)
- ✅ Toast notifications for all actions
- ✅ Confirmation dialogs for destructive actions
- ✅ Real-time property removal (cards fade out)
- ✅ Sticky toolbar that follows you as you scroll
- ✅ Responsive design (works on mobile)

### Data Enrichment
- ✅ Matches comp set properties with full data from `comparables_data.json`
- ✅ Displays comprehensive property information
- ✅ Gracefully handles missing data with warning badges
- ✅ Shows all unit mix details, amenities, and occupancy rates

### Comp Set Management
- ✅ Rename comp sets
- ✅ Delete comp sets
- ✅ Remove individual properties
- ✅ Add properties to other comp sets
- ✅ Create new comp sets on the fly

## File Structure

```
OM_Comparables_Recipe/
├── server.js                          # Updated with new API endpoints
├── comparables_search.json            # Original extraction recipe
├── view_comp_sets.json                # New viewing recipe
├── sample_html_template.html          # Original template
├── view_comp_set_template.html        # New comp set viewer template
├── comp_sets/                         # Saved comp sets
│   └── sa-downtown.json               # Example comp set
└── output/                            # Generated reports
    ├── comparables_data.json          # Full property data
    ├── comparables_report.html        # From extraction recipe
    └── view_comp_set_{name}.html      # From view recipe
```

## API Reference

### Get Specific Comp Set
```
GET /api/comp-sets/:name
Response: {
  name: string,
  properties: Array<Property>,
  metadata: Object,
  summary: Object
}
```

### Delete Comp Set
```
DELETE /api/comp-sets/:name
Response: { message: "Comp set deleted successfully" }
```

### Rename/Update Comp Set
```
PUT /api/comp-sets/:name
Body: { newName?: string, properties?: Array<Property> }
Response: { message: "Comp set renamed successfully", newName?: string }
```

### Remove Property from Comp Set
```
DELETE /api/comp-sets/:name/properties/:propertyId
Response: { message: "Property removed successfully" }
```

## Troubleshooting

### Server is Offline
- Make sure you run `node server.js` before opening the HTML file
- Check that port 3000 is not being used by another application
- Look for error messages in the server console

### Properties Show "Data Not Found"
- This means the property ID in the comp set doesn't match any property in `comparables_data.json`
- Run the `comparables_search` recipe again to refresh your data
- Check that property IDs are consistent between comp sets and data file

### Comp Set Not Found
- Verify the comp set file exists in the `comp_sets/` directory
- Check file naming (should be `{name}.json`)
- Ensure the JSON file is properly formatted

## Tips

1. **Server Must Be Running**: The HTML file needs the server running for all interactive features (rename, delete, remove, add to other)
2. **Keep Data Fresh**: Re-run the extraction recipe periodically to keep `comparables_data.json` up to date
3. **Backup**: Comp sets are just JSON files in `comp_sets/` - back them up if needed
4. **Multiple Views**: You can generate HTML views for multiple comp sets and compare them side by side

## Example Workflow

1. Extract comparables from OMs: `goose run comparables_search`
2. Create comp sets using the generated HTML report
3. View a specific comp set: `goose run view_comp_sets`
4. Select the comp set you want to view
5. Open the generated HTML file
6. Manage your comp set interactively

---

**Questions or Issues?** Check the server console for detailed error logs.
