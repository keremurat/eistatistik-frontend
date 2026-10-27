import type { Metadata } from "next";
import { DemoLanding } from "./DemoLanding";

export const metadata: Metadata = {
  title: "eistatistik — Yeni anasayfa demosu",
  description: "eistatistik için modern veri bilimi ve akademik danışmanlık anasayfa tasarım demosu.",
};

export default function DemoPage() {
  return <DemoLanding />;
}
