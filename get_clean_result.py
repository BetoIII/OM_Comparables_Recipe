#!/usr/bin/env python3
"""
Generate interactive HTML viewer for comp sets and return clean JSON result
"""

import json
import os
import sys

def load_json_file(filepath):
    """Load and parse JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as e:
        return None

def get_occupancy_class(vacancy_rate):
    """Get CSS class for occupancy rate"""
    if vacancy_rate is None:
        return ""
    occupancy = 100 - vacancy_rate
    if occupancy >= 95:
        return "occupancy-high"
    elif occupancy >= 90:
        return "occupancy-medium"
    else:
        return "occupancy-low"

def format_currency(amount):
    """Format currency values"""
    if amount is None:
        return "N/A"
    return f"${amount:,}"

def format_sqft(sqft):
    """Format square footage"""
    if sqft is None:
        return "N/A"
    return f"{sqft:,} sq ft"

def format_rent_per_sqft(rent_per_sqft):
    """Format rent per square foot"""
    if rent_per_sqft is None:
        return "N/A"
    return f"${rent_per_sqft:.2f}/sq ft"

def generate_unit_mix_table(unit_mix):
    """Generate HTML table for unit mix"""
    if not unit_mix:
        return "<p>No unit mix data available</p>"
    
    html = """
    <table class="units-table">
        <thead>
            <tr>
                <th>Unit Type</th>
                <th>Rent</th>
                <th>Sq Ft</th>
                <th>$/Sq Ft</th>
            </tr>
        </thead>
        <tbody>
    """
    
    for unit in unit_mix:
        rent = format_currency(unit.get('rent'))
        sqft = format_sqft(unit.get('sqft'))
        rent_per_sqft = format_rent_per_sqft(unit.get('rent_per_sqft'))
        
        html += f"""
            <tr>
                <td><strong>{unit.get('unit_type', 'N/A')}</strong></td>
                <td class="rent-highlight">{rent}</td>
                <td>{sqft}</td>
                <td>{rent_per_sqft}</td>
            </tr>
        """
    
    html += """
        </tbody>
    </table>
    """
    
    return html

def generate_property_card(property_data, data_not_found=False):
    """Generate HTML for a single property card"""
    
    # Extract basic info
    prop_id = property_data.get('property_id', property_data.get('id', 'N/A'))
    name = property_data.get('name', 'Unknown Property')
    
    # Handle address - could be string or object
    address = property_data.get('address', 'N/A')
    if isinstance(address, dict):
        address = address.get('full_address', 'N/A')
    
    # Property details with fallbacks
    year_built = property_data.get('year_built', 'N/A')
    total_units = property_data.get('total_units', 'N/A')
    vacancy_rate = property_data.get('vacancy_rate')
    occupancy_rate = 100 - vacancy_rate if vacancy_rate is not None else None
    distance = property_data.get('distance_to_subject', 'N/A')
    neighborhood = property_data.get('neighborhood', 'N/A')
    
    # Amenities
    amenities = property_data.get('notable_amenities', [])
    if isinstance(amenities, str):
        amenities = [amenities]
    
    # Unit mix
    unit_mix = property_data.get('unit_mix', [])
    unit_mix_html = generate_unit_mix_table(unit_mix)
    
    # Source document
    source_doc = property_data.get('source_document', 'N/A')
    
    # Occupancy class for styling
    occupancy_class = get_occupancy_class(vacancy_rate)
    
    # Data not found badge
    data_badge = """
        <div class="data-not-found-badge">
            ⚠️ Data Not Found
        </div>
    """ if data_not_found else ""
    
    # Amenities HTML
    amenities_html = ""
    if amenities:
        amenities_tags = "".join([f'<span class="amenity-tag">{amenity}</span>' for amenity in amenities])
        amenities_html = f"""
        <div class="amenities">
            <div class="amenities-title">Notable Amenities</div>
            <div class="amenities-list">
                {amenities_tags}
            </div>
        </div>
        """
    
    # Format occupancy display
    occupancy_display = f"{occupancy_rate:.1f}%" if occupancy_rate is not None else "N/A"
    
    card_html = f"""
    <div class="property-card" data-property-id="{prop_id}">
        {data_badge}
        <div class="property-header">
            <div class="property-name">{name}</div>
            <div class="property-address">{address}</div>
            <div class="property-type-badge badge-multifamily">Multifamily</div>
        </div>
        
        <div class="property-details">
            <div class="detail-row">
                <span class="detail-label">Year Built:</span>
                <span class="detail-value">{year_built}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Units:</span>
                <span class="detail-value">{total_units}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Occupancy Rate:</span>
                <span class="detail-value {occupancy_class}">{occupancy_display}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Distance:</span>
                <span class="detail-value">{distance}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Neighborhood:</span>
                <span class="detail-value">{neighborhood}</span>
            </div>
        </div>
        
        {amenities_html}
        
        <div class="units-section">
            <div class="units-title">Unit Mix & Pricing</div>
            {unit_mix_html}
        </div>
        
        <div class="source-document">
            <strong>Source:</strong> {source_doc}
        </div>
        
        <div class="card-actions">
            <button class="remove-from-comp-btn" onclick="removeFromCompSet('{prop_id}', '{name}')">
                Remove from sa-downtown
            </button>
            <button class="add-to-comp-btn" onclick="addToOtherCompSet('{prop_id}', '{name}')">
                Add to Other Comp Set
            </button>
        </div>
    </div>
    """
    
    return card_html

def generate_comp_set_viewer(comp_set_name):
    """Generate the complete HTML viewer for a comp set"""
    
    # Load comp set data
    comp_set_path = f"comp_sets/{comp_set_name}.json"
    comp_set_data = load_json_file(comp_set_path)
    
    if not comp_set_data:
        return None, f"Could not load comp set: {comp_set_path}"
    
    # Load comparables data for enrichment
    comparables_data = load_json_file("output/comparables_data.json")
    
    # Create property lookup map
    property_map = {}
    if comparables_data and 'comparable_properties' in comparables_data:
        for prop in comparables_data['comparable_properties']:
            prop_id = prop.get('property_id')
            if prop_id:
                property_map[prop_id] = prop
    
    # Enrich comp set properties with full data
    enriched_properties = []
    properties_with_missing_data = []
    
    for comp_prop in comp_set_data:
        prop_id = comp_prop.get('id')
        
        if prop_id in property_map:
            # Use full data from comparables_data.json
            full_data = property_map[prop_id].copy()
            enriched_properties.append(full_data)
        else:
            # Use minimal data from comp set and mark as missing
            enriched_properties.append(comp_prop)
            properties_with_missing_data.append({
                'id': prop_id,
                'name': comp_prop.get('name', 'Unknown'),
                'address': comp_prop.get('address', 'N/A')
            })
    
    # Generate property cards HTML
    properties_html = ""
    for prop in enriched_properties:
        prop_id = prop.get('property_id', prop.get('id'))
        data_not_found = prop_id not in property_map
        properties_html += generate_property_card(prop, data_not_found)
    
    # Calculate summary statistics
    total_properties = len(enriched_properties)
    properties_with_full_data = len([p for p in enriched_properties if p.get('property_id', p.get('id')) in property_map])
    
    total_units = sum([p.get('total_units', 0) for p in enriched_properties if p.get('total_units')])
    
    # Calculate average year built
    years = [p.get('year_built') for p in enriched_properties if p.get('year_built')]
    avg_year_built = int(sum(years) / len(years)) if years else "N/A"
    
    # Calculate average occupancy
    vacancy_rates = [p.get('vacancy_rate') for p in enriched_properties if p.get('vacancy_rate') is not None]
    avg_occupancy = round(100 - (sum(vacancy_rates) / len(vacancy_rates)), 1) if vacancy_rates else "N/A"
    
    # Load template
    template_path = "view_comp_set_template.html"
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Replace template placeholders
    html_content = template.replace('{{COMP_SET_NAME}}', comp_set_name)
    html_content = html_content.replace('{{TOTAL_PROPERTIES}}', str(total_properties))
    html_content = html_content.replace('{{TOTAL_UNITS}}', str(total_units))
    html_content = html_content.replace('{{AVG_YEAR_BUILT}}', str(avg_year_built))
    html_content = html_content.replace('{{AVG_OCCUPANCY}}', str(avg_occupancy))
    html_content = html_content.replace('{{PROPERTIES_HTML}}', properties_html)
    html_content = html_content.replace('{{PROPERTIES_JSON}}', json.dumps(enriched_properties, indent=2))
    
    # Create output directory if it doesn't exist
    os.makedirs('output', exist_ok=True)
    
    # Write HTML file
    output_path = f"output/view_comp_set_{comp_set_name}.html"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Prepare result data
    result = {
        'comp_set_name': comp_set_name,
        'comp_set_properties': enriched_properties,
        'html_file_path': output_path,
        'properties_with_missing_data': properties_with_missing_data,
        'summary': {
            'total_properties': total_properties,
            'properties_with_full_data': properties_with_full_data,
            'properties_with_missing_data': len(properties_with_missing_data)
        }
    }
    
    return result, None

# Generate viewer for sa-downtown comp set
result, error = generate_comp_set_viewer("sa-downtown")

if error:
    print(f"Error: {error}", file=sys.stderr)
    sys.exit(1)

# Output the result as JSON
print(json.dumps(result, indent=2))
