# Hobbiton Insurance Quote Calculator

A modern React-based motor insurance quote calculator built with TypeScript, Tailwind CSS, and Firebase integration.

## 🚀 Features

- **Multi-step Form**: Intuitive step-by-step quote process
- **Real-time Calculation**: Dynamic premium calculation based on user inputs
- **Responsive Design**: Fully responsive UI that works on all devices
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Modern, utility-first styling
- **Firebase Integration**: User authentication and quote persistence
- **Form Validation**: Client-side validation with immediate feedback
- **Quote Management**: Save, load, and manage multiple quotes
- **Premium Breakdown**: Detailed breakdown of premium calculation
- **Progress Tracking**: Visual progress indicator and summary panel

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Firebase** - Backend services (Auth & Firestore)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hobbiton-insurance
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Anonymous) and Firestore
   - Update the Firebase configuration in `src/config/firebase.ts`

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Anonymous sign-in
3. Create a Firestore database
4. Update the configuration in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

## 📁 Project Structure

```
src/
├── components/
│   ├── steps/
│   │   ├── VehicleStep.tsx
│   │   ├── DriverStep.tsx
│   │   ├── CoverageStep.tsx
│   │   └── QuoteStep.tsx
│   ├── Modal.tsx
│   ├── SummaryPanel.tsx
│   └── SavedQuotes.tsx
├── config/
│   └── firebase.ts
├── types/
│   └── index.ts
├── utils/
│   └── quoteCalculator.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Usage

1. **Start a Quote**: Fill out vehicle information
2. **Driver Details**: Enter personal and driving information
3. **Coverage Selection**: Choose coverage type and excess amount
4. **Review Quote**: View calculated premium and breakdown
5. **Save Quote**: Save for future reference or start a new quote

## 🧮 Quote Calculation

The premium is calculated based on:

- **Base Premium**: K500
- **Vehicle Factors**: Age, make, model
- **Driver Factors**: Age, experience, claims history
- **Coverage Type**: Comprehensive, Third Party, etc.
- **Excess Amount**: Higher excess = lower premium

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔒 Environment Variables

Create a `.env` file for Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@hobbitoninsurance.com or create an issue in the repository.

## 🔄 Changelog

### v1.0.0

- Initial release
- Multi-step quote form
- Firebase integration
- Responsive design
- TypeScript implementation
