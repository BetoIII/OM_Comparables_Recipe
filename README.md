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
| `comparables_search_json.json` | **JSON extraction recipe** - Extracts data to JSON format |
| `comparables_search_csv.json` | **CSV extraction recipe** - Extracts data to CSV format |
| `comparables_search_xls.json` | **Excel extraction recipe** - Extracts data to XLS format |
| `comparables-app/` | Next.js web application for viewing comparables (optional) |
| `batch_processing_example.md` | Detailed usage guide and examples |
| `output/` | Generated files from extraction and saved comp sets (gitignored) |
| `output/comp_sets/` | Saved comparable sets (may contain personal data) |
| `README.md` | This file - quick reference guide |

### Output Folder
All generated JSON files are automatically saved to the `output/` folder. This folder is excluded from version control to prevent committing generated data files.

## 🚀 Quick Start

### 1. First-Time Setup (Run Once)

Before extracting comparables for the first time, install dependencies for the web application:

```bash
cd comparables-app
npm install
```

### 2. Start the Web Server (Optional)

The web server is **optional** - you only need it if you want to:
- View extracted comparables in a web interface
- Create and manage comparable sets
- Export data to Excel

To start the server:

```bash
cd comparables-app
npm run dev
```

The server will run on **http://localhost:3001**

**Note:** Keep this terminal window open while using the web interface. Press `Ctrl+C` to stop the server when done.

### 3. Prepare Your PDFs
Place all your Offering Memorandum PDF files in a known location - you'll provide the paths to the extraction recipe.

### 4. Extract Comparables Data

Choose the extraction format that works best for your workflow:

#### Option 1: JSON Format (Recommended for Web App)
Extract data to JSON format - required for web application viewing:

```bash
# Single PDF
goose run comparables_search_json --document_paths "/path/to/OM_Downtown_Property.pdf"

# Multiple PDFs (Batch Processing)
goose run comparables_search_json --document_paths "/path/to/OM1.pdf,/path/to/OM2.pdf,/path/to/OM3.pdf"
```

**Output:** `output/comparables_data.json`

#### Option 2: CSV Format (Best for Analysis)
Extract data to CSV format - ideal for Excel analysis or data processing:

```bash
# Single PDF
goose run comparables_search_csv --document_paths "/path/to/OM_Downtown_Property.pdf"

# Multiple PDFs
goose run comparables_search_csv --document_paths "/path/to/OM1.pdf,/path/to/OM2.pdf"
```

**Output:**
- `output/comparables_data.csv` (properties)
- `output/comparables_data_units.csv` (unit details)
- `output/comparables_data.json` (for web app)

#### Option 3: Excel Format (Ready-Made Reports)
Extract data to multi-sheet Excel workbook - perfect for professional reports:

```bash
# Single PDF
goose run comparables_search_xls --document_paths "/path/to/OM_Downtown_Property.pdf"

# Multiple PDFs
goose run comparables_search_xls --document_paths "/path/to/OM1.pdf,/path/to/OM2.pdf"
```

**Output:**
- `output/comparables_data.xlsx` (multi-sheet workbook)
- `output/comparables_data.json` (for web app)

**Which format should I choose?**
- **JSON** - Use if you primarily work with the web application
- **CSV** - Use for data analysis, importing to other tools, or database loading
- **XLS** - Use for creating immediate professional reports or sharing with stakeholders

#### Batch Processing Examples

**Example 1: Process all OMs in a folder (JSON)**
```bash
# macOS/Linux
goose run comparables_search_json --document_paths "$(find ~/Documents/OMs -name '*.pdf' -type f | paste -sd ',' -)"

# Or manually list files in the same directory
goose run comparables_search_json --document_paths "/Users/yourname/Documents/OMs/Property_A_OM.pdf,/Users/yourname/Documents/OMs/Property_B_OM.pdf,/Users/yourname/Documents/OMs/Property_C_OM.pdf"
```

**Example 2: Process OMs to CSV for analysis**
```bash
goose run comparables_search_csv --document_paths "/Users/yourname/Desktop/OM_Austin.pdf,/Users/yourname/Downloads/OM_Dallas.pdf,/Users/yourname/Documents/Projects/OM_Houston.pdf"
```

**Example 3: Windows batch processing to Excel**
```bash
# Windows (PowerShell)
goose run comparables_search_xls --document_paths "C:\Documents\OM1.pdf,C:\Documents\OM2.pdf,C:\Documents\OM3.pdf"
```

**Tips for batch processing:**
- All PDFs will be processed in a single run
- Results are combined into one output file (JSON, CSV, or XLS)
- All three formats also create a JSON file for web app compatibility
- Processing time: ~30 seconds per PDF
- Maximum recommended: 10-15 PDFs per batch for optimal performance

### 5. View Your Results

#### Web Application (JSON data only)
After running any extraction recipe, open your browser to:
- **Comparables Report:** http://localhost:3001/comparables
- **Comp Sets Manager:** http://localhost:3001/comp-sets

**Export Options in Web App:**
- **Export CSV** - Download current data as CSV
- **Export XLS** - Download current data as Excel workbook
- Both options available regardless of extraction method used

**Web Server (Optional):**
- The extraction recipes work without the web server
- Web server only reads from `comparables_data.json`
- All three extraction formats create this JSON file automatically
- Start server: `cd comparables-app && npm run dev`
- Stop server: Press `Ctrl+C` in the terminal running the server
- Server URL: http://localhost:3001

#### Direct File Access (CSV/XLS)
If you used CSV or XLS extraction:
- **CSV files:** Open `output/comparables_data.csv` and `output/comparables_data_units.csv` directly
- **Excel file:** Open `output/comparables_data.xlsx` directly
- No web server needed for these formats

## 📊 What Gets Extracted

For each comparable property found:
- ✅ Property name and complete address
- ✅ Property type, year built, total units
- ✅ Total square footage
- ✅ Unit mix details (type, sq ft, rent as shown)
- ✅ Notes (amenities, occupancy, distance, etc.)
- ✅ Source document reference

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
1. **First time only:** Install dependencies: `cd comparables-app && npm install`
2. **Optional:** Start web server: `npm run dev` (in comparables-app directory)
3. **Choose and run extraction recipe:**
   - JSON: `goose run comparables_search_json --document_paths "..."`
   - CSV: `goose run comparables_search_csv --document_paths "..."`
   - XLS: `goose run comparables_search_xls --document_paths "..."`
4. **View results:**
   - Web app: http://localhost:3001/comparables (if server is running)
   - Direct files: Open CSV/XLS files from `output/` folder
5. **Save important properties to comp sets before running another extraction**
6. Select properties and create comp sets as needed
7. Manage comp sets at http://localhost:3001/comp-sets

**Recipe Independence:**
- All three extraction recipes work with or without the web server running
- The web server is only needed to VIEW and MANAGE data via the web interface
- All extraction methods create `output/comparables_data.json` for web app compatibility
- CSV and XLS recipes also create their respective format files

## 📝 Notes

- **Three Extraction Formats:** Choose JSON, CSV, or XLS based on your needs
- **Web Server is Optional:** All extraction recipes work without the web server (server only needed to VIEW data)
- **Data Replacement:** Each extraction replaces output files - use comp sets to preserve data
- **Format Compatibility:** All three recipes create `comparables_data.json` for web app access
- **CSV Structure:** Two files created - properties and units (linked by property_name)
- **Excel Structure:** Multi-sheet workbook (Summary, Properties, Unit Details)
- **Server Persistence:** The web server continues running in the background until manually stopped
- **Export from Web App:** CSV and XLS exports available directly from web interface
- The subject property being marketed is NOT included in comparables
- Rent values are captured as shown in documents (e.g., "$1,500/month", "$25/sf/year")
- Properties can have 0 to many units (some may not list unit details)
- Comp sets are stored in `output/comp_sets/` and persist across recipe runs
- Server logs are written to `/tmp/nextjs-comparables.log` for troubleshooting

## 🔧 Troubleshooting

### Web Server Won't Start

**Problem:** Server fails to start or port 3001 is in use

**Solutions:**
```bash
# 1. Check if port 3001 is in use by another application
lsof -i :3001

# 2. If another app is using port 3001, kill it
lsof -ti :3001 | xargs kill

# 3. Try starting the server again
cd comparables-app
npm run dev

# 4. If dependencies are missing, reinstall
cd comparables-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Common Causes:**
- Port 3001 is in use by another application
- Node.js version incompatibility (requires Node 18+)
- Missing or corrupted dependencies
- npm not installed or outdated
- Permission issues with `/tmp/nextjs-comparables.log`

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
1. Verify you've run an extraction recipe:
   - `goose run comparables_search_json --document_paths "..."`
   - or `goose run comparables_search_csv --document_paths "..."`
   - or `goose run comparables_search_xls --document_paths "..."`
2. Check that `output/comparables_data.json` exists (all recipes create this)
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
2. Check that `output/comp_sets/` folder exists and is writable
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

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Follow coding standards

---

## 📦 Output Formats Summary

| Format | Files Created | Best For | Web App Compatible |
|--------|--------------|----------|-------------------|
| **JSON** | `comparables_data.json` | Web application use, API integration | ✅ Yes (primary) |
| **CSV** | `comparables_data.csv`<br>`comparables_data_units.csv`<br>`comparables_data.json` | Data analysis, Excel import, database loading | ✅ Yes |
| **XLS** | `comparables_data.xlsx`<br>`comparables_data.json` | Professional reports, immediate sharing | ✅ Yes |

**All formats support:**
- Batch processing multiple PDFs
- Same extraction schema and data quality
- Export options from web interface
- Comp set management

---

**Version:** 4.0
**Last Updated:** October 2025
