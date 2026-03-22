# SupportMe 🚀

**SupportMe** is a premium, Payhip-inspired platform built for creators to receive support, sell digital products, and track their funding goals. Seamlessly integrated with modern technologies, it provides a sleek and professional experience for both creators and their supporters.

![SupportMe Dashboard](https://raw.githubusercontent.com/ABHINAV1447/supportme/main/public/og-image.png) *(Placeholder for project image)*

## ✨ Features

- **🎨 Creator Profiles**: Beautifully designed, customizable storefronts for creators to showcase their work and bio.
- **🛒 Digital Products**: Effortlessly list and sell digital products with secure file delivery.
- **☕ Tipping & Support**: Receive direct financial support from your audience with personalized messages.
- **📊 Goal Tracking**: Set public funding goals to engage your community and track progress in real-time.
- **🚀 Explore Page**: Discover and support talented creators across the platform.
- **🛡️ Secure Authentication**: Robust user management powered by Clerk.
- **💳 Integrated Payments**: Smooth checkout experience using Razorpay.
- **🌓 Theme Support**: Fully responsive design with beautiful light and dark modes.

## 🛠️ Technical Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Webhooks**: [Svix](https://www.svix.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A PostgreSQL database (or Supabase)
- Accounts for Clerk, Razorpay, and Cloudinary

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ABHINAV1447/supportme.git
   cd supportme
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL="your_postgresql_url"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Razorpay Payments
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"
   RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

   # Cloudinary Storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📈 Roadmap

- [ ] Email notifications for new sales/tips.
- [ ] Advanced analytics for creators.
- [ ] Subscription models (Membership tiers).
- [ ] Multi-currency support.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [ABHINAV1447](https://github.com/ABHINAV1447)
