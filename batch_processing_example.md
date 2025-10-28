# Batch Processing Example for OM Comparables Extraction

## Overview
The updated recipe now supports batch processing of multiple Offering Memorandum PDFs simultaneously and automatically generates an interactive HTML report.

## Key Updates

### 1. **Batch Processing Instructions**
- Process multiple PDFs in a single execution
- Extract comparables from each document independently
- Aggregate all results into one JSON output
- Track source document for each comparable

### 2. **New Schema Fields**

#### Added to `comparable_properties` items:
```json
"source_document": {
  "type": ["string", "null"],
  "description": "Name of the source OM document where this comparable was found"
}
```

#### Added to `summary`:
```json
"duplicate_properties": {
  "type": ["array", "null"],
  "items": {
    "type": "object",
    "properties": {
      "property_name": { "type": "string" },
      "found_in_documents": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  },
  "description": "List of properties that appear in multiple source documents"
}
```

### 3. **Enhanced Context**
- Explicit batch processing notes added
- Guidance on deduplication
- Error handling for failed documents
- Source tracking requirements

## Usage Example

### Single Document (Original Method)
```json
{
  "document_paths": [
    "/Users/betojuareziii/Downloads/Offering Memorandum (OM) - 207 Omaha St.pdf"
  ]
}
```

### Multiple Documents (Batch Processing)
```json
{
  "document_paths": [
    "/Users/betojuareziii/Downloads/OM - 207 Omaha St.pdf",
    "/Users/betojuareziii/Downloads/OM - 123 Main St.pdf",
    "/Users/betojuareziii/Downloads/OM - 456 Oak Ave.pdf",
    "/Users/betojuareziii/Downloads/OM - 789 Pine Rd.pdf"
  ]
}
```

## Expected Output Structure

```json
{
  "survey_metadata": { ... },
  "comparable_properties": [
    {
      "property_name": "The Baldwin - St. Paul Square",
      "address": { ... },
      "property_details": { ... },
      "amenities": [ ... ],
      "units": [ ... ],
      "source_document": "OM - 207 Omaha St.pdf",
      ...
    },
    {
      "property_name": "Luxury Towers",
      "address": { ... },
      "property_details": { ... },
      "amenities": [ ... ],
      "units": [ ... ],
      "source_document": "OM - 123 Main St.pdf",
      ...
    }
  ],
  "document_sources": [
    {
      "document_name": "OM - 207 Omaha St.pdf",
      "subject_property_name": "207 Omaha St",
      "subject_property_address": "207 Omaha St, San Antonio, TX",
      "comparables_count": 14
    },
    {
      "document_name": "OM - 123 Main St.pdf",
      "subject_property_name": "123 Main St",
      "subject_property_address": "123 Main St, Austin, TX",
      "comparables_count": 8
    }
  ],
  "summary": {
    "total_documents_processed": 4,
    "total_comparable_properties": 45,
    "total_units_extracted": 156,
    "property_types_found": ["Multifamily", "Mixed-Use"],
    "issues_encountered": [
      "OM - 789 Pine Rd.pdf: Could not extract survey date"
    ],
    "duplicate_properties": [
      {
        "property_name": "The Baldwin - St. Paul Square",
        "found_in_documents": [
          "OM - 207 Omaha St.pdf",
          "OM - 123 Main St.pdf"
        ]
      }
    ]
  }
}
```

## Processing Workflow

1. **Read all PDFs** - Extract text from each document
2. **Extract comparables** - Process each document independently
3. **Track sources** - Add source_document to each comparable
4. **Aggregate data** - Combine all comparables into single array
5. **Detect duplicates** - Identify properties appearing in multiple docs
6. **Generate summary** - Calculate totals and statistics
7. **Generate HTML report** - Create interactive card-based visualization
8. **Handle errors** - Note any processing failures

## HTML Report Generation

The recipe automatically generates a modern, responsive HTML report (`comparables_report.html`) featuring:

### Report Features
- **Summary Dashboard** - Key metrics at the top (total properties, units, documents)
- **Property Cards** - Each comparable displayed in a clean, organized card
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Interactive Elements** - Hover effects and color-coded badges
- **Unit Tables** - Detailed unit mix data for each property
- **Source Tracking** - Shows which OM each comparable came from

### Card Layout
Each property card includes:
- ✅ Property name and address
- ✅ Property type badge (color-coded)
- ✅ Key details (year built, units, occupancy, distance)
- ✅ Amenities list with tags
- ✅ Unit mix table (type, sq ft, rent, $/SF)
- ✅ Source document reference
- ✅ Additional notes

### Visual Design
- **Color Schemes** - Different colors for property types
- **Occupancy Indicators** - Green (high), yellow (medium), red (low)
- **Rent Highlighting** - Key financial metrics stand out
- **Professional Styling** - Modern, clean aesthetic

### Sample Template
See `sample_html_template.html` in this directory for a visual example.

## Output Files

After processing, you'll receive two files:

1. **JSON Data File** - `extracted_comparables_[timestamp].json`
   - Structured data in JSON format
   - Machine-readable for further analysis
   - Can be imported into databases or other tools

2. **HTML Report** - `comparables_report.html`
   - Visual, interactive report
   - Human-readable presentation
   - Can be opened in any web browser
   - Self-contained (no external dependencies)

## Benefits

✅ **Efficiency** - Process multiple OMs in one run
✅ **Traceability** - Know which document each comp came from
✅ **Deduplication** - Identify properties used in multiple analyses
✅ **Error Resilience** - Continue processing if one document fails
✅ **Comprehensive Analysis** - Get market overview across multiple properties
✅ **Visual Reports** - Beautiful HTML output for presentations

## Tips for Best Results

1. **Organize your files** - Keep all OM PDFs in one directory
2. **Use absolute paths** - Provide full file paths in document_paths array
3. **Check file accessibility** - Ensure all PDFs are readable
4. **Review duplicates** - Pay attention to properties appearing multiple times
5. **Validate output** - Check the summary section for processing issues
