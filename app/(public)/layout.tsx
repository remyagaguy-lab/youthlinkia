import { PublicHeader } from "@/components/ui/PublicHeader";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      <PublicHeader />
      {children}
      <BottomNavigation />
    </div>
  );
}
