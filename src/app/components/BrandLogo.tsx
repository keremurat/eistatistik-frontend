"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function BrandLogo() {
  const [href, setHref] = useState("/dashboard");

  useEffect(() => {
    if (localStorage.getItem("eistatistik_role") === "admin") setHref("/admin");
  }, []);

  return (
    <Link className="brand" href={href} aria-label="Eİstatistik ana sayfa">
      <Image className="brand-logo" src="/Siyah e-istatistik.png" alt="Eİstatistik" width={300} height={69} priority />
    </Link>
  );
}
