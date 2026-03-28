# HVAC CFM Calculator - Documentation

## Overview
The **HVAC CFM Calculator** is a precision tool for calculating airflow requirements at the room and system levels. It helps technicians verify if a system is meeting its 400 CFM/ton target and provides quick duct sizing references for residential projects.

## Key Features
- **Room-Level Calculations:** Determine required CFM based on square footage, air changes per hour (ACPH), or sensible BTUH load.
- **Duct Sizing Tool:** Size round, rectangular, or flexible ducts based on target friction rates and design CFM.
- **System Tonnage Check:** Verify if a system's total airflow matches the nameplate tonnage (Industry standard 400 CFM/ton).
- **Interactive Results:** Dynamic tables with PASS/WARN/FAIL status badges based on industry guidelines (ASHRAE 62.2, ACCA Manual D).

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_cfm_calculator.html`:

- **Header Branding:**
  - Line 6: `<title>` tag.
  - Line 283: Header company name: `Your <span>HVAC</span> Co.`
- **Footer Contact Info:**
  - Line 533: Company name and service area (Rogers, AR).
  - Line 534: Phone number, website, and certifications.

### 2. Deployment
This is a standalone HTML file. Host it on your company's internal portal or use it as a local file on field tablets.

## Technical Details
- **Stack:** HTML5, CSS3, JavaScript.
- **Calculations:**
  - CFM (SqFt) = Area * Factor (typically 0.75).
  - CFM (ACPH) = (Volume * ACH) / 60.
  - CFM (BTUH) = BTUH / (1.08 * ΔT).
  - Friction-to-Diameter approximation for duct sizing.

## Troubleshooting
- **Result Hidden:** Click the "CALCULATE" button to reveal the results table.
- **Method Toggle:** Use the dropdown in Section 1 to switch between Square Footage, ACPH, or BTUH methods.
- **Low Airflow Warning:** If a room calculates under 50 CFM, the tool will trigger a warning per ASHRAE 62.2 minimum requirements.
