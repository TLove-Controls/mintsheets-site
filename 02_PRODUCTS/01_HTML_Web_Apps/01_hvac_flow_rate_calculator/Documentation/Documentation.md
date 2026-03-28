# HVAC Flow Rate Calculator - Documentation

## Overview
The **HVAC Flow Rate Calculator** is a professional-grade web tool designed for technicians and engineers to calculate airflow (CFM), size ducts using the equal friction method, and analyze sensible heat loads. It features a high-visibility "Cyber-Trade" UI optimized for field use on tablets and phones.

## Key Features
- **CFM / Airflow:** Calculate CFM by duct area/velocity, sensible load, latent load, or room square footage.
- **Duct Sizing:** A multi-zone table for sizing branches and trunks using target friction rates.
- **Sensible Heat:** Calculate sensible load based on CFM and temperature delta (ΔT).
- **Static Pressure:** Simple tool for calculating total external static pressure (TESP).
- **Live Status Bar:** Real-time feedback on airflow, velocity, and system status.

## Setup Instructions

### 1. Customizing Placeholders
Before deployment, you must update the following placeholders in the `HVAC_flow_rate_calculator.html` file:

- **Company Name:** Locate line 6 (`<title>`) and line 524. Replace "Your HVAC Co." with your actual company name.
- **Logo Mark:** Locate line 516. Replace "HC" with your initials or a small logo icon.
- **Location:** Locate line 524. Replace "Rogers, AR" with your service area.
- **Certifications:** Locate line 525. Update "EPA 608 Universal · NATE Certified" with your actual credentials.

### 2. Deployment
Simply host the `.html` file on your company website, or open it directly in any modern web browser on a phone or tablet. No database or server-side code is required.

## Technical Details
- **Stack:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla).
- **External Dependencies:** Google Fonts (Barlow & Share Tech Mono).
- **Formulas Used:**
  - CFM = Velocity (FPM) × Area (sq ft)
  - Sensible BTU = 1.08 × CFM × ΔT
  - Duct Diameter = 1.63 × (CFM / Friction)^0.42 (Approximate Equal Friction)

## Troubleshooting
- **Calculation Not Updating:** Ensure JavaScript is enabled in your browser.
- **Layout Issues:** The tool is designed for a minimum width of 320px. Ensure you aren't using an extremely narrow legacy device.
- **Printing:** Use the "Print" function in your browser; the CSS includes basic print optimizations to hide interactive elements like "Add Zone" buttons.
