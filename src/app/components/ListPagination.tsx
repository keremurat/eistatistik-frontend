"use client";

import { useEffect, useRef, useState } from "react";

type PaginationOptions = {
  fallbackPerPage?: number;
  rowHeight?: number;
};

export function useResponsivePagination<T>(items: T[], options: PaginationOptions = {}) {
  const { fallbackPerPage = 6, rowHeight = 64 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(fallbackPerPage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const desktop = window.matchMedia("(min-width:761px)");

    function recompute() {
      if (!container || !desktop.matches) {
        setPerPage(fallbackPerPage);
        return;
      }
      const head = container.querySelector("thead, .orders-table-head");
      const headHeight = head?.getBoundingClientRect().height ?? 34;
      const available = container.clientHeight - headHeight;
      setPerPage(Math.max(3, Math.floor(available / rowHeight)));
    }

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    desktop.addEventListener("change", recompute);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", recompute);
    };
  }, [fallbackPerPage, rowHeight]);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice((safePage - 1) * perPage, safePage * perPage);
  const emptyRows = pageItems.length > 0 ? Math.max(0, perPage - pageItems.length) : 0;

  function changePage(nextPage: number) {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
  }

  return { changePage, containerRef, emptyRows, page: safePage, pageItems, perPage, setPage, totalPages };
}

export function ListPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return <nav className="ms-pagination" aria-label="Sayfalama">
    <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>‹ Önceki</button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button
      type="button"
      key={number}
      className={number === page ? "active" : ""}
      aria-current={number === page ? "page" : undefined}
      onClick={() => onChange(number)}
    >{number}</button>)}
    <button type="button" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Sonraki ›</button>
  </nav>;
}
