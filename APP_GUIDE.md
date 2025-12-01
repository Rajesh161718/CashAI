# 📱 CashLoop - Complete App Guide

## 🌟 Overview

**CashLoop** is a modern, feature-rich financial management application built with React Native and Expo. It helps you track loans, income, expenses, and provides insightful financial reports with a beautiful, premium UI/UX.

---

## 🎯 Key Features

### 1. **Loans Management** (Home Tab)
Track money you've lent to others or borrowed from them with ease.

#### Features:
- **Dual Loan Types:**
  - **I Gave** - Money you lent to others
  - **I Took** - Money you borrowed from others

- **Smart Grouping:**
  - Automatically groups multiple transactions with the same person
  - Shows net balance per person (calculates if you owe them or they owe you)
  - Displays transaction count for each person

- **Active Loans Overview:**
  - Large, prominent net balance display
  - Color-coded: Green for money you'll receive, Red for money you need to pay
  - Summary cards showing total "You Gave" and "You Took"

- **Transaction Details:**
  - View all individual transactions per person
  - See dates, amounts, and notes for each transaction
  - Sync status indicators (cloud icons) for synced loans

- **Quick Actions:**
  - **Settle Button** - Mark all loans with a person as returned
  - **Pull to Refresh** - Sync with cloud (if logged in)

- **Hybrid Sync System:**
  - **Offline Mode:** Create private loans stored only on your device
  - **Online Mode:** Sync loans with friends who also use CashLoop
  - Search friends by phone number or name
  - **Two-way verification for synced transactions:**
    - When you create a synced loan, it's sent to your friend with status `PENDING`
    - Your friend receives a notification in their "Pending Requests" section
    - They can **Accept** (confirms the transaction) or **Reject** (declines it)
    - Once accepted, the loan becomes `ACTIVE` and appears in both users' active loans
    - If rejected, the transaction is removed from both accounts
    - Only the recipient can confirm/reject - the creator must wait for response
  - Status tracking: PENDING → ACTIVE → SETTLED
  - Real-time sync when pulling to refresh

---

### 2. **Add Transaction** (Central + Button)
Unified interface to add all types of financial transactions.

#### Transaction Types:

**A. Loans**
- Choose between "I Gave" or "I Took"
- **Sync Toggle:**
  - **ON:** Search and sync with CashLoop users
  - **OFF:** Private transaction (manual entry)
- Add person's name (or search by phone/name if syncing)
- Enter amount, date, and optional notes
- Real-time user search with avatar display

**B. Income**
- Track money you received
- Add source (Salary, Freelance, etc.)
- Enter amount and optional notes
- Automatically dated

**C. Expenses**
- Track money you spent
- Add category (Food, Transport, etc.)
- Enter amount and optional notes
- Automatically dated

#### UI Features:
- Smooth tab switching with animations
- Color-coded gradients per transaction type
- Keyboard-aware scrolling
- Form validation
- Beautiful gradient submit button

---

### 3. **Cash Flow** (Explore Tab)
Comprehensive view of your income and expenses.

#### Features:
- **Overview Card:**
  - Net balance (Income - Expenses)
  - Color-coded: Green for profit, Red for loss
  - Summary stats for total income and expenses

- **Filtering:**
  - View All transactions
  - Filter by Income only
  - Filter by Expense only
  - Pill-style filter buttons

- **Transaction List:**
  - Chronologically sorted (newest first)
  - Icon-based categorization
  - Shows date and notes
  - Swipe animations on load

- **Delete Functionality:**
  - Trash icon on each transaction
  - Confirmation dialog before deletion
  - Prevents accidental data loss

- **Pull to Refresh:**
  - Refresh transaction list
  - Smooth loading animation

---

### 4. **Reports** (Reports Tab)
Visual analytics and insights into your financial health.

#### Features:
- **Time Range Selector:**
  - Daily view
  - Weekly view
  - Monthly view
  - Smooth segment control

- **Summary Card:**
  - Large net balance display
  - Income vs Expense breakdown
  - Icon-based visual indicators

- **Top Expenses Chart:**
  - Horizontal bar chart
  - Shows top 5 expense categories
  - Animated bar fills
  - Percentage-based visualization
  - Amount labels

- **Smart Insights:**
  - AI-like feedback on spending habits
  - Positive reinforcement for saving
  - Warnings for overspending
  - Emoji-enhanced messages

- **Empty States:**
  - Helpful messages when no data exists
  - Encourages user to add transactions

---

### 5. **Settings** (Settings Tab)
Comprehensive app configuration and account management.

#### Sections:

**A. Account Section**
- **Logged In:**
  - Profile avatar with initial
  - Display name, phone, email
  - Edit profile button (opens modal)
  - Sign Out button
  
- **Not Logged In:**
  - Attractive gradient card
  - "Sign In to CashLoop" prompt
  - Explains sync benefits
  - Direct link to login

**B. Preferences**
- **Dark Mode Toggle:**
  - System-wide theme switching
  - Smooth transitions
  - Persists across app restarts
  
- **Notifications Toggle:**
  - Enable/disable notifications
  - (Placeholder for future implementation)

**C. Data Management**
- **Backup Data:**
  - Export all data as JSON
  - Includes loans, income, expenses, profile
  - Timestamped filename
  - Share via system share sheet
  
- **Export CSV:**
  - Export loans as CSV file
  - Compatible with Excel/Sheets
  - Includes all loan details
  
- **Clear All Data:**
  - Delete all transactions
  - Confirmation dialog
  - Irreversible action warning

**D. App Section**
- **Share App:**
  - Share CashLoop with friends
  - Pre-written message
  - System share sheet
  
- **Rate App:**
  - Link to app store (in production)
  - Encourages user feedback
  
- **Help & Support:**
  - Quick tips and tutorials
  - Contact information
  - Feature explanations

**E. About Section**
- **About App:**
  - Version information
  - Developer credits
  - Technology stack
  
- **Privacy Policy:**
  - Data storage explanation
  - Privacy assurances
  - Local-first approach

**F. Profile Editing Modal**
- Edit full name
- Edit mobile number
- Edit email address
- Keyboard-aware layout
- Save/Cancel buttons
- Validation

---

## 🎨 Design & UX Features

### Visual Design:
- **Premium Typography:** Custom Outfit font family
- **Color Palette:**
  - Accent Green: `#a8e6cf` (Money in)
  - Alert Red: `#ff6b6b` (Money out)
  - Gradient backgrounds
  - Adaptive dark/light themes

### Animations:
- **Moti-powered animations:**
  - Smooth page transitions
  - Staggered list item animations
  - Spring-based interactions
  - Progress bar animations
  - Modal slide-ins

### User Experience:
- **Pull-to-refresh** on all list screens
- **Empty states** with helpful messages
- **Loading states** with progress indicators
- **Confirmation dialogs** for destructive actions
- **Keyboard avoidance** on forms
- **Safe area handling** for all devices
- **Smooth scrolling** with optimized performance

---

## 🔐 Authentication & Sync

### Supabase Integration:
- **Phone/Email Login:**
  - OTP-based authentication
  - Secure sign-in flow
  - Session management
  
- **Profile Sync:**
  - Auto-sync user profile to cloud
  - Phone number verification
  - Email linking

- **Loan Sync:**
  - Real-time transaction sync
  - Friend search by phone/name
  - Status tracking (PENDING/ACTIVE/SETTLED)
  - Two-way verification
  - Conflict resolution

### Offline-First Architecture:
- **AsyncStorage** for local persistence
- Works without internet
- Syncs when online
- No data loss

---

## 📊 Data Structure

### Loans:
```typescript
{
  id: string
  name: string
  amount: number
  note: string
  date: string (ISO)
  type: 'given' | 'taken'
  returned: boolean
  isSynced?: boolean
  remoteId?: string
  status?: 'PENDING' | 'ACTIVE' | 'SETTLED_PENDING' | 'SETTLED' | 'REJECTED'
  friendId?: string
  friendPhone?: string
}
```

### Income:
```typescript
{
  id: string
  source: string
  amount: number
  note: string
  date: string (ISO)
}
```

### Expenses:
```typescript
{
  id: string
  category: string
  amount: number
  note: string
  date: string (ISO)
}
```

### User Profile:
```typescript
{
  name: string
  mobile: string
  email?: string
  age: string
  country: string
}
```

---

## 🚀 Getting Started

### First Launch:
1. **Welcome Screen** appears
2. Enter your details:
   - Full Name
   - Mobile Number
   - Age
   - Country
3. Tap "Get Started"
4. Animated loading screen
5. Redirected to Home (Loans) tab

### Adding Your First Transaction:
1. Tap the **central + button**
2. Choose transaction type (Loan/Income/Expense)
3. Fill in the details
4. Tap "Save Transaction"
5. View it in the respective tab

### Syncing with Friends:
1. Go to **Settings**
2. Tap "Sign In to CashLoop"
3. Enter phone/email
4. Verify OTP
5. Now you can sync loans with friends!

---

## 💡 Pro Tips

### Loans:
- Use the **Settle** button to quickly mark all transactions with a person as returned
- Add **notes** to remember context (e.g., "Birthday gift", "Dinner split")
- Use **Sync** feature for accountability with friends

### Cash Flow:
- Use **filters** to analyze income vs expenses separately
- Check the **net balance** regularly to stay on track
- Add detailed **categories** for better expense tracking

### Reports:
- Switch between **Daily/Weekly/Monthly** views for different insights
- Watch the **Top Expenses** chart to identify spending patterns
- Pay attention to **Insights** for financial health tips

### Settings:
- **Backup regularly** to prevent data loss
- Use **Export CSV** for external analysis
- Enable **Dark Mode** for comfortable night usage
- **Share the app** with friends to enable loan syncing

---

## 🛡️ Privacy & Security

- **Local-First:** All data stored on your device by default
- **No Tracking:** No analytics or tracking scripts
- **Optional Cloud:** Sync only if you choose to sign in
- **Encrypted:** Supabase uses industry-standard encryption
- **No Ads:** Completely ad-free experience

---

## 🔧 Technical Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **State Management:** React Context API
- **Local Storage:** AsyncStorage
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (OTP)
- **Animations:** Moti (Reanimated 2)
- **UI Components:** React Native core + Expo Vector Icons
- **Fonts:** Outfit (Google Fonts)
- **Gradients:** expo-linear-gradient

---

## 📱 App Structure

```
CashLoop/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Loans (Home)
│   │   ├── add.tsx            # Add Transaction
│   │   ├── explore.tsx        # Cash Flow
│   │   ├── reports.tsx        # Reports
│   │   └── settings.tsx       # Settings
│   ├── auth/
│   │   └── login.tsx          # Login Screen
│   ├── context/
│   │   ├── DataContext.tsx    # Data Management
│   │   └── AuthContext.tsx    # Authentication
│   ├── welcome.tsx            # Onboarding
│   └── _layout.tsx            # Root Layout
├── assets/
│   └── images/
│       └── logo.png           # App Logo
└── lib/
    └── supabase.ts            # Supabase Client
```

---

## 🎯 Use Cases

### Personal Finance Tracking:
- Track daily expenses
- Monitor income sources
- Analyze spending patterns
- Set financial goals

### Loan Management:
- Remember who owes you money
- Track money you borrowed
- Settle debts easily
- Maintain financial relationships

### Group Expenses:
- Split bills with friends
- Track shared expenses
- Sync with roommates
- Settle group debts

### Business Use:
- Track client payments
- Monitor business expenses
- Generate financial reports
- Export data for accounting

---

## 🆘 Troubleshooting

### Sync Not Working:
1. Check internet connection
2. Ensure you're logged in
3. Pull to refresh
4. Try logging out and back in

### Data Not Saving:
1. Check device storage
2. Restart the app
3. Clear app cache (Settings > Data Management)
4. Reinstall if necessary

### Can't Find Friend:
1. Ensure they have CashLoop installed
2. Verify they've completed onboarding
3. Check phone number format (+91...)
4. Try searching by name

---

## 📞 Support

For help and support:
- **Email:** support@cashloop.app
- **In-App:** Settings > Help & Support
- **Version:** 1.0.0

---

## 🎉 Future Features (Roadmap)

- [ ] Recurring transactions
- [ ] Budget planning
- [ ] Bill reminders
- [ ] Multiple currencies
- [ ] Receipt scanning
- [ ] Charts and graphs
- [ ] Export to PDF
- [ ] Widgets
- [ ] Apple Watch/Wear OS support
- [ ] Multi-language support

---

## ❤️ Credits

**Developed by:** Rajesh Biswal  
**Built with:** React Native, Expo, Supabase  
**Design:** Modern, Premium UI/UX  
**License:** Proprietary

---

**Made with ❤️ for better finance management**

*CashLoop v1.0.0 - Your Personal Finance Companion* 💰
