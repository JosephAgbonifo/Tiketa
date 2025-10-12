# 🎟️ Tiketa — On-Chain Event Ticketing Platform

Tiketa is a modern, blockchain-powered **event ticketing platform** built with **Next.js**, **Node.js**, and the **Pi Network** for on-chain payments.  
It enables users to create, manage, and verify event tickets securely using **QR codes** and **decentralized transactions**, ensuring transparency and preventing fraud.

---

## 🚀 Features

- **Event Creation** — Organizers can create physical or online events with full details.
- **On-Chain Payments** — Pay for tickets using **Pi Network** crypto.
- **Smart Ticketing** — Unique, verifiable QR code for each ticket.
- **User Dashboard** — Manage your created and purchased tickets.
- **Verification System** — Scan and verify tickets instantly via camera or QR input.
- **Responsive Design** — Beautiful UI built with **Tailwind CSS** and **Lucide Icons**.

---

## 🛠️ Tech Stack

**Frontend**

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- Lucide Icons

**Backend**

- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Paystack / Pi Network integration (on-chain)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tiketa.git
cd tiketa
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Environment Variables

Create a `.env` file in both **frontend** and **backend** folders.

#### Backend `.env`

```env
SESSION_SECRET="session secret"
PI_API_KEY = "Apikey"
PLATFORM_API_URL="https://api.minepi.com"
MONGO_URI="Mongourl"
PORT=8765
```

#### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8765
```

### 4. Run the Project

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## 🔐 QR Code Verification

Each ticket generates a unique **QR code** that can be scanned using the built-in `QrScanner` component to validate authenticity and ownership directly from the blockchain.

---

## 🪙 Pi Network Integration

Tiketa integrates the **Pi SDK** to handle on-chain transactions securely and seamlessly for ticket payments.

---

## 📄 Pages Overview

| Route             | Description                 |
| ----------------- | --------------------------- |
| `/`               | Homepage                    |
| `/events`         | Browse all events           |
| `/create`         | Create a new event          |
| `/tickets`        | View your tickets           |
| `/tickets/verify` | Verify event tickets via QR |
| `/about`          | About Tiketa                |
| `/privacypolicy`  | Privacy Policy              |
| `/terms`          | Terms of Service            |

---

## 🧑‍💻 Development Notes

- Ensure the backend is running before using the frontend.
- If hosted on Render, use a pinging service (e.g., [UptimeRobot](https://uptimerobot.com/)) to prevent backend sleep.
- The app is fully mobile responsive and Pi Browser compatible.

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repository, submit issues, or open pull requests.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🌍 Credits

Developed by **[Your Name]**
Powered by **Next.js**, **Node.js**, and the **Pi Network**.

```

```
