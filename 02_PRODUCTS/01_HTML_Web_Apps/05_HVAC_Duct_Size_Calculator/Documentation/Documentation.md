# HVAC Duct Size Calculator - Documentation

## Overview
The **HVAC Duct Size Calculator** is a professional-grade engineering tool for sizing ductwork using the Equal Friction Method per ACCA Manual D. It supports rigid round, rectangular, and flexible ducting, while also providing a comprehensive Total External Static Pressure (TESP) budgeting tool.

## Key Features
- **Multi-Material Support:** Calculate sizes for Galvanized Sheet Metal, Aluminum, Spiral, and various types of Flex Duct (R-6, R-8).
- **Fitting Equivalent Lengths:** Account for 90° elbows, tees, wyes, and transitions to get a true pressure drop calculation.
- **Rectangular Aspect Ratio:** Automatically solves for duct width based on a known height while maintaining Manual D aspect ratio limits (≤4:1).
- **Static Pressure Budgeting:** Track pressure drops across filters, coils, and grilles against the equipment's rated TESP to ensure the blower can handle the design.
- **Interactive Size Grid:** Quickly reference standard duct diameters and their typical CFM ranges.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_duct_size_calculator.html`:

- **Header Branding:**
  - Line 6: `<title>` tag.
  - Line 71 & 449: Company name: `Your <span>HVAC</span> Co.`
  - Line 450: Credentials and location (Rogers, AR).
- **Logo:**
  - Line 447: The `<div class="header-logo">H</div>` can be changed to your company's initial.

### 2. Deployment
This is a standalone HTML/CSS/JS file. It is mobile-responsive and designed for use on tablets in the field or desktops in the design office.

## Technical Details
- **Friction Formula:** Uses a modernized Altshul-Tsal approximation for duct friction loss.
- **Flex Correction:** Applies ACCA-standard correction factors (1.1x to 1.35x) based on installation quality and duct type.
- **TESP Budget:** $\text{Remaining Budget} = \text{Rated TESP} - \sum (\text{Component Drops})$.

## Troubleshooting
- **Velocity Warnings:** If the calculated velocity is too high (>900 FPM for supply), a "WARN" badge will appear to indicate potential noise issues.
- **Incomplete TESP:** Ensure you enter the "Equipment Rated TESP" (e.g., 0.50) before calculating the pressure budget.
- **Flex Run Length:** The tool will provide a reminder if flex runs exceed the recommended 6 ft maximum.
