# GYM Management System - Frontend

React.js frontend application for the GYM Management System.

## Prerequisites

- Node.js 16+ and npm

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Update `src/config/firebase.js` with your Firebase configuration:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
     };
     ```

3. **Run the Application**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## Features

### Admin Module
- Member Management (Add/Update/Delete)
- Bill Management
- Fee Package Management
- Notification Management
- Report Export
- Supplement Store
- Diet Details Management

### Member Module
- View Bill Receipts
- View Notifications

### User Module
- View Details
- Search Records

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   ├── Member/
│   │   ├── User/
│   │   └── Auth/
│   ├── config/
│   ├── context/
│   └── App.js
├── package.json
└── README.md
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

