# OM Comparables Extraction Recipe

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 🎯 Purpose
Automatically extract comparable properties data from Offering Memorandum (OM) documents and view them in a modern Next.js web application with interactive property management.

## ✅ Prerequisites

Before using this recipe, ensure you have:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Goose AI** account and CLI installed ([Setup Guide](https://docs.goose.ai))
- **PDF Documents** - Offering Memorandums in PDF format
- **Basic Terminal Knowledge** - Ability to run commands in terminal/command prompt

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

#### Single PDF
Process one Offering Memorandum:

```bash
goose run search_comps --document_paths "/path/to/OM_Downtown_Property.pdf"
```

#### Multiple PDFs (Batch Processing)
Process multiple OMs at once - separate paths with commas (no spaces):

```bash
goose run search_comps --document_paths "/path/to/OM1.pdf,/path/to/OM2.pdf,/path/to/OM3.pdf"
```

#### Batch Processing Examples

**Example 1: Process all OMs in a folder**
```bash
# macOS/Linux
goose run search_comps --document_paths "$(find ~/Documents/OMs -name '*.pdf' -type f | paste -sd ',' -)"

# Or manually list files in the same directory
goose run search_comps --document_paths "/Users/yourname/Documents/OMs/Property_A_OM.pdf,/Users/yourname/Documents/OMs/Property_B_OM.pdf,/Users/yourname/Documents/OMs/Property_C_OM.pdf"
```

**Example 2: Process OMs from different locations**
```bash
goose run search_comps --document_paths "/Users/yourname/Desktop/OM_Austin.pdf,/Users/yourname/Downloads/OM_Dallas.pdf,/Users/yourname/Documents/Projects/OM_Houston.pdf"
```

**Example 3: Windows batch processing**
```bash
# Windows (PowerShell)
goose run search_comps --document_paths "C:\Documents\OM1.pdf,C:\Documents\OM2.pdf,C:\Documents\OM3.pdf"
```

**Tips for batch processing:**
- All PDFs will be processed in a single run
- Results are combined into one `comparables_data.json` file
- Processing time: ~30 seconds per PDF
- Maximum recommended: 10-15 PDFs per batch for optimal performance

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

## ⚠️ Important: Data Replacement Behavior

**Each recipe run REPLACES the previous data in `output/comparables_data.json`.**

- The `/comparables` page shows only the LATEST extraction results
- Previous data is **not preserved** unless saved to a comp set
- This is intentional: each run represents a fresh analysis

### Preserving Data
To keep properties from being lost:
1. View results at http://localhost:3001/comparables
2. Select properties you want to save
3. Click "Add Selected to Comp Set"
4. Create a new comp set or add to existing one
5. Access saved comp sets at http://localhost:3001/comp-sets

## 🎯 Best Practices

### Workflow
1. Start Next.js app (`cd comparables-app && npm run dev`)
2. Run Goose recipe to extract data
3. View results at http://localhost:3001/comparables
4. **Save important properties to comp sets before running another extraction**
5. Select properties and create comp sets as needed
6. Manage comp sets at http://localhost:3001/comp-sets

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

- **Data Replacement:** Each recipe run replaces `comparables_data.json` - use comp sets to preserve data
- The subject property being marketed is NOT included in comparables
- Rent values are captured as shown in documents (e.g., "$1,500/month", "$25/sf/year")
- Properties can have 0 to many units (some may not list unit details)
- The Next.js app must be running before you view results
- Old HTML files are no longer generated by default
- Comp sets are stored separately in `comp_sets/` and persist across recipe runs

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

## 🔧 Troubleshooting

### Next.js App Won't Start

**Problem:** `npm run dev` fails or port 3001 is already in use

**Solutions:**
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill the process using port 3001
kill -9 <PID>

# Or change the port in package.json
"dev": "next dev -p 3002"
```

### No Data Showing in App

**Problem:** Comparables page shows "No data available"

**Solutions:**
1. Verify you've run the recipe: `goose run search_comps --document_paths "..."`
2. Check that `output/comparables_data.json` exists
3. Verify the Next.js app is looking in the correct directory
4. Check browser console for API errors

### Properties Missing from Extraction

**Problem:** Some properties aren't being extracted from PDFs

**Solutions:**
1. Verify PDFs have a "Comparables" or "Market Analysis" section
2. Check PDF is readable (not scanned image without OCR)
3. Try re-running with individual PDFs to isolate the issue
4. Review the Goose AI logs for extraction errors

### Comp Set Not Saving

**Problem:** "Add to Comp Set" fails or properties don't appear

**Solutions:**
1. Verify the Next.js app is running
2. Check that `comp_sets/` folder exists and is writable
3. Look for errors in browser console
4. Verify API route is accessible: `curl http://localhost:3001/api/comp-sets`

### Build Errors

**Problem:** TypeScript or Next.js build errors

**Solutions:**
```bash
# Clear Next.js cache and reinstall
cd comparables-app
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this tool freely for personal or commercial use. Attribution is appreciated but not required.

---

## 💬 Support

- **Issues:** Report bugs or request features via [GitHub Issues](https://github.com/BetoIII/OM_Comparables_Recipe/issues)
- **Discussions:** Ask questions or share ideas in [GitHub Discussions](https://github.com/BetoIII/OM_Comparables_Recipe/discussions)
- **Documentation:** Check the [batch_processing_example.md](batch_processing_example.md) for detailed examples

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Follow coding standards

---

**Version:** 3.0
**Last Updated:** January 2025
**Supported Property Types:** Multifamily, Office, Retail, Industrial, Mixed-Use
**Tech Stack:** Next.js 14, React 18, TypeScript 5
