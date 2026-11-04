import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "E-posta Doğrulama | eistatistik",
  referrer: "no-referrer",
};

export default function ConfirmationPage() {
  return <Suspense fallback={<main className="auth-page" aria-busy="true" />}>
    <ConfirmationClient />
  </Suspense>;
}
