import "./globals.css";

export const metadata = {
  title: "My Productivity",
  description: "Productivity dashboard app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}