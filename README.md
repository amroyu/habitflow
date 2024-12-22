# HabitFlow

A modern habit tracking application built with Next.js, TypeScript, and Tailwind CSS. HabitFlow helps users build and maintain positive habits through an intuitive interface and gamification elements.

![HabitFlow Banner](public/banner.png)

## Features

- **Goal Setting & Tracking**: Set and track personal goals with customizable metrics
- **Achievement System**: Earn badges and rewards for consistent habit completion
- **Dark/Light Mode**: Seamless theme switching for comfortable viewing
- **Responsive Design**: Works perfectly on both desktop and mobile devices
- **Secure Authentication**: Protected routes and secure user data
- **Real-time Updates**: Instant feedback on habit completion and progress

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Context
- **Authentication**: NextAuth.js
- **Development**: ESLint, Prettier

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/habitflow.git
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
│   ├── components/   # React components
│   │   ├── dashboard/
│   │   ├── goals/
│   │   └── ui/
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript types
├── public/           # Static assets
└── tailwind.config.js # Tailwind configuration
```

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
- [TypeScript](https://www.typescriptlang.org/)
