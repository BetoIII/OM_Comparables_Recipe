#!/usr/bin/env python3
"""
Generate interactive HTML viewer for comp sets and return JSON result
"""

import json
import os
import sys

# Import the functions from the previous script
exec(open('generate_comp_set_viewer.py').read())

# Generate viewer for sa-downtown comp set
result, error = generate_comp_set_viewer("sa-downtown")

if error:
    print(f"Error: {error}", file=sys.stderr)
    sys.exit(1)

# Output the result as JSON
print(json.dumps(result, indent=2))
