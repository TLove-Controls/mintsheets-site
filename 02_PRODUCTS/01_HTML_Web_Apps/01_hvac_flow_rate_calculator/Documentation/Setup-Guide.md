# HVAC Flow Rate Calculator — Setup Guide

## Overview

The HVAC Flow Rate Calculator is a single HTML file. There is nothing to install, no server to configure, and no database to set up. This guide covers customization, deployment options, and how to get the most out of the tool in different environments.

---

## Requirements

- Any modern web browser: Chrome, Firefox, Safari, Edge (2020 or newer)
- A plain-text editor for customization (VS Code, Notepad, Notepad++, TextEdit)
- An internet connection is only required on first load to pull Google Fonts. After that the tool runs fully offline.

---

## Customizing the Tool

Open `HVAC_flow_rate_calculator.html` in your text editor. You will make four changes.

### Change 1 — Browser Tab Title (Line 6)

Find:
```html
<title>HVAC Flow Rate Calculator — Your HVAC Co.</title>
```
Replace `Your HVAC Co.` with your company name.

### Change 2 — Header Logo Mark (Line 516)

Find:
```
HC
```
This is the two-letter badge in the top-left corner of the tool. Replace `HC` with your own initials or a short abbreviation (1–3 characters work best).

### Change 3 — Footer Company Name and Location (Line 524)

Find:
```
Your HVAC Co. · Rogers, AR
```
Replace with your company name and service area city/state.

### Change 4 — Footer Certifications (Line 525)

Find:
```
EPA 608 Universal · NATE Certified
```
Replace with your actual certifications. Separate multiple credentials with ` · ` (space-dot-space) to match the existing style.

### Using Find & Replace

If you want to catch every instance of "Your HVAC Co." in one pass:
- **Windows:** Ctrl + H in Notepad++ or VS Code
- **Mac:** Cmd + H in VS Code or TextEdit

Search for `Your HVAC Co.` and replace with your company name.

---

## Saving Your Changes

Save the file as `.html` — do not save as `.txt`. In Notepad on Windows, choose "All Files" in the Save dialog and type the full filename including `.html`.

---

## Deployment Options

### Option A — Host on Your Website

Upload `HVAC_flow_rate_calculator.html` to your web hosting provider using FTP, cPanel File Manager, or your host's upload tool. Link to it from any page on your site:

```html
<a href="/tools/HVAC_flow_rate_calculator.html">Open Flow Rate Calculator</a>
```

No additional server configuration is needed. The file is entirely self-contained.

### Option B — Shared Team Drive

Drop the file in a shared Google Drive or Dropbox folder. Team members open it directly in their browser from the shared link. Changes you make to the master file are instantly available to the whole team.

### Option C — Attach and Email to Clients

The file is small enough to attach to any email. Clients and contractors open it in their browser — no software installation required on their end.

### Option D — Local Tablet or Field Device

1. Copy the file to the device (via USB, AirDrop, email attachment, or cloud sync).
2. On iOS: Open in Files, then tap "Open in Safari" or "Open in Chrome."
3. On Android: Open in Chrome or Firefox from the Files app.
4. Connect to Wi-Fi once to load Google Fonts, then the tool works fully offline.

**Recommended:** Bookmark the file in the browser for one-tap access on a job site.

---

## Renaming the File

You can rename the file to anything that fits your workflow. Suggested names:

- `[YourCompany]-FlowCalc.html`
- `HVAC-Calculator.html`
- `field-calc.html`

Renaming does not affect functionality.

---

## Printing Calculation Results

Use your browser's built-in Print function (Ctrl+P / Cmd+P). The tool includes CSS print styles that automatically hide the "Add Zone" button and other interactive controls, leaving a clean printout of your inputs and results. This works in all major browsers.

---

## Updating the Tool

If you receive an updated version of the file, simply repeat your four customization edits in the new file and redeploy. Because the tool is stateless (no database), there is no migration step.

---

## Embedding in an Iframe

If you want to embed the calculator inside an existing webpage rather than linking to it directly:

```html
<iframe
  src="/tools/HVAC_flow_rate_calculator.html"
  width="100%"
  height="900"
  style="border: none;"
  title="HVAC Flow Rate Calculator">
</iframe>
```

Adjust the `height` value to match your page layout.
