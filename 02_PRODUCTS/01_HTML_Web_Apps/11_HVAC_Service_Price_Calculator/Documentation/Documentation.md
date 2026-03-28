# HVAC Service Price Calculator - Documentation

## Overview
The **HVAC Service Price Calculator** is a comprehensive tool for generating customer-facing service quotes. It translates internal labor and parts costs into final billable prices, while also presenting membership tier options (Silver, Gold, Platinum) to encourage recurring service agreements and customer loyalty.

## Key Features
- **Comprehensive Service Logging:** Capture project info, service types, and equipment data for consistent record-keeping.
- **Labor & Parts Integration:** Input detailed technician hours and individual part costs to build a baseline job cost.
- **Pricing Strategy Dashboard:** View the total burdened cost vs. the recommended customer bid, with real-time margin percentage feedback.
- **Membership Upsell:** Integrated calculation of Silver, Gold, and Platinum membership pricing to present value-added options to the client on-the-spot.
- **Visual Cost Breakdown:** A stacked bar chart visually displays the allocation of Labor, Parts, Overhead, and Profit for internal review.
- **Professional Quote Header:** Branded header and footer with technician and ticket details, ready for client presentation or digital export.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_service_price_calculator.html`:

- **Header Branding:**
  - Line 7: `<title>` tag.
  - Line 670: Company name: `Your HVAC Co.`
- **Logo:**
  - Line 667: Replace the `<img> src` placeholder URL with your company's actual logo path or a local asset.
- **Service Defaults:**
  - Line 701: Default "Service Date".
  - Line 718: Default "Technician Name" (John Doe).
  - Line 722: Default "Service Ticket #" (SVC-2023-001).
- **Membership Pricing:**
  - Review the logic in the script section (bottom of file) to ensure membership discount percentages match your current program offerings.

### 2. Deployment
This tool is a single-file HTML application. It can be used by sales technicians in the field to transition from a "repair" conversation to a "value" conversation by clearly showing the cost-benefits of maintenance memberships.

## Technical Details
- **Total Cost:** Sum of $\text{Labor Cost} + \text{Parts Cost} + \text{Travel Cost} + \text{Overhead}$.
- **Recommended Bid:** Calculated to hit the target margin set in the internal business settings.
- **Profit Waterfall:** The breakdown chart uses CSS flexbox widths calculated via JavaScript to show the "Waterfall" of costs vs final price.

## Troubleshooting
- **Missing Membership Prices:** Ensure the "Diagnostic" or "Repair" total is calculated first, as membership discounts are often derived from the total billable amount.
- **Duplicate Part Rows:** Use the "✕" button to clean up any extra rows in the parts table before printing or showing to the customer.
- **Form Reset:** Refresh the page to clear all fields and start a new service ticket.
