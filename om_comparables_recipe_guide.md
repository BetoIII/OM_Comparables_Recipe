# OM Comparables Extraction Recipe - User Guide

## Overview
This recipe extracts market comparable property data from Commercial Real Estate Offering Memoranda (OMs). It identifies and catalogs properties and units listed in the comparables/market analysis sections of OMs.

## What It Extracts

### 1. Survey Metadata
- **Survey Date**: When the market analysis was conducted
- **Survey Source**: Data provider (CoStar, appraisal, etc.)
- **Market Area**: Geographic market described

### 2. Comparable Properties
For each property found:
- Property name and full address
- Property details (type, year built, units, square footage, occupancy)
- Amenities list
- Distance from subject property

### 3. Unit-Level Data
For each unit type within properties:
- Unit type (Studio, 1BR/1BA, etc.)
- Count of units
- Square footage
- Rent amounts (monthly/annual)
- Rent per square foot

### 4. Document Summary
- Source documents processed
- Total properties and units extracted
- Property types found
- Any issues encountered

## How to Use

### Method 1: Using the Recipe with Goose CLI

1. **Save the recipe file** to a known location
   - The recipe is saved at: `/Users/betojuareziii/Desktop/Knowledge Base/ChatGPT/om_comparables_extraction_recipe.json`

2. **Run the recipe with document path(s)**
   ```bash
   # Single document
   goose run-recipe om_comparables_extraction_recipe.json \
     --parameter document_paths='["/path/to/your/OM.pdf"]'
   
   # Multiple documents
   goose run-recipe om_comparables_extraction_recipe.json \
     --parameter document_paths='["/path/to/OM1.pdf", "/path/to/OM2.pdf", "/path/to/OM3.pdf"]'
   ```

### Method 2: Using with Dynamic Tasks in Goose Session

Within a Goose session, you can use the `create_task` tool:

```json
{
  "task_parameters": [{
    "title": "Extract OM Comparables",
    "instructions": "Use the OM comparables extraction recipe to process these documents",
    "parameters": [{
      "document_paths": [
        "/Users/betojuareziii/Downloads/Offering Memorandum (OM) - 207 Omaha St.pdf"
      ]
    }],
    "extensions": [
      {"name": "developer"},
      {"name": "computercontroller"}
      {"name": "Pdfreader"}
    ],
    "return_last_only": true
  }]
}
```

### Method 3: Scheduling Regular Extraction

If you regularly receive OMs in a specific folder, you can schedule this recipe:

```bash
# Check every weekday at 9 AM for new OMs in a folder
goose schedule create \
  --recipe om_comparables_extraction_recipe.json \
  --cron "0 9 * * 1-5" \
  --mode background
```

## Example Output Structure

```json
{
  "survey_metadata": {
    "survey_date": "Q2 2024",
    "survey_source": "CoStar",
    "market_area": "Downtown Austin"
  },
  "comparable_properties": [
    {
      "property_name": "The Baldwin at St. Paul Square",
      "address": {
        "street": "123 Main St",
        "city": "Austin",
        "state": "TX",
        "zip": "78701",
        "full_address": "123 Main St, Austin, TX 78701"
      },
      "property_details": {
        "property_type": "Multifamily",
        "year_built": 2020,
        "total_units": 250,
        "total_square_feet": 200000,
        "occupancy_rate": 95.5,
        "distance_from_subject": "0.3 miles"
      },
      "amenities": [
        "Pool",
        "Fitness Center",
        "Pet Friendly",
        "Parking Garage"
      ],
      "units": [
        {
          "unit_type": "Studio",
          "count": 50,
          "square_feet": 550,
          "rent_amount": 1850,
          "rent_period": "monthly",
          "rent_per_sf": 3.36
        },
        {
          "unit_type": "1BR/1BA",
          "count": 100,
          "square_feet": 750,
          "rent_amount": 2300,
          "rent_period": "monthly",
          "rent_per_sf": 3.07
        }
      ]
    }
  ],
  "document_sources": [
    {
      "document_name": "Offering Memorandum (OM) - 207 Omaha St.pdf",
      "subject_property_name": "207 Omaha Street Apartments",
      "subject_property_address": "207 Omaha St, Austin, TX 78702",
      "comparables_count": 15
    }
  ],
  "summary": {
    "total_documents_processed": 1,
    "total_comparable_properties": 15,
    "total_units_extracted": 67,
    "property_types_found": ["Multifamily"],
    "issues_encountered": []
  }
}
```

## Tips for Best Results

### Document Preparation
1. **PDF Quality**: Ensure PDFs are text-readable (not scanned images)
2. **File Naming**: Use consistent naming conventions for easy tracking
3. **Folder Organization**: Keep OMs organized by date or property type

### Recipe Customization
You can modify the recipe to:
- Add additional fields specific to your market
- Change the output format
- Filter for specific property types
- Add data validation rules

### Common Sections to Look For
The recipe searches for these section names:
- "Market Comparables"
- "Competitive Set"
- "Comparable Properties"
- "Market Analysis"
- "Rent Comparables"
- "Market Survey"
- "Comparable Sales"
- "Market Overview"

## Use Cases

### Investment Analysis
- Compare asking prices to market comps
- Analyze rent premiums/discounts
- Identify market positioning

### Portfolio Management
- Build database of market comparables
- Track market trends over time
- Benchmark portfolio performance

### Underwriting
- Validate pro forma rents
- Assess market depth
- Support valuation models

### Market Research
- Aggregate data across multiple OMs
- Identify market trends
- Track new construction pipeline

## Troubleshooting

### Issue: No comparables found
- Check if the PDF has a comparables section
- Verify the section header matches expected names
- Look for scanned images vs. text-based PDFs

### Issue: Missing data fields
- Some OMs provide limited data
- Consider the "notes" fields for additional context
- Review the "issues_encountered" array in the summary

### Issue: Incorrect property classification
- Review the property_type field
- Check if mixed-use properties need special handling
- Consider adding validation rules

## Next Steps

After extraction, you can:
1. **Export to Database**: Load data into PostgreSQL, MongoDB, etc.
2. **Create Dashboards**: Visualize with Tableau, Power BI
3. **Build Reports**: Generate market analysis reports
4. **Feed Models**: Use for underwriting or valuation models
5. **Track Changes**: Compare extractions over time to see market movement

## Support & Customization

To modify this recipe for your specific needs:
1. Edit the `response` schema to add/remove fields
2. Update the `context` array with market-specific guidance
3. Adjust the `extensions` array if you need additional tools
4. Add custom validation or data transformation logic

---

**Recipe Location**: `/Users/betojuareziii/Desktop/Knowledge Base/ChatGPT/om_comparables_extraction_recipe.json`

**Created**: 2025
**Version**: 1.0
