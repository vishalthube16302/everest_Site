"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "./client";

export type CategoryRow = { id: string; name: string; slug: string; is_active: boolean; sort_order: number };
export type ProductRow = { id: string; name: string; slug: string; category_id: string | null; is_active: boolean };

// Categories and products for dropdowns. reload() after a change.
export function useCatalogue() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const [c, p] = await Promise.all([
      db().from("categories").select("id,name,slug,is_active,sort_order").order("sort_order"),
      db().from("products").select("id,name,slug,category_id,is_active").order("name"),
    ]);
    setCategories((c.data ?? []) as CategoryRow[]);
    setProducts((p.data ?? []) as ProductRow[]);
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, products, ready, reload };
}
