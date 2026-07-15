# NexusOS — Personal Productivity Website

## 1. Run it on your computer first

Step 1: Install Node.js (version 18 or higher) from https://nodejs.org if you don't have it.

Step 2: Open a terminal inside this folder and run:
```
npm install
```

Step 3: Start the website:
```
npm run dev
```

Step 4: Open the link it shows (usually http://localhost:5173) in your browser.

Your tasks, notes, and goals will save automatically in your browser (using localStorage).

## 2. Deploy it for free (Vercel — easiest way)

Step 1: Create a free account at https://vercel.com (you can sign in with GitHub).

Step 2: Put this project on GitHub:
```
git init
git add .
git commit -m "first commit"
```
Create a new empty repo on github.com, then run the two commands GitHub shows you (git remote add ... and git push ...).

Step 3: On vercel.com, click "Add New Project", pick your GitHub repo, and click "Deploy".
Vercel will detect it's a Vite project automatically. No settings needed.

Step 4: In 1-2 minutes, Vercel gives you a live link like `nexusos.vercel.app`. That's your real website.

## 3. Alternative — Netlify (drag and drop, no GitHub needed)

Step 1: Run:
```
npm run build
```
This creates a `dist` folder.

Step 2: Go to https://app.netlify.com/drop and drag the `dist` folder into the page.

Step 3: Netlify gives you a live link right away.

## About the "AI suggestions" feature (Insights page)

Inside Claude's chat, this button works automatically. On your own deployed website,
it needs an Anthropic API key on a server (never put an API key directly in frontend code,
it is not safe). If you don't set this up, the button will just show a friendly error message —
everything else on the site still works normally. If you want, ask Claude to help you add
a small serverless function (Vercel Function) to power this safely.

## About the AI voice input

The mic button uses your browser's built-in speech recognition. It works in Chrome and Edge,
but not in Safari or Firefox.
