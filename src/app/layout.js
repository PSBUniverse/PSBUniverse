import "./globals.css";

export const metadata = {
  title: "PSB Quote Engine",
  description: "Premium Steel Building - Quote Engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
