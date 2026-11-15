import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion";
import "lenis/dist/lenis.css";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <MotionProvider>
      <div className="flex min-h-dvh flex-col">
        <Header name={settings.name} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
