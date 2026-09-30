# EduPlay – UnityLearn (Vercel Deployment Guide)

EduPlay – UnityLearn is a gamified EdTech platform built with **React 19**, **Vite**, **Tailwind CSS (Claymorphism)**, and **Firebase (Firestore & Authentication)**.

---

## 🚀 Deploying to Vercel

### Option 1: Deploy with Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```
   * Set Build Command: `npm run build`
   * Set Output Directory: `dist`
   * Select Framework Preset: `Vite`

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

### Option 2: Deploy via GitHub / GitLab on Vercel Dashboard

1. Push this project to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com/new), click **"Add New" → "Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **Deploy**.

---

## 🔑 Environment Variables on Vercel

Under **Project Settings → Environment Variables** on Vercel, add the following variables:

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Your Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase Web App ID |
| `VITE_FIREBASE_DATABASE_ID` | Your Firestore Database ID |

*(Note: If `firebase-applet-config.json` is committed in the repository, the app will automatically fall back to it if environment variables are not set.)*

---

## 🔒 Fixing `Firebase: Error (auth/unauthorized-domain)`

When deploying on Vercel (`https://edu-play-five.vercel.app`), Firebase Authentication security prevents unauthorized domains from executing OAuth / popup sign-ins until you allowlist the domain.

### Steps to authorize your Vercel domain:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase Project (`ai-studio-71248ccc-ce76-4fcc-8c10-069d96633e27` or your custom project).
3. In the left navigation menu, go to **Build** → **Authentication**.
4. Click on the **Settings** tab (next to "Sign-in method" and "Users").
5. Scroll down to the **Authorized domains** section.
6. Click **Add domain**.
7. Enter your Vercel domain:
   * `edu-play-five.vercel.app`
   * *(Optional: Also add `vercel.app` for preview deployments)*
8. Click **Save**.

The domain will be active immediately, and login/sign-in popups on `https://edu-play-five.vercel.app/` will work seamlessly!

---

## ⚙️ Configuration Files Added

* `vercel.json`: Handles client-side SPA routing (`/(.*) → /index.html`) so sub-routes and deep links do not return 404s.
* `vite.config.ts`: Configured with modern ESM path resolution and `@tailwindcss/vite`.
