import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits | HabitFlow",
  description: "Manage and track your daily habits",
};

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
