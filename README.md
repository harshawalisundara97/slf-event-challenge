# QuickQuest — SLF Edu Expo QR Challenge

A mobile-first, static web app with three rounds in this order:
1. Technology quiz (3 multiple-choice questions)
2. General knowledge quiz (3 multiple-choice questions)
3. Event agenda ordering challenge (6 items)

The result screen then offers an optional interest form for name, contact number, and event-management interest. The participant must check the consent box before submitting. The app can be used without the form, too.

## Run locally

Open `index.html` in a browser. For a local web server, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Connect form responses to Google Sheets

1. Create a new Google Sheet called `QuickQuest Responses`.
2. Open **Extensions → Apps Script**.
3. Copy the code from `api/google-apps-script.gs` into `Code.gs` and save.
4. In Apps Script, choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to `Me` and **Who has access** to `Anyone`, then deploy and authorize it.
6. Copy the Web app URL ending in `/exec`.
7. Open `app.js` and replace the empty `DATA_ENDPOINT` value with that URL, for example:

   ```js
   const DATA_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```

8. If you change the Apps Script code later, use **Deploy → Manage deployments → Edit → New version → Deploy**.

**Privacy note:** Use participant information only for the stated event/volunteer follow-up purpose, limit access to the response Sheet, and delete the data when it is no longer needed. If many minors may participate, confirm the organiser's consent/data-handling requirements before collecting contact details. Do not collect photos/video consent through this form; ask separately before filming or posting identifiable footage.

## Deploy with GitHub + Vercel

1. Create a new GitHub repository (for example, `slf-event-challenge`) and push this project. **`index.html`, `style.css`, `app.js`, `vercel.json`, and the `api/` folder must sit at the repository root** — not inside a subfolder. (A nested subfolder is the most common cause of a Vercel 404: Vercel's Root Directory points at the repo root, so if `index.html` is one level down it finds nothing to serve.)
2. Go to Vercel and sign in with GitHub.
3. Select **Add New → Project** and import the repository.
4. Configure the project:
   - **Framework Preset:** Other (no framework).
   - **Root Directory:** `./` (the repository root — confirm `index.html` is listed there).
   - **Build Command:** leave blank.
   - **Output Directory:** leave as the default (root); do not set a build output.
5. Deploy. After it finishes, open the generated `vercel.app` URL on a phone and test the complete challenge and the form.
6. If you still see a 404: in the Vercel dashboard check **Settings → General → Root Directory** is `./`, and under **Settings → Deployment Protection** confirm protection is off (or you are signed in) so the public QR link is reachable.
7. Generate a QR code that points to the deployed URL. Print and test the QR code using at least two different phones before the expo.

## Before the expo

- Test each quiz answer and verify the maximum score is 90.
- Test the Google Sheet receives a test response before collecting real participants.
- Use a short privacy notice near the form and restrict Sheet access to authorised organisers.
- Do not promise prizes based only on scores unless the scoring and tie rules are clear.
