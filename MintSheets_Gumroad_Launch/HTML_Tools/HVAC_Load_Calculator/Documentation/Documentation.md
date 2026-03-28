# HVAC Load Calculator - Documentation

## Overview
The **HVAC Load Calculator** is a simplified Manual J calculation tool designed for residential and light commercial applications. It allows technicians to estimate peak cooling and heating loads based on building envelope data, glazing orientation, and internal heat gains, ensuring proper equipment sizing.

## Key Features
- **Project Scoping:** Capture essential customer and job information for professional documentation.
- **Envelope Analysis:** Input square footage, volume, and U-factors for walls, ceilings, and floors.
- **Glazing Orientation:** Account for solar heat gain (SHGC) and conductive loss/gain based on window orientation (N, S, E, W).
- **Internal Loads:** Factor in heat generation from occupants, lighting density, and kitchen/laundry appliances.
- **Duct Integrity Check:** Includes a checklist for duct location and sealing which adjusts infiltration calculations.
- **Integrated Results:** Displays total cooling load (Total, Sensible, Latent), total heating load, and recommended furnace tonnage/BTU.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_load_calculator.html`:

- **Header & Footer Branding:**
  - Line 7: `<title>` tag.
  - Line 290 & 665: Company name: `Your HVAC Co.`
  - Line 671: Location (Rogers, AR).
  - Line 667 & 669: Phone number and website URL.
  - Line 674-676: Certifications and service area (Serving Northwest Arkansas).
- **Logo:**
  - Line 288: Replace the `<img> src` placeholder URL with your company's actual logo path or a local asset.

### 2. Deployment
This is a standalone HTML file with internal CSS and JS. It is optimized for use on field tablets to perform quick on-site load estimates during sales calls.

## Technical Details
- **Methodology:** Simplified Manual J proxy.
- **Cooling Calculation:** $Q = \text{Envelope Conduction} + \text{Solar Gain} + \text{Infiltration} + \text{Internal Gains}$.
- **Heating Calculation:** $Q = \text{Envelope Conduction (Heated to Ambient)} + \text{Infiltration}$.
- **Safety Margin:** A 10% safety factor is applied to final calculations to ensure adequate capacity in extreme conditions.

## Troubleshooting
- **Zeros in Results:** Ensure "Conditioned Sq. Ft." and "Volume" are entered, as these are primary drivers for all other calculations.
- **Window Factors:** Verify that orientations (N, S, E, W) are selected correctly, as solar factors vary significantly by compass direction.
- **Accuracy Reminder:** This is a simplified tool. For complex structures or commercial permits, a full ACCA Manual J load calculation is recommended.
