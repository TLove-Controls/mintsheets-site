# HVAC Profit Margin Calculator - Documentation

## Overview
The **HVAC Profit Margin Calculator** is an essential business management tool designed to analyze the financial viability of individual jobs. By accounting for direct costs, financing fees, and allocated overhead, it provides a clear picture of both Gross and Net profit, helping owners ensure every bid meets their business goals.

## Key Features
- **Revenue Modeling:** Input bid amounts, down payments, and factor in financing fees based on common industry terms (e.g., 12-month SAC).
- **Direct Cost Tracking:** Detailed inputs for equipment, materials, labor, refrigerant, permits, and disposal fees.
- **Overhead Allocation:** Distributes fixed monthly costs (rent, utilities, insurance) and variable job costs (fuel, marketing) across your average monthly job count.
- **Profitability Dashboard:** Real-time calculation of Gross Profit, Net Profit, and Break-Even bidding points.
- **Visual Analytics:** Includes a margin progress bar (Red/Yellow/Green) and a cost breakdown stacked bar to visualize where every dollar goes.
- **Detailed Audit Trail:** A full table breakdown of costs as a percentage of revenue with automated health status badges.

## Setup Instructions

### 1. Customizing Placeholders
Update the following placeholders in `hvac_profit_margin_calculator.html`:

- **Header Branding:**
  - Line 7: `<title>` tag.
  - Line 512: Company name: `Your HVAC Co.`
- **Logo:**
  - Line 509: Replace the `<img> src` placeholder URL with your company's actual logo path or a local asset.
- **Default Business Metrics:**
  - Line 628-641: Set your actual monthly fixed costs (Rent, Utilities, etc.) to get more accurate "Net" profit results.
  - Line 666-678: Set your typical "Jobs Per Month" and "Target Margin" to calibrate the health indicators.

### 2. Deployment
This is a standalone HTML file. It is recommended for use by owners, sales managers, or office staff during the final bid review process to ensure profitability before presenting a proposal to a client.

## Technical Details
- **Gross Profit:** $\text{Revenue} - \text{Direct Costs}$.
- **Net Profit:** $\text{Gross Profit} - \text{Allocated Overhead} - \text{Financing Fees}$.
- **Break-Even Point:** The minimum bid amount required to cover all direct costs and the allocated share of overhead.

## Troubleshooting
- **Low Net Profit:** If net profit is significantly lower than gross profit, review your "Overhead" inputs or increase your "Jobs Per Month" if the overhead is spread too thin.
- **Financing Fees:** Ensure the correct financing percentage is selected, as high-interest long-term financing can significantly erode net margins.
- **Recalculation:** Data updates automatically on any input change (onchange).
