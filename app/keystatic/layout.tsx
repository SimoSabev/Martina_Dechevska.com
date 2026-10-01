import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Content editor",
  robots: { index: false, follow: false },
};

export default function Layout() {
  return <KeystaticApp />;
}
