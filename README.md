# OM Comparables Extraction Recipe

## 🎯 Purpose
Automatically extract comparable properties data from Offering Memorandum (OM) documents and view them in a modern Next.js web application with interactive property management.

## 📁 Repository Structure

| File/Folder | Description |
|------|-------------|
| `comparables_search.json` | Main recipe configuration file for Goose |
| `comparables-app/` | Next.js web application for viewing comparables |
| `batch_processing_example.md` | Detailed usage guide and examples |
| `output/` | Generated JSON data from extraction (gitignored) |
| `comp_sets/` | Saved comparable sets (gitignored - may contain personal data) |
| `README.md` | This file - quick reference guide |

### Output Folder
All generated JSON files are automatically saved to the `output/` folder. This folder is excluded from version control to prevent committing generated data files.

## 🚀 Quick Start

### 1. Start the Next.js App
Before running any recipes, start the Next.js app:

```bash
cd comparables-app
npm install
npm run dev
```

The app will start on **http://localhost:3001**

### 2. Prepare Your PDFs
Place all your Offering Memorandum PDF files in a known location.

### 3. Run the Recipe
Use the recipe with an array of PDF file paths:

```bash
goose run search_comps --document_paths "/path/to/OM1.pdf,/path/to/OM2.pdf"
```

### 4. View Your Results
After the recipe completes, open your browser to:
- **Comparables Report:** http://localhost:3001/comparables
- **Comp Sets Manager:** http://localhost:3001/comp-sets

## 📊 What Gets Extracted

For each comparable property found:
- ✅ Property name and complete address
- ✅ Property type, year built, total units
- ✅ Total square footage
- ✅ Unit mix details (type, sq ft, rent as shown)
- ✅ Notes (amenities, occupancy, distance, etc.)
- ✅ Source document reference

## 🎨 Next.js App Features

### Comparables Report Page (`/comparables`)
- **Summary Dashboard** - Total properties, units, documents processed, avg year built
- **Property Cards** - Each comparable in a clean, organized card
- **Checkbox Selection** - Select multiple properties for comp sets
- **Comp Set Toolbar** - Create new comp sets or add to existing ones
- **Responsive Design** - Works on all devices
- **Color Coding** - Property types have distinct colors
- **Interactive Tables** - Unit mix data in clean tables
- **Source Tracking** - See which OM each property came from

### Comp Sets Manager (`/comp-sets`)
- **List View** - See all your saved comp sets
- **Detail View** - View individual comp sets with full property details
- **Rename/Delete** - Manage comp set names
- **Remove Properties** - Remove individual properties from comp sets
- **Data Enrichment** - Automatically enriches comp set data with full property details

## 📋 Property Card Contents

Each card displays:
```
┌─────────────────────────────────────┐
│ [✓] Checkbox         [Property Type]│
│                                     │
│ Property Name                       │
│ Full Address                        │
├─────────────────────────────────────┤
│ Year Built: 2018                    │
│ Total Units: 271                    │
│ Total Square Feet: 245,000 SF       │
├─────────────────────────────────────┤
│ Unit Mix:                           │
│ ┌──────────┬──────────┬──────────┐ │
│ │ Unit Type│ Rent     │ Sq Ft    │ │
│ ├──────────┼──────────┼──────────┤ │
│ │ 1BR      │ $1,091/mo│ 646      │ │
│ │ 2BR      │ $1,811/mo│ 1,213    │ │
│ └──────────┴──────────┴──────────┘ │
├─────────────────────────────────────┤
│ Notes: Pool, Gym, 94% occupied,    │
│ 2.8 mi from subject                 │
├─────────────────────────────────────┤
│ Source: OM - Property Name.pdf      │
└─────────────────────────────────────┘
```

## 🔍 Data Extraction Coverage

The recipe looks for sections titled:
- Market Comparables
- Competitive Set
- Comparable Properties
- Market Analysis
- Rent Comparables
- Market Survey
- Similar variations

## 💡 Use Cases

1. **Market Analysis** - Compare multiple properties across different OMs
2. **Investment Research** - Analyze competitive sets for potential acquisitions
3. **Portfolio Review** - Track comparable properties for existing assets
4. **Comp Set Creation** - Build custom comparison sets for specific analyses
5. **Due Diligence** - Compile market data from multiple sources

## 🎯 Best Practices

### Workflow
1. Start Next.js app (`cd comparables-app && npm run dev`)
2. Run Goose recipe to extract data
3. View results at http://localhost:3001/comparables
4. Select properties and create comp sets
5. Manage comp sets at http://localhost:3001/comp-sets

### File Organization
```
/Project/
  /OMs/
    OM_Property_A.pdf
    OM_Property_B.pdf
    OM_Property_C.pdf
  /output/
    comparables_data.json
  /comp_sets/
    downtown-comps.json
    suburban-comps.json
  /comparables-app/
    (Next.js application)
```

### Quality Checks
- ✅ Verify all PDFs are readable
- ✅ Check that PDFs contain comparable sections
- ✅ Review the summary section for any issues
- ✅ Validate unit counts and rent data in the app

## 📈 Example Output Statistics

```
Total Documents Processed: 4
Total Comparable Properties: 45
Total Units Extracted: 156
Property Types: Multifamily, Office, Mixed-Use
Average Processing Time: ~30 seconds per document
```

## 🔧 Technology Stack

- **Backend:** Next.js API Routes (replaces Express server)
- **Frontend:** React with TypeScript
- **Styling:** CSS modules with gradient design
- **Data Storage:** File-based JSON (comp_sets/, output/)
- **Extraction:** Goose AI recipe with PDF reader

## 🆕 Recent Updates (v3.0)

- ✅ Migrated from static HTML to Next.js app
- ✅ Added interactive comp set management
- ✅ Implemented API routes for CRUD operations
- ✅ Simplified data schema (flat address, string-based rent)
- ✅ Removed individual "Add" buttons in favor of checkbox-only workflow
- ✅ Deprecated HTML generation (use Next.js app instead)
- ✅ Added TypeScript for better type safety

## 📝 Notes

- The subject property being marketed is NOT included in comparables
- Rent values are captured as shown in documents (e.g., "$1,500/month", "$25/sf/year")
- Properties can have 0 to many units (some may not list unit details)
- The Next.js app must be running before you view results
- Old HTML files are no longer generated by default

## 🛠️ Development

### Next.js App Structure
```
comparables-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── comparables/       # Comparables report page
│   └── comp-sets/         # Comp sets pages
├── components/            # React components
│   ├── PropertyCard.tsx
│   ├── SummaryStats.tsx
│   ├── CompSetToolbar.tsx
│   └── Toast.tsx
├── lib/                   # Utilities
│   ├── types.ts          # TypeScript interfaces
│   └── api.ts            # API client functions
├── pages/api/            # API routes
│   ├── comparables.ts
│   └── comp-sets/
└── styles/
    └── globals.css       # Global styles
```

---

**Version:** 3.0
**Last Updated:** October 2024
**Supported Property Types:** Multifamily, Office, Retail, Industrial, Mixed-Use
**Tech Stack:** Next.js 14, React 18, TypeScript 5
