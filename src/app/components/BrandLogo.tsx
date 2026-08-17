"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";

const subscribeToRole = () => () => undefined;

export function BrandLogo() {
  const role = useSyncExternalStore(subscribeToRole, () => localStorage.getItem("eistatistik_role"), () => "musteri");
  const href = role === "admin" ? "/admin" : role === "editor" ? "/editor" : "/dashboard";

  return (
    <Link className="brand" href={href} aria-label="eistatistik ana sayfa">
      <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="eistatistik" width={300} height={69} priority />
    </Link>
  );
}
