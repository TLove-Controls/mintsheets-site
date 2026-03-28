# HVAC Flow Rate Calculator — Troubleshooting Guide

---

## Calculations Not Updating

**Symptom:** You type a number into a field and nothing happens — results don't change.

**Cause:** JavaScript is disabled or blocked in the browser.

**Fix:**
- In Chrome: Go to Settings → Privacy and Security → Site Settings → JavaScript → Allowed.
- In Firefox: Type `about:config` in the address bar, search for `javascript.enabled`, and set it to `true`.
- In Safari: Go to Preferences → Security → check "Enable JavaScript."
- If you opened the file from a corporate network or a restricted device, check with your IT department about browser script policies.

---

## Fonts Not Loading / Text Looks Wrong

**Symptom:** The tool loads but text looks like plain system font instead of the designed typeface. Numbers may appear wider or narrower than expected.

**Cause:** Google Fonts could not be reached — usually because the device is offline or the network blocks external font requests.

**Fix:**
- Connect to Wi-Fi or a mobile hotspot and reload the page. The fonts load once and may be cached for future offline use.
- If you are on a restricted corporate network, ask IT to whitelist `fonts.googleapis.com` and `fonts.gstatic.com`.
- The tool is fully functional without the custom fonts — only the visual appearance is affected.

---

## Layout Looks Broken or Columns Are Stacked Wrong

**Symptom:** Cards overlap, columns collapse on top of each other, or the layout looks compressed.

**Cause:** The tool requires a minimum display width of 320px. Very old or narrow browsers may also mishandle CSS Grid.

**Fix:**
- Ensure you are not using a browser from before 2018.
- On desktop, widen the browser window.
- On mobile, make sure the browser is not in a zoomed-in or "desktop site" mode that misreports the viewport width.
- Test in Chrome or Firefox if the issue persists in another browser.

---

## Duct Sizing Table Won't Add Zones

**Symptom:** Clicking "Add Zone" does nothing.

**Cause:** JavaScript is disabled (see above), or a browser extension is blocking event listeners.

**Fix:**
- Try in a private/incognito window, which disables most extensions.
- Disable ad blockers or script blockers temporarily and reload.

---

## Print Output Is Missing Results or Looks Wrong

**Symptom:** Printed page shows blank result fields, or interactive elements appear in the printout.

**Fix:**
- Make sure you are printing from a standard browser Print dialog (Ctrl+P / Cmd+P), not from a PDF printer driver that renders a screenshot.
- If results appear blank in the printout, fill in all input fields before printing and do not navigate away from the tab.
- In Chrome: Under "More settings" in the Print dialog, enable "Background graphics" for proper color rendering.

---

## File Looks Like Plain Text When Opened

**Symptom:** Opening the file shows raw HTML code instead of the calculator.

**Cause:** The file was opened with a text editor rather than a browser, or Windows associated `.html` files with a non-browser program.

**Fix:**
- Right-click the file → "Open with" → Choose Chrome, Firefox, Edge, or Safari.
- On Windows: Right-click → Properties → Change the default program to your browser.

---

## File Won't Open on iOS (Safari Shows Blank Page)

**Symptom:** On an iPhone or iPad, tapping the file in Files or email shows a blank white page.

**Fix:**
- Tap and hold the file, then choose "Open in Safari" or "Open in Chrome."
- Alternatively, host the file on a web server and open the URL in Safari — locally hosted HTML files occasionally have permission issues on iOS depending on how they were transferred.

---

## Customization Edits Not Showing Up

**Symptom:** You edited the file, saved it, and refreshed the browser — but still see "Your HVAC Co."

**Fix:**
- Hard-refresh the browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac). This bypasses the browser cache.
- Confirm you saved the file with the correct name and extension (`.html`, not `.html.txt`).
- Confirm you are opening the edited file, not the original downloaded copy.

---

## Something Else Is Wrong

If your issue is not listed here, the fastest path to a fix is to:

1. Note the browser and version you are using (Help → About in any browser).
2. Note the device type (phone, tablet, laptop) and operating system.
3. Describe what you expected to happen vs. what actually happened.
4. Take a screenshot if possible.

With that information, most issues can be diagnosed and resolved quickly.
