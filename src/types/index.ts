export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  long_description: string;
  image_url: string;
  price_range: string;
  specifications: Record<string, any>;
  is_featured: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_company: string;
  author_role: string;
  content: string;
  rating: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  description: string;
  sort_order: number;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  category_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  working_hours: string;
  google_maps_embed: string;
  about_text: string;
  mission: string;
  vision: string;
  gst_number: string;
  company_name_color: string;
}

export interface Page {
  id: string;
  label: string;
  path: string;
  is_enabled: boolean;
  sort_order: number;
}
