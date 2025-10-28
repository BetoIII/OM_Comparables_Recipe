# OM Comparables Extraction Workflow

## 📋 Complete Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: INPUT                            │
│                                                              │
│  Multiple OM PDF Files                                      │
│  ├── OM_Property_A.pdf                                      │
│  ├── OM_Property_B.pdf                                      │
│  ├── OM_Property_C.pdf                                      │
│  └── OM_Property_D.pdf                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                STEP 2: PDF READING                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ PDF Reader   │→ │ Text Extract │→ │ Parse Content│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Extract text from each PDF document                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 3: SECTION IDENTIFICATION                   │
│                                                              │
│  Search for sections:                                       │
│  ✓ Market Comparables                                       │
│  ✓ Competitive Set                                          │
│  ✓ Market Analysis                                          │
│  ✓ Rent Comparables                                         │
│  ✓ Similar property sections                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: DATA EXTRACTION                        │
│                                                              │
│  For each comparable property found:                        │
│                                                              │
│  ┌─────────────────────────────────────────┐               │
│  │ Property Details:                       │               │
│  │ • Name, Address                         │               │
│  │ • Type, Year Built, Units               │               │
│  │ • Occupancy Rate, Distance              │               │
│  └─────────────────────────────────────────┘               │
│                    ↓                                        │
│  ┌─────────────────────────────────────────┐               │
│  │ Amenities:                              │               │
│  │ • Pool, Gym, Parking                    │               │
│  │ • Pet Friendly, Lounges, etc.           │               │
│  └─────────────────────────────────────────┘               │
│                    ↓                                        │
│  ┌─────────────────────────────────────────┐               │
│  │ Unit Data (0 to many):                  │               │
│  │ • Unit Type (Studio, 1BR, 2BR)          │               │
│  │ • Square Feet                           │               │
│  │ • Rent Amount & Period                  │               │
│  │ • Rent per SF                           │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 5: SOURCE TRACKING                          │
│                                                              │
│  Tag each property with:                                    │
│  • Source document filename                                 │
│  • Subject property info                                    │
│  • Document reference                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│           STEP 6: DATA AGGREGATION                          │
│                                                              │
│  Combine all extracted properties into:                     │
│  • Single comparable_properties array                       │
│  • Document sources list                                    │
│  • Identify duplicates across documents                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│          STEP 7: SUMMARY GENERATION                         │
│                                                              │
│  Calculate statistics:                                      │
│  • Total documents processed                                │
│  • Total comparable properties                              │
│  • Total units extracted                                    │
│  • Property types found                                     │
│  • Issues encountered                                       │
│  • Duplicate properties                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 8: JSON OUTPUT                              │
│                                                              │
│  Create structured JSON file:                               │
│  extracted_comparables_[timestamp].json                     │
│                                                              │
│  {                                                           │
│    "survey_metadata": {...},                                │
│    "comparable_properties": [...],                          │
│    "document_sources": [...],                               │
│    "summary": {...}                                          │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│          STEP 9: HTML GENERATION ✨ NEW!                    │
│                                                              │
│  Create HTML Report:                                        │
│  comparables_report.html                                    │
│                                                              │
│  ┌─────────────────────────────────────┐                   │
│  │ HEADER SECTION                      │                   │
│  │ • Summary statistics dashboard      │                   │
│  │ • Key metrics (cards with numbers)  │                   │
│  └─────────────────────────────────────┘                   │
│                    ↓                                        │
│  ┌─────────────────────────────────────┐                   │
│  │ PROPERTY CARDS GRID                 │                   │
│  │                                      │                   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐         │                   │
│  │ │Card 1│ │Card 2│ │Card 3│  ...    │                   │
│  │ └──────┘ └──────┘ └──────┘         │                   │
│  │                                      │                   │
│  │ Each card contains:                 │                   │
│  │ • Property header with name         │                   │
│  │ • Address and type badge            │                   │
│  │ • Property details table            │                   │
│  │ • Amenities tags                    │                   │
│  │ • Units table                        │                   │
│  │ • Source document reference         │                   │
│  │ • Notes section                      │                   │
│  └─────────────────────────────────────┘                   │
│                                                              │
│  Styling Features:                                          │
│  • Responsive grid layout                                   │
│  • Color-coded property types                               │
│  • Hover effects on cards                                   │
│  • Mobile-friendly design                                   │
│  • Professional color scheme                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  STEP 10: DELIVERY                          │
│                                                              │
│  Output Files Created:                                      │
│  ├── extracted_comparables_[timestamp].json                │
│  │   (Machine-readable data)                                │
│  │                                                           │
│  └── comparables_report.html                                │
│      (Human-readable visual report)                         │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features at Each Step

### Step 1-2: Input & Reading
- Supports multiple PDF files simultaneously
- Handles protected and unprotected PDFs
- Extracts text content from all pages

### Step 3-4: Identification & Extraction
- Pattern matching for comparable sections
- Intelligent parsing of property data
- Handles various table formats
- Captures unit-level details

### Step 5-6: Tracking & Aggregation
- Links each property to source document
- Combines data from multiple OMs
- Maintains data integrity

### Step 7-8: Analysis & JSON
- Calculates comprehensive statistics
- Identifies duplicate properties
- Creates structured, schema-compliant JSON

### Step 9: HTML Generation (NEW!)
- Transforms JSON into visual cards
- Applies professional styling
- Ensures responsive design
- Creates self-contained HTML file

### Step 10: Delivery
- Two complementary output formats
- JSON for data processing
- HTML for presentation

## 📊 Data Flow Example

```
INPUT: 3 OM PDFs
    ↓
EXTRACT: 14, 8, 12 properties respectively
    ↓
AGGREGATE: 34 total properties (with 2 duplicates noted)
    ↓
ANALYZE: 
  • 34 properties
  • 98 units
  • 3 property types
  • 2 duplicates
    ↓
OUTPUT: 
  • JSON: Complete structured data
  • HTML: 34 property cards in grid layout
```

## 🔄 Error Handling

```
┌─────────────────────────────────┐
│ Document Processing Failed?     │
└─────────────────────────────────┘
             ↓
    ┌────────┴────────┐
    │                 │
   YES               NO
    │                 │
    ↓                 ↓
Continue with    Process normally
other docs
    │                 │
    ↓                 │
Add to issues_       │
encountered          │
    │                 │
    └────────┬────────┘
             ↓
    Still generate
    complete output
```

## ⏱️ Performance Metrics

| Metric | Typical Value |
|--------|---------------|
| PDF Reading | ~5-10 seconds per document |
| Data Extraction | ~10-20 seconds per document |
| JSON Generation | ~1 second |
| HTML Generation | ~2-5 seconds |
| **Total Time** | **~30-60 seconds per document** |

## 💡 Tips for Optimal Results

1. **Pre-Processing**
   - Ensure PDFs are text-based (not scanned images)
   - Check that comparable sections exist
   - Verify file paths are absolute

2. **During Processing**
   - Recipe handles batch processing automatically
   - No manual intervention needed
   - Progress tracked internally

3. **Post-Processing**
   - Review JSON for data accuracy
   - Open HTML in browser for visual review
   - Check summary section for any issues

## 🎨 HTML Customization Points

The HTML output can be customized by modifying:

1. **Color Scheme** - Change gradient and property type colors
2. **Card Layout** - Adjust grid columns and spacing
3. **Typography** - Modify fonts and sizes
4. **Metrics Display** - Add/remove summary statistics
5. **Card Contents** - Show/hide specific data fields

---

**Note:** All steps are automated by the recipe. This workflow is for understanding the process.
