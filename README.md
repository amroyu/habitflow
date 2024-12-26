# HabitFlow

A modern habit tracking application built with Next.js, TypeScript, and Tailwind CSS. HabitFlow helps users build and maintain positive habits through an intuitive interface and gamification elements.

## Features

- **User Authentication**:
  - Email/Username & Password signup and login
  - Profile picture upload during registration
  - OAuth integration with Google and Twitter
  - Secure password handling
  
- **Modern UI/UX**:
  - Clean and intuitive interface
  - Responsive design for all devices
  - Dark/Light mode support
  - Beautiful login/signup pages with background images
  - Profile picture customization

- **Coming Soon**:
  - Goal Setting & Tracking
  - Achievement System
  - Real-time Updates
  - Progress Analytics
  - Social Features

## Tech Stack

- **Frontend**: 
  - Next.js 14 with App Router
  - React 18
  - TypeScript
  - Tailwind CSS
  
- **UI Components**:
  - Shadcn UI
  - Radix UI Primitives
  - Lucide Icons
  
- **Authentication**:
  - NextAuth.js (planned)
  - OAuth Providers
  
- **Development Tools**:
  - ESLint
  - Prettier
  - Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/amroyu/habitflow.git
   cd habitflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
habitflow/
├── src/
│   ├── app/          # App router pages
│   │   ├── login/    # Login page and layout
│   │   └── signup/   # Signup page and layout
│   ├── components/   
│   │   ├── ui/       # Reusable UI components
│   │   └── goals/    # Goal-related components
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript types
├── public/           
│   ├── logos/        # Logo variations
│   └── assets/       # Images and icons
└── tailwind.config.js
```

## Current Status

The project is in active development. Currently implemented:
- Complete authentication UI
- Profile picture upload functionality
- Responsive layouts
- Dark/Light mode support

Next planned features:
- Backend integration
- Database setup
- Goal tracking functionality
- User dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
