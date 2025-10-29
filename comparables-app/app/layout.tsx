import '../styles/globals.css';

export const metadata = {
  title: 'Comparables Viewer',
  description: 'View and manage comparable properties from OM documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
