# HVAC Service Markup Calculator - Documentation

## Overview
The **HVAC Service Markup Calculator** is a precision tool for technicians and service coordinators to calculate the total cost and required markup for service repairs. It provides a granular breakdown of parts, labor, and travel expenses, ensuring each service ticket contributes to the company's profitability targets.

## Key Features
- **Service Ticket Management:** Track customer details, service types (Diagnostic, Repair, Emergency), and unique ticket numbers.
- **Labor & Travel Tracking:** Account for technician and helper hours, travel mileage, and after-hours/holiday surcharges.
- **Dynamic Parts Table:** Add multiple part lines with individual unit costs and quantities.
- **Markup Logic:** Automatically calculates Gross Profit and Net Profit margins based on total service call costs.
- **Visual Feedback:** A markup status indicator (High/Medium/Low) and progress bars help identify if the service call meets target profitability.
- **Additional Costs:** Factor in disposal fees, freight for special-order parts, and misc. supplies.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_service_markup_calculator.html`:

- **Header Branding:**
  - Line 7: `<title>` tag.
  - Line 633: Company name: `Your HVAC Co.`
- **Logo:**
  - Line 630: Replace the `<img> src` placeholder URL with your company's actual logo path or a local asset.
- **Service Defaults:**
  - Line 714: Default "Service Call Fee" ($99).
  - Line 736: Default "Technician Hourly Rate" ($45).
  - Line 664: Default "Service Date".

### 2. Deployment
This tool is designed as a standalone HTML application. It can be used on mobile devices by field technicians to generate on-the-spot repair quotes or as an office tool for auditing service tickets.

## Technical Details
- **Markup Calculation:** $\text{Markup} = \text{Total Price} - \text{Total Cost}$.
- **Margin Calculation:** $1 - (\text{Total Cost} / \text{Total Price})$.
- **Surcharges:** After-hours and holiday surcharges apply a flat percentage multiplier to the final labor and service fee totals.

## Troubleshooting
- **Low Margin Warnings:** If results are in the red, verify that all part costs and labor hours are entered correctly. Consider increasing the markup on high-cost components.
- **Row Deletion:** Use the "✕" button to remove unused pre-populated rows in the parts table.
- **Automatic Recalculation:** The calculator updates as you type or change dropdown selections.
