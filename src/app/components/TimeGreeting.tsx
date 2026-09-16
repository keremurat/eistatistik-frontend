"use client";

import { useEffect, useState } from "react";

type Greeting = "Günaydın" | "Tünaydın" | "İyi akşamlar";

function greetingFor(date: Date): Greeting {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 18) return "Tünaydın";
  return "İyi akşamlar";
}

export function TimeGreeting({ name }: { name?: string }) {
  const [greeting, setGreeting] = useState<Greeting | "Merhaba">("Merhaba");

  useEffect(() => {
    const updateGreeting = () => setGreeting(greetingFor(new Date()));
    updateGreeting();
    const interval = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return <>{greeting}{name ? `, ${name}` : ""}.</>;
}
