/**
 * App Layout - Uses Header component
 */
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8 bg-background">{children}</main>
    </div>
  );
}
