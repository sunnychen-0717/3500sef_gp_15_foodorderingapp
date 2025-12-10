========================================================================
FOOD DELIVERY APP - INSTALLATION GUIDE
========================================================================

1. PREREQUISITES
------------------------------------------------------------------------
Before starting, ensure you have the following installed:
- Node.js (LTS version recommended)
  To check, open your terminal and run: node -v
  If missing, download it from: https://nodejs.org/

2. PROJECT SETUP
------------------------------------------------------------------------
1. Open Visual Studio Code.
2. Go to "File" > "Open Folder".
3. Select the folder named "Foodorderdelivery" (the one containing package.json).
4. Open the Integrated Terminal (Ctrl + `).

*** IMPORTANT: POWERHSHELL ERROR FIX ***
If you see an error saying "cannot be loaded because running scripts is disabled on this system", please run the following command in the Terminal:

   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

(If asked for confirmation, type 'Y' or 'A' and press Enter.)

3. INSTALL DEPENDENCIES
------------------------------------------------------------------------
Run the following command in the terminal to install React, Vite, and other required packages:

   npm install

4. FIX TAILWIND CSS VERSION (CRITICAL)
------------------------------------------------------------------------
To prevent compatibility issues with the latest Tailwind CSS v4, you must run this specific command to install the compatible v3 version:

   npm install tailwindcss@3.4.17 postcss autoprefixer

5. RUN THE APPLICATION
------------------------------------------------------------------------
Start the local development server by running:

   npm run dev

- You will see a local URL (e.g., http://localhost:5173).
- Ctrl + Click the link to open it in your browser.

6. VIEWING TIPS (MOBILE-FIRST)
------------------------------------------------------------------------
This app is designed for mobile devices. For the best experience on a desktop:
1. Press F12 to open Developer Tools.
2. Click the "Device Toggle" icon (looks like a phone/tablet).
3. Select a device (e.g., iPhone 12 or Pixel 5).

