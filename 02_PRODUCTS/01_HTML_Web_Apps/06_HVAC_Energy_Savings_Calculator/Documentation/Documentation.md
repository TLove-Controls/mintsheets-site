# HVAC Energy Savings Calculator - Documentation

## Overview
The **HVAC Energy Savings Calculator** is a powerful sales and analysis tool designed to help customers understand the financial and environmental benefits of upgrading to high-efficiency equipment. It provides detailed cooling and heating savings, payback periods, lifetime ROI, and CO2 reduction metrics.

## Key Features
- **Cooling Analysis:** Compare SEER/SEER2 ratings taking into account annual cooling hours, electricity rates, and fuel escalation.
- **Heating Analysis:** Support for Gas, Electric, Heat Pump, Oil, and Propane systems with AFUE and HSPF2 efficiency metrics.
- **Combined ROI Summary:** View total project investment, blended payback period, and total net lifetime savings.
- **Visual Impact:** Real-time cumulative savings chart (powered by Chart.js) and a dynamic payback progress bar.
- **Environmental Tracking:** Calculates annual carbon footprint reduction in metric tons of CO2.
- **Proposal Ready:** Includes a professional print mode for generating customer-facing reports.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_energy_savings_calculator.html`:

- **Header Branding:**
  - Line 6: `<title>` tag.
  - Line 65, 364, & 774: Company name: `Your <span>HVAC</span> Co.`
  - Line 365 & 775: Credentials and location (Rogers, AR).
- **Regional Defaults:**
  - Line 423: Update "NW Arkansas avg ≈ 1,400 hrs/yr" to your local average cooling hours.
  - Line 456: Update "AR avg ≈ $0.10/kWh" to your local electricity rate.
- **Logo:**
  - Line 362: The `<div class="header-logo">H</div>` can be changed to your company's initial icon.

### 2. Dependencies
This calculator uses **Chart.js v4.4.1** via CDN (`https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js`). Ensure the target device has internet access to load the chart, or download and host the library locally.

## Technical Details
- **Cooling Savings:** $\text{kWh Saved} = \text{Capacity (BTUH)} \times \text{Hours} \times \left(\frac{1}{\text{Old SEER}} - \frac{1}{\text{New SEER2}}\right)$.
- **Fuel Escalation:** Applies a compounding percentage increase to utility rates annually over the equipment's lifespan.
- **CO2 Calculation:** Uses EPA averages for emissions per kWh and therm of natural gas.

## Troubleshooting
- **Chart Not Loading:** Verify internet connection for the Chart.js CDN.
- **Inaccurate Payback:** Ensure "Equipment + Install Cost" is entered for both cooling and heating if doing a combined system analysis.
- **Missing Results:** Click the "CALCULATE" button in each section to refresh the data displayed.
