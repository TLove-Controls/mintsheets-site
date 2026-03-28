# HVAC Labor Cost Calculator - Documentation

## Overview
The **HVAC Labor Cost Calculator** is a comprehensive internal tool for service managers and owners to calculate the true burdened cost of field labor. It allows for precise tracking of payroll taxes, benefits, and overhead on a per-technician basis, ensuring that billable rates maintain target profit margins.

## Key Features
- **Technician Burden Tracking:** Calculate the "true" hourly cost by adding FICA, FUTA, SUTA, health insurance, workers' comp, and overhead (vehicle/tools) to the base wage.
- **Daily Time Entry:** Log regular, overtime, and double-time hours per day with automatic roll-ups to weekly totals.
- **Margin Analysis Matrix:** Real-time calculation of Gross Margin % and Markup $ for each labor type (Reg, OT, DT) based on current burdened costs.
- **Additional Charges:** Integrated tracking for drive time, mileage (at standard rates), per diem, and hazard pay.
- **Branded Summary:** A high-level dashboard showing total labor cost vs. billable revenue, including profit metrics.
- **Skill Tier Benchmarking:** Reference table for Northwest Arkansas market rates to assist in hiring and performance reviews.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_labor_cost_calculator.html`:

- **Header Branding:**
  - Line 6: `<title>` tag.
  - Line 381: Company name: `Your<span>HVAC</span>Co.`
- **Regional Context:**
  - Line 416: Update the placeholder address "123 Main St, Rogers, AR" to your shop's city/state.
  - Line 784: The skill tier reference is calibrated for the **Northwest Arkansas** market. Adjust these values if your local market labor rates differ significantly.

### 2. Deployment
This is a standalone HTML file. It can be hosted on a secure internal server or distributed as a local file to service managers for use during job cost reviews.

## Technical Details
- **Burdened Rate:** $\text{Base Wage} \times (1 + \sum \text{Burden Percentages})$.
- **Gross Margin:** $(\text{Billable Rate} - \text{Burdened Rate}) / \text{Billable Rate}$.
- **OT/DT Multipliers:** Defaults to 1.5x and 2.0x, but can be adjusted to 1.0x for salaried or flat-rate compensation models.

## Troubleshooting
- **Negative Margin:** If the status shows a "FAIL" (red chip), your billable rate is lower than your burdened labor cost. Increase the billable rate or reduce overhead.
- **Hours Not Summing:** Ensure hours are entered in decimal format (e.g., 8.5 for 8 hours and 30 minutes).
- **Recalculation:** The totals update automatically when any input field loses focus (onchange).
