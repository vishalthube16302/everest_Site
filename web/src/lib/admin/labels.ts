export const tableNames: Record<string, string> = {
  products: "Product",
  categories: "Category",
  category_groups: "Main category (old)",
  product_images: "Product photo",
  product_prices: "Price",
  product_media: "Film",
  services: "Service",
  testimonials: "Review",
  site_settings: "Company details",
  pages: "Menu link",
  gallery_images: "Gallery photo",
};

export function actionName(action: string) {
  return action === "insert" ? "added" : action === "remove" ? "removed" : "changed";
}

export function when(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
