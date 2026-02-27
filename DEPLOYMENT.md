# LogisticsVisionBeta — Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project: `logisticsvisionbeta`
- Authenticated: `firebase login`

---

## 1. Environment Variables

### Local Development

```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

### Production (Firebase App Hosting)

Set environment variables via the Firebase Console or `apphosting.yaml`:

```bash
firebase apphosting:secrets:set GOOGLE_AI_API_KEY
firebase apphosting:secrets:set FIREBASE_ADMIN_SDK_PATH
```

### Production (Vercel)

Add each `NEXT_PUBLIC_*` variable in:
**Vercel Dashboard → Project → Settings → Environment Variables**

Or via CLI:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add GOOGLE_AI_API_KEY
# ... repeat for all variables in .env.local.example
```

---

## 2. Deploy Security Rules

Deploy Firestore and Storage rules to Firebase:

```bash
# Deploy both Firestore and Storage rules
firebase deploy --only firestore,storage

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage
```

> **Important:** Rules must be deployed before the app goes live to ensure
> proper access control. Verify rules in Firebase Console after deployment.

---

## 3. Run Setup Scripts

### Set Up Admin User

Creates the initial admin user with Firebase custom claims:

```bash
npm run setup:admin
```

> Requires `FIREBASE_ADMIN_SDK_PATH` to point to a valid service account JSON.

### Seed Customer Data

Seeds initial customer data into Firestore:

```bash
npm run setup:customers
```

---

## 4. Firebase Custom Claims

Admin users require the `admin: true` custom claim set via Firebase Admin SDK.

Use the Firebase Console (Firestore) or the setup script:

```bash
npm run setup:admin
```

Or programmatically via Admin SDK:
```typescript
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

---

## 5. Build & Deploy

```bash
# Type-check before deploying
npm run typecheck

# Lint check
npm run lint

# Build production bundle
npm run build

# Deploy to Firebase App Hosting
firebase deploy
```

---

## 6. Production Checklist

Before going live, verify:

- [ ] All environment variables set in production platform
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no warnings
- [ ] Firestore and Storage rules deployed via `firebase deploy --only firestore,storage`
- [ ] Admin custom claims set for admin users
- [ ] Setup scripts run: `npm run setup:admin && npm run setup:customers`
- [ ] All Firestore collections properly configured
- [ ] App functionality tested: dashboard, trips, invoices, payroll, etc.
- [ ] Firebase Authentication providers enabled (Google, Email/Password)
- [ ] CORS and security headers configured

---

## 7. Required Firebase Configuration

Ensure the following are enabled in your Firebase project:

- **Authentication**: Google provider + Email/Password
- **Firestore Database**: Production mode (rules enforce access control)
- **Storage**: Default bucket (`logisticsvisionbeta.firebasestorage.app`)
- **App Hosting** or **Hosting**: Configured for Next.js framework
