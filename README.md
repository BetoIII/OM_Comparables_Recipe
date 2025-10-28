# Comparables Recipe
This project allows users to analyze comparable properties and manage customizable "Comp Sets".

## Features
- Select properties using checkboxes.
- Create and save comp sets as JSON files.
- Retrieve existing comp sets.
# OM Comparables Extraction Recipe

## 🎯 Purpose
Automatically extract comparable properties data from Offering Memorandum (OM) documents and generate a beautiful HTML report with property cards.

## 📁 Repository Structure

| File/Folder | Description |
|------|-------------|
| `comparables_search.json` | Main recipe configuration file for Goose |
| `batch_processing_example.md` | Detailed usage guide and examples |
| `sample_html_template.html` | Visual example of the HTML output |
| `server.js` | Express server for comp set management |
| `index.html` | UI for managing comparable sets |
| `output/` | Generated reports and extracted data (gitignored) |
| `comp_sets/` | Saved comparable sets (gitignored - may contain personal data) |
| `node_modules/` | NPM dependencies (gitignored) |
| `README.md` | This file - quick reference guide |

### Output Folder
All generated files (JSON data, HTML reports, extracted text) are automatically saved to the `output/` folder. This folder is excluded from version control to prevent committing generated data files.

## 🚀 Quick Start

### 1. Prepare Your PDFs
Place all your Offering Memorandum PDF files in a known location.

### 2. Run the Recipe
Use the recipe with an array of PDF file paths:

```json
{
  "document_paths": [
    "/path/to/OM1.pdf",
    "/path/to/OM2.pdf",
    "/path/to/OM3.pdf"
  ]
}
```

### 3. Get Your Results
The recipe will generate:
- **JSON file** - Structured data for analysis
- **HTML report** - Visual report with property cards

## 📊 What Gets Extracted

For each comparable property found:
- ✅ Property name and complete address
- ✅ Property type, year built, total units
- ✅ Occupancy rate and distance from subject
- ✅ Amenities list
- ✅ Unit mix details (type, sq ft, rent, $/SF)
- ✅ Source document reference
- ✅ Additional notes

## 🎨 HTML Report Features

The generated HTML report includes:
- **Summary Dashboard** - Total properties, units, documents processed
- **Property Cards** - Each comparable in a clean, organized card
- **Responsive Design** - Works on all devices
- **Color Coding** - Property types have distinct colors
- **Interactive Tables** - Unit mix data in sortable format
- **Source Tracking** - See which OM each property came from

## 📋 Property Card Contents

Each card displays:
```
┌─────────────────────────────────────┐
│ Property Name                       │
│ Address                             │
│ [Property Type Badge]               │
├─────────────────────────────────────┤
│ Year Built: 2018                    │
│ Total Units: 271                    │
│ Occupancy: 94.1%                    │
│ Distance: 2.8 mi                    │
├─────────────────────────────────────┤
│ Amenities:                          │
│ [Pool] [Gym] [Parking]              │
├─────────────────────────────────────┤
│ Unit Mix:                           │
│ ┌──────┬──────┬────────┬──────┐    │
│ │ Type │ SqFt │ Rent   │ $/SF │    │
│ ├──────┼──────┼────────┼──────┤    │
│ │ 1BR  │ 646  │ $1,091 │ 1.69 │    │
│ │ 2BR  │ 1213 │ $1,811 │ 1.49 │    │
│ └──────┴──────┴────────┴──────┘    │
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
4. **Presentation Materials** - Generate professional reports for stakeholders
5. **Due Diligence** - Compile market data from multiple sources

## 🎯 Best Practices

### File Organization
```
/Project/
  /OMs/
    OM_Property_A.pdf
    OM_Property_B.pdf
    OM_Property_C.pdf
  /Output/
    extracted_comparables.json
    comparables_report.html
```

### Naming Conventions
- Use descriptive OM filenames
- Include property address or name in filename
- Keep PDFs in a dedicated folder

### Quality Checks
- ✅ Verify all PDFs are readable
- ✅ Check that PDFs contain comparable sections
- ✅ Review the summary section for any issues
- ✅ Validate occupancy rates and rent data

## 📈 Example Output Statistics

```
Total Documents Processed: 4
Total Comparable Properties: 45
Total Units Extracted: 156
Property Types: Multifamily, Office, Mixed-Use
Average Processing Time: ~30 seconds per document
```

## 🔧 Customization

The HTML template can be customized for:
- Company branding
- Different color schemes
- Additional data fields
- Custom metrics and calculations

## 📞 Support

For issues or questions:
1. Check the `batch_processing_example.md` for detailed examples
2. Review the `sample_html_template.html` for visual reference
3. Examine the JSON schema in the recipe file

## 🆕 Recent Updates

- ✅ Added batch processing support
- ✅ Implemented HTML report generation
- ✅ Added source document tracking
- ✅ Included duplicate property detection
- ✅ Enhanced error handling

## 📝 Notes

- The subject property being marketed is NOT included in comparables
- Rent values are captured as provided (monthly or annual)
- Properties can have 0 to many units (some may not list unit details)
- Survey dates may not always be explicitly stated

---

**Version:** 2.0  
**Last Updated:** October 2024  
**Supported Property Types:** Multifamily, Office, Retail, Industrial, Mixed-Use
