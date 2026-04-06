import { ViteReactSSG } from "vite-react-ssg";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useLocation, Link, useLoaderData, useSearchParams, redirect, useNavigate, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { Phone, X, Menu, Mail, MapPin, Share2, MessageCircle, ShoppingBag, ArrowRight, ChevronDown, Zap, Shield, Truck, Wrench, CheckCircle2, SlidersHorizontal, ArrowLeft, ChevronLeft, ChevronRight, Check, BookOpen, Headphones, Settings, Clock, Home as Home$1, LogIn, Plus, Loader, Upload, ImagePlus, GripVertical, Edit2, Trash2, EyeOff, Eye, RefreshCw, Copy, Loader2, ArrowUp, ArrowDown, LogOut, Package, Image, MessageSquare } from "lucide-react";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
const supabaseUrl = "https://vbemwnwmssuzmzxyozmp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZW13bndtc3N1em16eHlvem1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzUyNDEsImV4cCI6MjA3OTMxMTI0MX0.ZBAS_PX4YdylRkbfnoskTLFHCsZpwIGCBVktuUA7sNM";
const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL$1 = "https://everesthps.com";
function buildLocalBusinessSchema(s) {
  const phone = (s == null ? void 0 : s.phone) || "+91-8855820105";
  const email = (s == null ? void 0 : s.email) || "everesthps@gmail.com";
  const gst = (s == null ? void 0 : s.gst_number) || "27ATEPT3692E1ZD";
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL$1}/#localbusiness`,
    name: "Everest Hydro Pneumatic Solutions",
    description: "Manufacturer & supplier of industrial air compressors and material handling equipment based in Chakan, Pune, Maharashtra. Serving manufacturing, automotive, dental, construction, and packaging industries across India since 2020.",
    url: BASE_URL$1,
    telephone: phone.replace(/\s/g, ""),
    email,
    image: `${BASE_URL$1}/favicon.svg`,
    priceRange: "INR",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Bank Transfer, UPI",
    taxID: gst,
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 11
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kalp Residency, 109 B Wing, Chakan Shikrapur Road",
      addressLocality: "Chakan, Pune",
      addressRegion: "Maharashtra",
      postalCode: "410501",
      addressCountry: "IN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.7606,
      longitude: 73.861
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "State", name: "Maharashtra" },
      { "@type": "Country", name: "India" }
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      opens: "09:00",
      closes: "18:30"
    },
    sameAs: [
      "https://www.indiamart.com/everesthydro-pneumatic-solution"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone.replace(/\s/g, ""),
      contactType: "sales",
      availableLanguage: ["English", "Hindi", "Marathi"]
    }
  };
}
function parsePriceRange(raw) {
  if (!raw) return null;
  const nums = raw.replace(/[₹,]/g, "").match(/[\d]+/g);
  if (!nums || nums.length === 0) return null;
  const parsed = nums.map(Number).filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return null;
  return {
    low: Math.min(...parsed),
    high: Math.max(...parsed)
  };
}
function buildProductSchema(p) {
  const url = `${BASE_URL$1}/products/${p.slug}`;
  const prices = parsePriceRange(p.price_range);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || `${p.name} — industrial equipment by Everest HPS, Pune.`,
    image: p.image_url || `${BASE_URL$1}/favicon.svg`,
    url,
    brand: {
      "@type": "Brand",
      name: "Everest Hydro Pneumatic Solutions"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Everest Hydro Pneumatic Solutions",
      url: BASE_URL$1
    }
  };
  if (p.categoryName) {
    schema.category = p.categoryName;
  }
  if (prices) {
    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: prices.low,
      highPrice: prices.high,
      offerCount: 1,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Everest Hydro Pneumatic Solutions"
      }
    };
  }
  return schema;
}
function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL$1}${item.path}`
    }))
  };
}
function buildFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
function Header() {
  var _a, _b;
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("pages").select("*").eq("is_enabled", true).order("sort_order")
      ]);
      if (s) setSettings(s);
      if (p) setNavItems(p);
    };
    fetchData();
  }, []);
  const isSettingsLoaded = settings !== null;
  const companyName = isSettingsLoaded ? ((_a = settings.company_name) == null ? void 0 : _a.trim()) || "" : "Everest HPS";
  const tagline = ((_b = settings == null ? void 0 : settings.tagline) == null ? void 0 : _b.trim()) || "";
  const showText = companyName.length > 0;
  const primary = (settings == null ? void 0 : settings.primary_color) || "#0f3460";
  const accent = (settings == null ? void 0 : settings.accent_color) || "#e94560";
  const isActive = (path) => location.pathname === path;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "hidden md:block text-white text-xs py-1.5", style: { backgroundColor: primary }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "opacity-75", children: "Mon – Sat: 9:00 AM – 6:30 PM IST" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
        (settings == null ? void 0 : settings.phone) && /* @__PURE__ */ jsxs("a", { href: `tel:${settings.phone}`, className: "flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsx(Phone, { size: 12 }),
          settings.phone
        ] }),
        (settings == null ? void 0 : settings.email) && /* @__PURE__ */ jsx("a", { href: `mailto:${settings.email}`, className: "opacity-90 hover:opacity-100 transition-opacity", children: settings.email })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("header", { className: "bg-white border-b border-gray-100 sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-3 shrink-0", children: [
          (settings == null ? void 0 : settings.logo_url) ? /* @__PURE__ */ jsx("img", { src: settings.logo_url, alt: companyName || "Logo", className: "h-10 w-auto object-contain" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg flex-shrink-0", style: { backgroundColor: primary } }),
          showText && /* @__PURE__ */ jsx("div", { className: "hidden sm:flex flex-col justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-extrabold text-4xl tracking-wide leading-none",
                style: { color: (settings == null ? void 0 : settings.company_name_color) || "#ffffff" },
                children: companyName
              }
            ),
            tagline && /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-xs font-medium tracking-wide opacity-80",
                style: { color: primary },
                children: tagline
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center gap-1", children: navItems.map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            to: item.path,
            className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`,
            style: isActive(item.path) ? { backgroundColor: primary } : {},
            children: item.label
          },
          item.path
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          (settings == null ? void 0 : settings.whatsapp) && /* @__PURE__ */ jsx(
            "a",
            {
              href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-sm font-medium text-green-700 hover:text-green-800 transition-colors",
              children: "WhatsApp"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: "px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90",
              style: { backgroundColor: accent },
              children: "Get Quote"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors",
            onClick: () => setIsOpen(!isOpen),
            children: isOpen ? /* @__PURE__ */ jsx(X, { size: 20 }) : /* @__PURE__ */ jsx(Menu, { size: 20 })
          }
        )
      ] }),
      isOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden border-t border-gray-100 bg-white", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col p-3 gap-1", children: [
        navItems.map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            to: item.path,
            onClick: () => setIsOpen(false),
            className: `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? "text-white" : "text-gray-700 hover:bg-gray-100"}`,
            style: isActive(item.path) ? { backgroundColor: primary } : {},
            children: item.label
          },
          item.path
        )),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-gray-100 mt-1 flex flex-col gap-2", children: [
          (settings == null ? void 0 : settings.whatsapp) && /* @__PURE__ */ jsx(
            "a",
            {
              href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "px-4 py-2.5 rounded-lg text-sm font-medium text-center text-green-700 bg-green-50",
              children: "Chat on WhatsApp"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              onClick: () => setIsOpen(false),
              className: "px-4 py-2.5 rounded-lg text-sm font-semibold text-center text-white",
              style: { backgroundColor: accent },
              children: "Get a Quote"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
function Footer() {
  var _a;
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);
  const companyName = ((_a = settings == null ? void 0 : settings.company_name) == null ? void 0 : _a.trim()) || "Everest HPS";
  const tagline = settings == null ? void 0 : settings.tagline;
  const primary = (settings == null ? void 0 : settings.primary_color) || "#ffffff";
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "bg-[#0a2240] text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          (settings == null ? void 0 : settings.logo_url) && /* @__PURE__ */ jsx(
            "img",
            {
              src: settings.logo_url,
              alt: companyName,
              className: "h-8 w-auto object-contain brightness-0 invert"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-extrabold text-4xl tracking-wide leading-none",
                style: { color: "#ffffff" },
                children: companyName
              }
            ),
            tagline && /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-xs font-medium tracking-wide opacity-80",
                style: { color: primary },
                children: tagline
              }
            )
          ] })
        ] }),
        (settings == null ? void 0 : settings.whatsapp) && /* @__PURE__ */ jsx(
          "a",
          {
            href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all",
            children: "WhatsApp Us"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-wider text-blue-300 mb-4", children: "Navigation" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: ["/", "/products", "/services", "/about", "/contact"].map((path, i) => {
          const labels = ["Home", "Products", "Services", "About", "Contact"];
          return /* @__PURE__ */ jsx(Link, { to: path, className: "text-blue-200 hover:text-white text-sm transition-colors", children: labels[i] }, path);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-wider text-blue-300 mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          (settings == null ? void 0 : settings.phone) && /* @__PURE__ */ jsxs("a", { href: `tel:${settings.phone}`, className: "flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors", children: [
            /* @__PURE__ */ jsx(Phone, { size: 14 }),
            " ",
            settings.phone
          ] }),
          (settings == null ? void 0 : settings.email) && /* @__PURE__ */ jsxs("a", { href: `mailto:${settings.email}`, className: "flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors", children: [
            /* @__PURE__ */ jsx(Mail, { size: 14 }),
            " ",
            settings.email
          ] }),
          (settings == null ? void 0 : settings.address) && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-blue-200 text-sm", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 14, className: "mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "leading-relaxed", children: settings.address })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-wider text-blue-300 mb-4", children: "Working Hours" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm leading-relaxed", children: (settings == null ? void 0 : settings.working_hours) || "Mon – Sat: 9:00 AM – 6:30 PM IST" }),
        (settings == null ? void 0 : settings.gst_number) && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-400 mb-1", children: "GST Registration" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-200 font-mono", children: settings.gst_number })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-blue-400", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        currentYear,
        " ",
        /* @__PURE__ */ jsx("span", { style: { color: primary }, children: companyName }),
        ". All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "hover:text-white transition-colors", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "hover:text-white transition-colors", children: "Terms & Conditions" })
      ] })
    ] })
  ] }) });
}
function formatPrice(raw) {
  if (!raw) return "Price on Request";
  const cleaned = raw.replace(/Price\s*Range\s*:?-?\s*/gi, "").replace(/Price\s*:?-?\s*/gi, "").replace(/₹/g, "").trim();
  if (!cleaned || cleaned === "0") return "Price on Request";
  if (/^\d+$/.test(cleaned)) {
    return `₹${parseInt(cleaned, 10).toLocaleString("en-IN")}`;
  }
  const rangeMatch = cleaned.match(/^([\d,]+)\s*[-–]\s*([\d,]+)$/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    const hi = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    return `₹${lo.toLocaleString("en-IN")} – ₹${hi.toLocaleString("en-IN")}`;
  }
  return cleaned.startsWith("₹") ? cleaned : `₹${cleaned}`;
}
function truncate(str, n) {
  if (!str) return "";
  return str.length <= n ? str : str.slice(0, n).trimEnd() + "…";
}
function ShareButton({ productName, url, categoryName, description, specifications, imageUrl, price }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getFormattedText = () => {
    let text = `*${productName}*
`;
    if (categoryName) {
      text += `Category: ${categoryName}
`;
    }
    if (price && price !== "Price on Request") {
      text += `Price: ${price}
`;
    }
    text += `
`;
    if (description) {
      const firstLine = description.split("\n")[0].trim();
      if (firstLine) text += `${firstLine}

`;
    }
    if (specifications) {
      const specEntries = Array.isArray(specifications) ? specifications : Object.entries(specifications);
      const validEntries = specEntries.filter(([, v]) => String(v).trim() && String(v).trim() !== "0").slice(0, 5);
      if (validEntries.length > 0) {
        text += `*Specifications:*
`;
        validEntries.forEach(([key, value]) => {
          text += `• ${key}: ${value}
`;
        });
        text += `
`;
      }
    }
    text += `Check it out: ${url}`;
    text += `

*Everest HPS* — +91-8855820105`;
    if (imageUrl) {
      text += `

Image: ${imageUrl}`;
    }
    return text;
  };
  const handleNativeShare = async () => {
    const text = getFormattedText();
    const shareData = { title: productName, text, url };
    if (imageUrl && navigator.canShare && navigator.canShare({ files: [new File([], "test.png")] })) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "product-image.jpg", { type: blob.type });
        if (navigator.canShare({ files: [file] })) shareData.files = [file];
      } catch (e) {
        console.warn("Failed to fetch image for sharing", e);
      }
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") setIsOpen(true);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };
  const handleWhatsAppShare = () => {
    const text = getFormattedText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setIsOpen(false);
  };
  const handleEmailShare = () => {
    const subject = `Product Enquiry — ${productName}`;
    const body = getFormattedText();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative inline-block text-left", ref: menuRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => "share" in navigator ? handleNativeShare() : setIsOpen(!isOpen),
        className: "p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors",
        "aria-label": "Share product",
        title: "Share",
        children: /* @__PURE__ */ jsx(Share2, { size: 20 })
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5", children: /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 text-sm text-gray-500 border-b border-gray-100 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { children: "Share via" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsx(X, { size: 14 }) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleWhatsAppShare,
          className: "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600",
          children: [
            /* @__PURE__ */ jsx(MessageCircle, { size: 16, className: "mr-3" }),
            "WhatsApp"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleEmailShare,
          className: "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600",
          children: [
            /* @__PURE__ */ jsx(Mail, { size: 16, className: "mr-3" }),
            "Email"
          ]
        }
      )
    ] }) })
  ] });
}
function ProductCard({ product, categoryName }) {
  const price = formatPrice(product.price_range);
  const isPOR = price === "Price on Request";
  return /* @__PURE__ */ jsxs("div", { className: "group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200", children: [
    /* @__PURE__ */ jsx(Link, { to: `/products/${product.slug}`, className: "block relative", children: /* @__PURE__ */ jsx("div", { className: "relative h-44 bg-gray-50 overflow-hidden", children: product.image_url ? /* @__PURE__ */ jsx(
      "img",
      {
        src: product.image_url,
        alt: product.name,
        className: "w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsx(ShoppingBag, { size: 40 }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 z-10", children: /* @__PURE__ */ jsx(
      ShareButton,
      {
        productName: product.name,
        url: `${window.location.origin}/products/${product.slug}`,
        categoryName,
        description: product.description,
        specifications: product.specifications,
        imageUrl: product.image_url,
        price
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(Link, { to: `/products/${product.slug}`, children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 text-sm leading-snug hover:text-[#0f3460] transition-colors line-clamp-2", children: product.name }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed line-clamp-2", children: truncate(product.description ?? "", 90) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx("span", { className: `text-sm font-semibold ${isPOR ? "text-gray-400 italic" : "text-[#0f3460]"}`, children: price }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: `/products/${product.slug}`,
            className: "text-xs font-semibold text-white bg-[#e94560] hover:bg-[#c73652] px-3 py-1.5 rounded-lg transition-colors",
            children: "View Details"
          }
        )
      ] })
    ] })
  ] });
}
const BASE_URL = "https://everesthps.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/favicon.svg`;
function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  schemas
}) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}` : BASE_URL;
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: fullCanonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: ogType }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: fullCanonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: resolvedOgImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Everest Hydro Pneumatic Solutions" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: resolvedOgImage }),
    schemas == null ? void 0 : schemas.map((schema, i) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(schema) }, i))
  ] });
}
async function loader$4() {
  const [settingsRes, categoriesRes, testimonialsRes, productsRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*").eq("is_featured", true).order("sort_order").limit(6)
  ]);
  return {
    settings: settingsRes.data,
    categories: categoriesRes.data || [],
    testimonials: testimonialsRes.data || [],
    featuredProducts: productsRes.data || []
  };
}
function Home() {
  const { settings, categories, testimonials, featuredProducts } = useLoaderData();
  const primary = (settings == null ? void 0 : settings.primary_color) || "#0f3460";
  const accent = (settings == null ? void 0 : settings.accent_color) || "#e94560";
  const features = [
    { icon: Zap, label: "Wide Range", desc: "50+ product models" },
    { icon: Shield, label: "Quality Tested", desc: "ISO-grade standards" },
    { icon: Truck, label: "Fast Delivery", desc: "Pan-India shipping" },
    { icon: Wrench, label: "Free Setup", desc: "Installation included" }
  ];
  const industries = ["Manufacturing", "Automotive", "Dental & Medical", "Construction", "Packaging"];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Air Compressor Supplier Pune | Everest Hydro Pneumatic Solutions",
        description: "Manufacturer & supplier of industrial air compressors, screw & oil-free compressors, and material handling equipment in Pune. Free pan-India delivery.",
        canonical: "/"
      }
    ),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative min-h-[68vh] flex flex-col justify-center overflow-hidden",
        style: { backgroundColor: primary },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 opacity-[0.04]",
              style: {
                backgroundImage: `repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),
              repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)`
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border",
                  style: { color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` },
                  children: "Established 2020 · Pune, India"
                }
              ),
              /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-4", children: (settings == null ? void 0 : settings.tagline) || "Engineering Power. Delivering Trust." }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-base md:text-lg leading-relaxed mb-8 max-w-md", children: "Manufacturer & supplier of industrial air compressors and material handling equipment — built for performance, priced for value." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/products",
                    className: "inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg text-white transition-opacity hover:opacity-90",
                    style: { backgroundColor: accent },
                    children: [
                      "Explore Products ",
                      /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/about",
                    className: "inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors",
                    children: "About Us"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:grid grid-cols-2 gap-4", children: [
              { num: "50+", label: "Product Models" },
              { num: "5+", label: "Years Experience" },
              { num: "200+", label: "Happy Clients" },
              { num: "100%", label: "Free Installation" }
            ].map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-5 border border-white/10", style: { backgroundColor: "rgba(255,255,255,0.06)" }, children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white mb-1", children: s.num }),
              /* @__PURE__ */ jsx("div", { className: "text-blue-300 text-sm", children: s.label })
            ] }, s.label)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce", children: /* @__PURE__ */ jsx(ChevronDown, { size: 20, className: "text-white/40" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "border-b border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100", children: features.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-6 py-5", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", style: { backgroundColor: `${primary}12` }, children: /* @__PURE__ */ jsx(Icon, { size: 20, style: { color: primary } }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 text-sm", children: label }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: desc })
      ] })
    ] }, label)) }) }) }),
    categories.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest mb-1", style: { color: accent }, children: "What we offer" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Product Categories" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/products", className: "hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors", children: [
          "All products ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: categories.map((cat) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/products?category=${cat.slug}`,
          className: "group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "h-36 bg-gray-100 relative overflow-hidden", children: [
              cat.image_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: cat.image_url,
                  alt: `${cat.name} — Everest HPS products`,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full", style: { background: `linear-gradient(135deg, ${primary}15, ${primary}30)` } }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 h-10",
                  style: { background: "linear-gradient(to top, rgba(255,255,255,0.9), transparent)" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 text-sm mb-1 group-hover:text-[#0f3460] transition-colors", children: cat.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3", children: truncate(cat.description, 80) }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 text-xs font-semibold",
                  style: { color: accent },
                  children: [
                    "View range ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
                  ]
                }
              )
            ] })
          ]
        },
        cat.id
      )) })
    ] }) }),
    featuredProducts.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest mb-1", style: { color: accent }, children: "Bestsellers" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Featured Products" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/products", className: "hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors", children: [
          "View all ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredProducts.map((product) => {
        const cat = categories.find((c) => c.id === product.category_id);
        return /* @__PURE__ */ jsx(ProductCard, { product, categoryName: cat == null ? void 0 : cat.name }, product.id);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 text-center md:hidden", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/products",
          className: "inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors",
          children: [
            "View all products ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6", children: "Industries we serve" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-3", children: industries.map((ind) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "px-4 py-2 rounded-full text-sm font-medium border",
          style: { borderColor: `${primary}30`, color: primary, backgroundColor: `${primary}08` },
          children: ind
        },
        ind
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16", style: { backgroundColor: primary }, children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest mb-2", style: { color: accent }, children: "Why choose us" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-white mb-4", children: "Built for Industry. Backed by Expertise." }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm leading-relaxed", children: "From free installation to the first free servicing — we stand behind every machine we deliver." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        "Free installation & commissioning",
        "First servicing at no labour cost",
        "Pan-India delivery network",
        "Customised HP & tank configurations",
        "3 HP – 75 HP compressor range",
        "ISO-grade quality assurance"
      ].map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg", style: { backgroundColor: "rgba(255,255,255,0.07)" }, children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0 mt-0.5 text-xs font-bold", style: { color: accent }, children: "✓" }),
        /* @__PURE__ */ jsx("span", { className: "text-blue-100 text-sm", children: item })
      ] }, item)) })
    ] }) }) }),
    testimonials.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-14 bg-gradient-to-b from-gray-50 to-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-[11px] font-semibold tracking-[2px] uppercase mb-2",
            style: { color: accent },
            children: "CLIENT REVIEWS"
          }
        ),
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-semibold text-gray-900 relative inline-block", children: [
          "What Our Clients Say",
          /* @__PURE__ */ jsx("span", { className: "block h-[2px] w-12 bg-blue-500 mx-auto mt-2 rounded-full" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-6", children: testimonials.map((t) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-4 text-blue-500 text-3xl opacity-20", children: "“" }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-3", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
              "span",
              {
                className: `text-sm ${i < t.rating ? "text-yellow-400" : "text-gray-300"}`,
                children: "★"
              },
              i
            )) }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed text-center mb-4", children: truncate(t.content, 150) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center border-t pt-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: t.author_name }),
              t.author_company && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: t.author_company })
            ] })
          ]
        },
        t.id
      )) })
    ] }) })
  ] });
}
function About() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);
  const qualities = [
    "Precision engineering & robust construction",
    "High-pressure endurance rated performance",
    "Long-lasting durability, low maintenance",
    "Free installation & commissioning",
    "First servicing at no labour cost",
    "Pan-India delivery with timely dispatch"
  ];
  const stats = [
    { num: "2020", label: "Est. Year" },
    { num: "50+", label: "Products" },
    { num: "200+", label: "Clients" },
    { num: "75 HP", label: "Max Capacity" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "About Us — Everest Hydro Pneumatic Solutions, Est. 2020, Chakan Pune",
        description: "Established in 2020 in Chakan, Pune — Everest HPS manufactures & supplies industrial air compressors, screw compressors, oil-free compressors & material handling equipment. 50+ products, pan-India delivery.",
        canonical: "/about"
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-[#0f3460] py-14", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-2", children: "About us" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-white leading-tight mb-4", children: "Everest Hydro Pneumatic Solution" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm leading-relaxed", children: "Manufacturer & supplier of industrial air compressors and material handling equipment — Pune, Maharashtra since 2020." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: stats.map(({ num, label }) => /* @__PURE__ */ jsxs("div", { className: "bg-white/8 border border-white/10 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: num }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-300 mt-0.5", children: label })
      ] }, label)) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-5 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-2", children: "Who we are" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-black mb-5", children: "Built on precision. Trusted by industry." }),
        (settings == null ? void 0 : settings.about_text) ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: settings.about_text.split("\n\n").filter((p) => p.trim().length > 30).slice(0, 2).map((para, i) => /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: para.trim() }, i)) }) : /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 leading-relaxed", children: [
          "Established in ",
          /* @__PURE__ */ jsx("strong", { children: "2020" }),
          " in Pune, Maharashtra, Everest Hydro Pneumatic Solution is a reliable manufacturer and supplier of high-performance air compressors and material handling equipment, serving manufacturing, automotive, dental, construction, and packaging industries across India."
        ] }),
        ((settings == null ? void 0 : settings.mission) || (settings == null ? void 0 : settings.vision)) && /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4 mt-6", children: [
          settings.mission && /* @__PURE__ */ jsxs("div", { className: "bg-[#0f3460]/4 rounded-xl p-4 border-l-4 border-[#0f3460]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-2", children: "Mission" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 leading-relaxed", children: [
              settings.mission.slice(0, 160),
              "…"
            ] })
          ] }),
          (settings == null ? void 0 : settings.vision) && /* @__PURE__ */ jsxs("div", { className: "bg-[#e94560]/4 rounded-xl p-4 border-l-4 border-[#e94560]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-[#e94560] mb-2", children: "Vision" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 leading-relaxed", children: [
              settings.vision.replace(/To become the most trusted\s*/i, "").slice(0, 160),
              "…"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-2xl p-6 border border-gray-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400 mb-4", children: "Why choose us" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: qualities.map((q) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-green-500 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: q })
        ] }, q)) })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-gray-50 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-black mb-6 text-center", children: "Company Factsheet" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b md:border-b-0 md:border-r border-gray-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-4", children: "Business Info" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
            ["Nature of Business", "Manufacturer & Service Provider"],
            ["Additional Business", "Wholesale Trade"],
            ["Legal Status", "Proprietorship"],
            ["Annual Turnover", "₹0 – 40 Lakhs"],
            ["GST Number", (settings == null ? void 0 : settings.gst_number) || "27ATEPT3692E1ZD"]
          ].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 w-36 flex-shrink-0", children: label }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-black text-right font-mono", children: value })
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-[#0f3460] mb-4", children: "Contact Details" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
            ["Phone / WhatsApp", (settings == null ? void 0 : settings.phone) || "+91-8855820105"],
            ["Email", (settings == null ? void 0 : settings.email) || "everesthps@gmail.com"],
            ["Working Hours", (settings == null ? void 0 : settings.working_hours) || "Mon – Sat, 9 AM – 6:30 PM"],
            ["GST Reg. Date", "01-09-2020"],
            ["Location", "Chakan, Pune – 410501, Maharashtra"]
          ].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 w-32 flex-shrink-0", children: label }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-black text-right", children: value })
          ] }, label)) })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-white border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1", children: "Our team" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-black", children: "Skilled professionals, deep expertise" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1 max-w-md", children: [
          "Led by ",
          /* @__PURE__ */ jsx("strong", { children: "Vishal" }),
          " (Sales Engineer), our team handles every client requirement with technical precision and market knowledge."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-[#0f3460]", children: "5+" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Years Exp." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-[#0f3460]", children: "11" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Team Size" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center min-w-[100px]", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-[#0f3460]", children: "PAN" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "India Reach" })
        ] })
      ] })
    ] }) })
  ] });
}
const PRODUCT_FAQS = [
  {
    question: "Which air compressor is best for industrial use?",
    answer: "For industrial use, screw compressors are the most popular choice due to their continuous duty cycle, energy efficiency, and low noise. Everest HPS offers screw compressors from 5 HP to 100 HP, covering small workshops to large manufacturing plants. Oil-free models are recommended for food, pharma, and dental industries."
  },
  {
    question: "Do you provide free installation with compressor purchase?",
    answer: "Yes. Every air compressor purchased from Everest HPS includes free on-site installation and commissioning by our trained engineers. We also provide a free first servicing to ensure your equipment runs optimally from day one."
  },
  {
    question: "What is the price range of industrial air compressors?",
    answer: "Industrial air compressor prices at Everest HPS start from approximately Rs 12,000 for small reciprocating units and go up to Rs 8,00,000+ for high-capacity screw compressors. Pricing varies based on HP, tank size, technology (oil-free vs lubricated), and configuration. Contact us for an exact quote."
  },
  {
    question: "Do you deliver air compressors across India?",
    answer: "Absolutely. Everest HPS offers pan-India delivery with careful packaging and logistics tracking. Whether you are in Pune, Mumbai, Delhi, Bangalore, or any part of India, we ensure safe and timely delivery to your doorstep."
  },
  {
    question: "How do I choose the right compressor capacity (CFM/HP)?",
    answer: "Choosing the right capacity depends on your air demand (CFM), required working pressure (PSI/bar), duty cycle, and application type. Our team conducts a free consultation to assess your needs and recommend the ideal HP, tank size, and dryer configuration. Contact us for a personalised recommendation."
  }
];
const faqSchema = buildFAQSchema(PRODUCT_FAQS);
async function loader$3() {
  const [catRes, prodRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order")
  ]);
  return {
    categories: catRes.data || [],
    products: prodRes.data || []
  };
}
function Products() {
  var _a;
  const { categories, products } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const selectedCategory = searchParams.get("category") || "";
  const handleCategorySelect = (slug) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
    setSidebarOpen(false);
  };
  const filteredProducts = selectedCategory ? products.filter((p) => {
    const cat = categories.find((c) => c.slug === selectedCategory);
    return cat && p.category_id === cat.id;
  }) : products;
  const selectedCategoryName = (_a = categories.find((c) => c.slug === selectedCategory)) == null ? void 0 : _a.name;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Industrial Air Compressors & Pneumatic Equipment | Everest HPS",
        description: "Browse 50+ industrial air compressors, screw, oil-free, dental & material handling equipment. Competitive prices & free installation from Everest HPS, Pune.",
        canonical: "/products",
        schemas: [faqSchema]
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-[#0f3460] py-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1", children: "Our catalogue" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: "Products" }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm mt-1", children: "Air compressors & material handling equipment" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "md:hidden mb-4", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSidebarOpen(!sidebarOpen),
          className: "flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700",
          children: [
            /* @__PURE__ */ jsx(SlidersHorizontal, { size: 16 }),
            selectedCategory ? selectedCategoryName : "All Categories"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
        /* @__PURE__ */ jsx(
          "aside",
          {
            className: `${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-48 shrink-0`,
            children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 border border-neutral-200 shadow-sm rounded-xl p-4 sticky top-24", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3", children: "Category" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleCategorySelect(""),
                    className: `text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-[#0f3460] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`,
                    children: "All Products"
                  }
                ),
                categories.map((cat) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleCategorySelect(cat.slug),
                    className: `text-left px-3 py-2 rounded-lg text-sm transition-colors leading-snug ${selectedCategory === cat.slug ? "bg-[#0f3460] text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`,
                    children: cat.name
                  },
                  cat.id
                ))
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("main", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`,
            selectedCategoryName && /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-700", children: [
              " in ",
              selectedCategoryName
            ] })
          ] }) }),
          filteredProducts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-400 bg-neutral-50 shadow-sm rounded-xl border border-neutral-200", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No products found in this category." }) }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredProducts.map((product) => {
            const cat = categories.find((c) => c.id === product.category_id);
            return /* @__PURE__ */ jsx(ProductCard, { product, categoryName: cat == null ? void 0 : cat.name }, product.id);
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-14 bg-white border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1", children: "Common questions" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Frequently Asked Questions" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: PRODUCT_FAQS.map((faq, i) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-100 rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setOpenFAQ(openFAQ === i ? null : i),
            className: "w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-gray-900 pr-4", children: faq.question }),
              /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  size: 18,
                  className: `text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        openFAQ === i && /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3", children: faq.answer })
      ] }, i)) })
    ] }) })
  ] });
}
function parseSpecs(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(([, v]) => String(v).trim() !== "" && String(v).trim() !== "0").map(([k, v]) => ({ label: String(k).trim(), value: String(v).trim() }));
  }
  if (typeof raw === "object") {
    return Object.entries(raw).filter(([, v]) => String(v).trim() !== "" && String(v).trim() !== "0").map(([k, v]) => ({
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: String(v).trim()
    }));
  }
  return [];
}
async function loader$2({ params }) {
  const { slug } = params;
  if (!slug) return redirect("/products");
  const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error || !product) {
    return redirect("/products");
  }
  let categoryName = "";
  if (product.category_id) {
    const { data: cat } = await supabase.from("categories").select("name").eq("id", product.category_id).maybeSingle();
    if (cat) categoryName = cat.name;
  }
  const { data: imgs } = await supabase.from("product_images").select("*").eq("product_id", product.id).order("sort_order");
  let similarProducts = [];
  if (product.category_id) {
    const { data: sim } = await supabase.from("products").select("*").eq("category_id", product.category_id).neq("id", product.id).limit(6);
    if (sim) similarProducts = sim;
  }
  return {
    product,
    categoryName,
    images: imgs || [],
    similarProducts
  };
}
function ProductDetail() {
  const { product, categoryName, images, similarProducts } = useLoaderData();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const allImages = [product.image_url, ...images.map((i) => i.image_url)].filter(Boolean);
  const specs = parseSpecs(product.specifications);
  const price = formatPrice(product.price_range);
  const isPOR = price === "Price on Request";
  const productSchema = buildProductSchema({
    name: product.name,
    slug: product.slug,
    description: product.description,
    image_url: product.image_url,
    price_range: product.price_range,
    categoryName: categoryName || void 0
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` }
  ]);
  const cleanLong = product.long_description ? DOMPurify.sanitize(product.long_description) : "";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: `${product.name} | Buy in Pune | Everest HPS`,
        description: `${product.name} — ${(product.description || "").slice(0, 120)}. Buy from Everest HPS, Chakan Pune. Free installation & pan-India delivery.`,
        canonical: `/products/${product.slug}`,
        ogImage: product.image_url || void 0,
        ogType: "product",
        schemas: [productSchema, breadcrumbSchema]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-white border-b border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/products", className: "flex items-center gap-1 text-[#0f3460] hover:underline font-medium", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
        " Back to Products"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-500 truncate max-w-xs", children: product.name })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl overflow-hidden relative mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-square flex items-center justify-center p-8", children: allImages[selectedIdx] ? /* @__PURE__ */ jsx("img", { src: allImages[selectedIdx], alt: product.name, className: "w-full h-full object-contain" }, selectedIdx) : /* @__PURE__ */ jsx("div", { className: "text-gray-200 text-7xl", children: "📦" }) }),
            allImages.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedIdx((i) => (i - 1 + allImages.length) % allImages.length),
                  className: "absolute left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md transition-all",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18, className: "text-gray-600" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedIdx((i) => (i + 1) % allImages.length),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md transition-all",
                  children: /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-gray-600" })
                }
              )
            ] })
          ] }),
          allImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: allImages.map((img, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedIdx(i),
              className: `flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedIdx === i ? "border-[#0f3460]" : "border-gray-200 hover:border-gray-300"}`,
              children: /* @__PURE__ */ jsx("img", { src: img, alt: `${product.name} - image ${i + 1}`, className: "w-full h-full object-cover" })
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            categoryName && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2", children: categoryName }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-[28px] font-bold text-gray-900 leading-tight", children: product.name }),
              /* @__PURE__ */ jsx("div", { className: "shrink-0 mt-0.5", children: /* @__PURE__ */ jsx(
                ShareButton,
                {
                  productName: product.name,
                  url: `https://everesthps.com/products/${product.slug}`,
                  description: product.description,
                  specifications: product.specifications,
                  imageUrl: product.image_url,
                  price: product.price_range
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-baseline gap-2 px-4 py-2.5 rounded-xl w-fit ${isPOR ? "bg-gray-100" : "bg-[#0f3460]/6"}`, children: [
            /* @__PURE__ */ jsx("span", { className: `font-bold ${isPOR ? "text-gray-400 italic text-sm" : "text-xl text-gray-900"}`, children: price }),
            !isPOR && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "incl. taxes" })
          ] }),
          specs.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-gray-900 mb-2", children: "Technical Specifications" }),
            /* @__PURE__ */ jsxs(
              "table",
              {
                className: "w-full text-sm",
                style: { borderCollapse: "collapse", border: "1px solid #000" },
                children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { style: {
                      border: "1px solid #000",
                      padding: "7px 12px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#111",
                      background: "#fff",
                      width: "50%"
                    }, children: "Parameter" }),
                    /* @__PURE__ */ jsx("th", { style: {
                      border: "1px solid #000",
                      padding: "7px 12px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#111",
                      background: "#fff",
                      width: "50%"
                    }, children: "Value" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { children: specs.map(({ label, value }, i) => /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("td", { style: {
                      border: "1px solid #000",
                      padding: "7px 12px",
                      fontSize: "13px",
                      color: "#111",
                      background: "#fff"
                    }, children: label }),
                    /* @__PURE__ */ jsx("td", { style: {
                      border: "1px solid #000",
                      padding: "7px 12px",
                      fontSize: "13px",
                      color: "#111",
                      background: "#fff"
                    }, children: value })
                  ] }, i)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full", children: [
              /* @__PURE__ */ jsx(Check, { size: 11 }),
              " Free Installation"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full", children: [
              /* @__PURE__ */ jsx(Check, { size: 11 }),
              " Free First Servicing"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full", children: "🚚 Pan-India Delivery" })
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: "flex items-center justify-center px-6 py-3.5 bg-[#e94560] hover:bg-[#c73652] text-white font-semibold rounded-xl transition-colors text-sm",
              children: "Request Information"
            }
          )
        ] })
      ] }),
      (product.description || cleanLong) && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl p-6 mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-gray-900 mb-3", children: "Description" }),
        product.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 leading-relaxed mb-3", children: product.description.split("\n\n")[0] }),
        cleanLong && /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none border-t border-gray-50 pt-3",
            dangerouslySetInnerHTML: { __html: cleanLong }
          }
        )
      ] }),
      similarProducts.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-900", children: "Similar Products" }),
          /* @__PURE__ */ jsx(Link, { to: "/products", className: "text-sm text-[#0f3460] hover:underline font-medium", children: "View all →" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 overflow-x-auto pb-3", children: similarProducts.map((p) => {
          const sp = formatPrice(p.price_range);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/products/${p.slug}`,
              className: "flex-shrink-0 w-48 bg-white border border-gray-100 rounded-xl overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-32 bg-gray-50 overflow-hidden", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-200 text-3xl", children: "📦" }) }),
                /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1", children: p.name }),
                  /* @__PURE__ */ jsx("p", { className: `text-xs font-bold mb-1.5 ${sp === "Price on Request" ? "text-gray-400 italic" : "text-[#0f3460]"}`, children: sp }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#e94560]", children: "View Details →" })
                ] })
              ]
            },
            p.id
          );
        }) })
      ] })
    ] })
  ] });
}
const iconMap = {
  zap: Zap,
  settings: Settings,
  headphones: Headphones,
  book: BookOpen
};
const process = [
  { step: "01", title: "Consultation", desc: "We understand your air demand, pressure needs, and installation space." },
  { step: "02", title: "Proposal", desc: "Tailored model, HP, tank, and dryer configuration matched to your setup." },
  { step: "03", title: "Delivery", desc: "Pan-India delivery with careful packaging and logistics tracking." },
  { step: "04", title: "Free Setup", desc: "Full installation, commissioning, and a demo — all at no extra cost." }
];
const SERVICE_FAQS = [
  {
    question: "Do you offer free installation for air compressors?",
    answer: "Yes. Everest HPS provides completely free on-site installation and commissioning for every air compressor we sell. Our engineers visit your facility, install the unit, connect piping, and run a full commissioning check — all at zero additional cost."
  },
  {
    question: "What does your after-sales service include?",
    answer: "Our after-sales support includes free first servicing (labour cost waived), ongoing technical assistance, spare parts supply (filters, oil, belts), annual maintenance contracts (AMC), and emergency breakdown support. We aim to respond within 24 hours for service requests in the Pune region."
  },
  {
    question: "Can you help configure a compressor for my specific needs?",
    answer: "Absolutely. We offer free consultations to assess your air demand (CFM), pressure requirements (bar/PSI), duty cycle, and installation space. Based on this, we recommend the ideal HP rating, tank size, dryer type, and piping layout — ensuring maximum efficiency and minimum energy waste."
  },
  {
    question: "Do you provide compressor rental or leasing options?",
    answer: "Currently, Everest HPS focuses on outright sales with free installation. For large-volume or project-based requirements, please contact our sales team to discuss custom arrangements tailored to your timeline and budget."
  },
  {
    question: "What areas do you serve for installation and service?",
    answer: "We provide installation services pan-India. Our primary service region for same-day/next-day support is the Pune–PCMC–Chakan industrial belt. For other locations across Maharashtra and India, we coordinate with our logistics and service network to ensure timely support."
  }
];
const serviceFaqSchema = buildFAQSchema(SERVICE_FAQS);
async function loader$1() {
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return { services: data || [] };
}
function Services() {
  const { services } = useLoaderData();
  const [openFAQ, setOpenFAQ] = useState(null);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Services — Free Installation, After-Sales Support | Everest HPS Pune",
        description: "End-to-end air compressor services: free installation, first servicing at no cost, custom HP configuration, and pan-India delivery from Everest HPS.",
        canonical: "/services",
        schemas: [serviceFaqSchema]
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-[#0f3460] py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1", children: "What we do" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Our Services" }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm max-w-xl", children: "End-to-end support — from the right product recommendation to installation, commissioning, and beyond." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: services.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4", children: services.map((s) => {
      const Icon = iconMap[s.icon] || Settings;
      return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 hover:shadow-sm transition-shadow", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-[#0f3460]/8 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { size: 20, className: "text-[#0f3460]" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-black text-base mb-1.5", children: s.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: s.description })
        ] })
      ] }, s.id);
    }) }) : (
      /* Fallback if no services in DB */
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4", children: [
        { icon: Zap, title: "Supply & Sales", desc: "Wide range of air compressors and material handling equipment — oil-free, screw, reciprocating, and pallet trucks." },
        { icon: Settings, title: "Free Installation", desc: "Our engineers visit, install, and commission every unit we sell — completely free of charge." },
        { icon: Headphones, title: "After-Sales Support", desc: "First servicing at no labour cost. Spare parts, oil, and technical help when you need it." },
        { icon: BookOpen, title: "Custom Configuration", desc: "HP range, tank size, dryer, pressure setting — we configure to your exact industrial requirement." }
      ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 hover:shadow-sm transition-shadow", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-[#0f3460]/8 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { size: 20, className: "text-[#0f3460]" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-black text-base mb-1.5", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: desc })
        ] })
      ] }, title)) })
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1", children: "How it works" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-black", children: "Our Process" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-0 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-100 z-0" }),
        process.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center px-4 relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm mb-4 ${i === process.length - 1 ? "bg-[#e94560] text-white" : "bg-[#0f3460] text-white"}`, children: p.step }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-black text-sm mb-2", children: p.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: p.desc })
        ] }, p.step))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-gray-50 border-t border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
      { emoji: "🔧", title: "Free Installation", sub: "On every product we sell" },
      { emoji: "🛠", title: "Free First Service", sub: "Labour cost waived" },
      { emoji: "🚚", title: "Pan-India Delivery", sub: "Fast & careful dispatch" }
    ].map(({ emoji, title, sub }) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 px-6 py-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl", children: emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-black text-sm", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: sub })
      ] })
    ] }, title)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 bg-white border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1", children: "Common questions" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Frequently Asked Questions" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: SERVICE_FAQS.map((faq, i) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-100 rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setOpenFAQ(openFAQ === i ? null : i),
            className: "w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-gray-900 pr-4", children: faq.question }),
              /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  size: 18,
                  className: `text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        openFAQ === i && /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3", children: faq.answer })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 bg-[#0f3460]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-3", children: "Share your requirements" }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm mb-7", children: "We'll configure the right solution and deliver it to your door." }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/contact",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-[#e94560] text-white font-semibold text-sm rounded-xl hover:bg-[#c73652] transition-colors",
          children: [
            "Get in Touch ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
          ]
        }
      )
    ] }) })
  ] });
}
async function loader() {
  const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
  return { images: data || [] };
}
function Gallery() {
  const { images } = useLoaderData();
  const [selectedImage, setSelectedImage] = useState(null);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Gallery — Product Photos & Operations | Everest HPS",
        description: "View photos of industrial air compressors, oil-free compressors, screw compressors & material handling equipment from Everest Hydro Pneumatic Solutions, Pune.",
        canonical: "/gallery"
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Gallery" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-100", children: "Our products and operations" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: images.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-600", children: "No gallery images yet" }) : /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-4 gap-4", children: images.map((image) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group",
        onClick: () => setSelectedImage(image),
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: image.image_url,
              alt: image.title,
              className: "w-full h-full object-cover group-hover:scale-110 transition-transform"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" }),
          image.title && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: image.title }) })
        ]
      },
      image.id
    )) }) }) }),
    selectedImage && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4",
        onClick: () => setSelectedImage(null),
        children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-4xl w-full", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "absolute -top-10 right-0 text-white text-3xl",
              onClick: () => setSelectedImage(null),
              children: "×"
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: selectedImage.image_url,
              alt: selectedImage.title,
              className: "w-full rounded-lg"
            }
          ),
          selectedImage.title && /* @__PURE__ */ jsx("p", { className: "text-white text-center mt-4 text-lg", children: selectedImage.title }),
          selectedImage.description && /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-center mt-2", children: selectedImage.description })
        ] })
      }
    )
  ] });
}
function Contact() {
  var _a;
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
    typeof navigator !== "undefined" && /prerender|googlebot|bingbot|headlesschrome/i.test(navigator.userAgent.toLowerCase());
    {
      setLoading(false);
    }
  }, []);
  const phone = (settings == null ? void 0 : settings.phone) || "+91-8855820105";
  const email = (settings == null ? void 0 : settings.email) || "everesthps@gmail.com";
  const whatsapp = ((_a = settings == null ? void 0 : settings.whatsapp) == null ? void 0 : _a.replace(/[^\d]/g, "")) || "918855820105";
  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone}`,
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: (settings == null ? void 0 : settings.working_hours) || "Mon – Sat: 9:00 AM – 6:30 PM IST",
      href: void 0,
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: MapPin,
      label: "Address",
      value: (settings == null ? void 0 : settings.address) || "Kalp Residency, 109 B Wing, Chakan, Pune – 410501",
      href: void 0,
      color: "bg-green-50 text-green-600"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Contact Everest HPS | Air Compressor Supplier | +91-8855820105",
        description: "Contact Everest Hydro Pneumatic Solutions for air compressor quotes, product enquiries & after-sales support. Call +91-8855820105. Chakan, Pune 410501.",
        canonical: "/contact"
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-[#0f3460] py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1", children: "Get in touch" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Contact Us" }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: "Inquiries, quotes, and support — we respond within 24 hours." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 flex flex-col gap-5", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: contactItems.map(({ icon: Icon, label, value, href, color }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`, children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-400 mb-0.5", children: label }),
            href ? /* @__PURE__ */ jsx("a", { href, className: "text-sm font-semibold text-black hover:text-[#0f3460] transition-colors break-all", children: value }) : /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-black leading-snug", children: value })
          ] })
        ] }, label)) }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `https://wa.me/${whatsapp}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-xl transition-colors",
            children: [
              /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" }) }),
              "Chat on WhatsApp"
            ]
          }
        ),
        (settings == null ? void 0 : settings.google_maps_embed) ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "rounded-xl overflow-hidden h-48 border border-gray-100",
            dangerouslySetInnerHTML: { __html: settings.google_maps_embed }
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl h-48 bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 24, className: "text-gray-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Chakan, Pune – 410501" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-2xl p-1 min-h-[520px] flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 pt-5 pb-3 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-black", children: "Send us a Message" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "We'll get back to you within 24 hours" })
        ] }),
        loading && /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-[#0f3460] border-t-transparent rounded-full animate-spin" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Loading form…" })
        ] }),
        /* @__PURE__ */ jsx("div", { id: "lwc-container", className: "flex-1 p-4" })
      ] }) })
    ] }) })
  ] });
}
function Privacy() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Privacy Policy | Everest Hydro Pneumatic Solutions",
        description: "Read the privacy policy of Everest Hydro Pneumatic Solutions. Learn how we collect, use, and protect your personal data.",
        canonical: "/privacy"
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Privacy Policy" }) }) }),
    /* @__PURE__ */ jsx("section", { className: "max-w-4xl mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-gray-700", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "1. Introduction" }),
        /* @__PURE__ */ jsx("p", { children: 'Everest Hydro Pneumatic Solutions ("we", "us", "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.' })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "2. Information Collection and Use" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We collect several different types of information for various purposes to provide and improve our Service." }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Types of Data Collected:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: "Personal Information (name, email address, phone number, company)" }),
          /* @__PURE__ */ jsx("li", { children: "Technical Data (IP address, browser type, pages visited)" }),
          /* @__PURE__ */ jsx("li", { children: "Communication Data (inquiry messages and feedback)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "3. Use of Data" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Everest Hydro Pneumatic Solutions uses the collected data for various purposes:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: "To provide and maintain our Service" }),
          /* @__PURE__ */ jsx("li", { children: "To notify you about changes to our Service" }),
          /* @__PURE__ */ jsx("li", { children: "To respond to your inquiries and requests" }),
          /* @__PURE__ */ jsx("li", { children: "To monitor the usage of our Service" }),
          /* @__PURE__ */ jsx("li", { children: "To detect, prevent and address technical issues" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "4. Security of Data" }),
        /* @__PURE__ */ jsx("p", { children: "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "5. Changes to This Privacy Policy" }),
        /* @__PURE__ */ jsx("p", { children: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.' })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "6. Contact Us" }),
        /* @__PURE__ */ jsx("p", { children: "If you have any questions about this Privacy Policy, please contact us at the email address or phone number provided on our Contact page." })
      ] })
    ] }) })
  ] });
}
function Terms() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Terms & Conditions | Everest Hydro Pneumatic Solutions",
        description: "Read the Terms & Conditions of Everest Hydro Pneumatic Solutions. By using this website you agree to these terms.",
        canonical: "/terms"
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Terms & Conditions" }) }) }),
    /* @__PURE__ */ jsx("section", { className: "max-w-4xl mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-gray-700", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "1. Agreement to Terms" }),
        /* @__PURE__ */ jsx("p", { children: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "2. Use License" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Permission is granted to temporarily download one copy of the materials (information or software) on Everest Hydro Pneumatic Solutions website for personal, non-commercial transitory viewing only." }),
        /* @__PURE__ */ jsx("p", { children: "This is the grant of a license, not a transfer of title, and under this license you may not:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2 mt-2", children: [
          /* @__PURE__ */ jsx("li", { children: "Modify or copy the materials" }),
          /* @__PURE__ */ jsx("li", { children: "Use the materials for any commercial purpose or for any public display" }),
          /* @__PURE__ */ jsx("li", { children: "Attempt to decompile or reverse engineer any software on the website" }),
          /* @__PURE__ */ jsx("li", { children: 'Transfer the materials to another person or "mirror" the materials on any other server' }),
          /* @__PURE__ */ jsx("li", { children: "Violate any applicable laws or regulations" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "3. Disclaimer" }),
        /* @__PURE__ */ jsx("p", { children: "The materials on Everest Hydro Pneumatic Solutions website are provided on an 'as is' basis. Everest makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "4. Limitations" }),
        /* @__PURE__ */ jsx("p", { children: "In no event shall Everest or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "5. Accuracy of Materials" }),
        /* @__PURE__ */ jsx("p", { children: "The materials appearing on Everest Hydro Pneumatic Solutions website could include technical, typographical, or photographic errors. Everest does not warrant that any of the materials on the website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "6. Links" }),
        /* @__PURE__ */ jsx("p", { children: "Everest has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "7. Modifications" }),
        /* @__PURE__ */ jsx("p", { children: "Everest may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "8. Governing Law" }),
        /* @__PURE__ */ jsx("p", { children: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Everest is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "9. Contact Information" }),
        /* @__PURE__ */ jsx("p", { children: "If you have any questions about these Terms & Conditions, please contact us using the information provided on our Contact page." })
      ] })
    ] }) })
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[60vh] flex items-center justify-center bg-gray-50 px-4", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "404 - Page Not Found | Everest HPS",
        description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
        canonical: "/404"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-9xl font-bold text-[#0f3460]", children: "404" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-900 mt-4 mb-2", children: "Page Not Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 bg-[#e53238] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition",
          children: [
            /* @__PURE__ */ jsx(Home$1, { size: 20 }),
            "Back to Home"
          ]
        }
      )
    ] })
  ] });
}
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) throw signInError;
      console.log("data.user.id==>", data.user.id);
      if (data.user) {
        const { data: adminData, error: adminError } = await supabase.from("admins").select("*").eq("id", data.user.id).maybeSingle();
        if (adminError || !adminData) {
          throw new Error("Not authorized as admin");
        }
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block p-3 bg-blue-600 rounded-lg mb-4", children: /* @__PURE__ */ jsx(LogIn, { className: "text-white", size: 32 }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Admin Login" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: "Everest Admin Panel" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
            placeholder: "admin@example.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
            placeholder: "••••••••",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
          children: loading ? "Logging in..." : "Login"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-600 mt-6", children: "Contact administrator for access credentials" })
  ] }) });
}
function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (data) {
        setSettings(data);
      } else {
        const newSettings = {
          company_name: "Everest Hydro Pneumatic Solutions",
          tagline: "Reliable Hydraulic & Pneumatic Solutions",
          primary_color: "#003366",
          secondary_color: "#333333",
          accent_color: "#FF6B35"
        };
        const { data: created } = await supabase.from("site_settings").insert([newSettings]).select().single();
        if (created) setSettings(created);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);
  const handleChange = (field, value) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };
  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await supabase.from("site_settings").update(settings).eq("id", settings.id);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading..." });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Site Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Company Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.company_name) || "",
              onChange: (e) => handleChange("company_name", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Tagline" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.tagline) || "",
              onChange: (e) => handleChange("tagline", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Logo URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: (settings == null ? void 0 : settings.logo_url) || "",
            onChange: (e) => handleChange("logo_url", e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
            placeholder: "https://example.com/logo.png"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Phone" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.phone) || "",
              onChange: (e) => handleChange("phone", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: (settings == null ? void 0 : settings.email) || "",
              onChange: (e) => handleChange("email", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Address" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: (settings == null ? void 0 : settings.address) || "",
            onChange: (e) => handleChange("address", e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "WhatsApp Number" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.whatsapp) || "",
              onChange: (e) => handleChange("whatsapp", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Working Hours" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.working_hours) || "",
              onChange: (e) => handleChange("working_hours", e.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Company Name Color" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              value: (settings == null ? void 0 : settings.company_name_color) || "#111827",
              onChange: (e) => handleChange("company_name_color", e.target.value),
              className: "w-12 h-10 border border-gray-300 rounded"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: (settings == null ? void 0 : settings.company_name_color) || "#111827",
              onChange: (e) => handleChange("company_name_color", e.target.value),
              className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Primary Color" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: (settings == null ? void 0 : settings.primary_color) || "#003366",
                onChange: (e) => handleChange("primary_color", e.target.value),
                className: "w-12 h-10 border border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: (settings == null ? void 0 : settings.primary_color) || "#003366",
                onChange: (e) => handleChange("primary_color", e.target.value),
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Secondary Color" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: (settings == null ? void 0 : settings.secondary_color) || "#333333",
                onChange: (e) => handleChange("secondary_color", e.target.value),
                className: "w-12 h-10 border border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: (settings == null ? void 0 : settings.secondary_color) || "#333333",
                onChange: (e) => handleChange("secondary_color", e.target.value),
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Accent Color" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: (settings == null ? void 0 : settings.accent_color) || "#FF6B35",
                onChange: (e) => handleChange("accent_color", e.target.value),
                className: "w-12 h-10 border border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: (settings == null ? void 0 : settings.accent_color) || "#FF6B35",
                onChange: (e) => handleChange("accent_color", e.target.value),
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "About Text" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: (settings == null ? void 0 : settings.about_text) || "",
            onChange: (e) => handleChange("about_text", e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
            rows: 4
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Mission" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: (settings == null ? void 0 : settings.mission) || "",
            onChange: (e) => handleChange("mission", e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Vision" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: (settings == null ? void 0 : settings.vision) || "",
            onChange: (e) => handleChange("vision", e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50",
          children: saving ? "Saving..." : "Save Settings"
        }
      )
    ] })
  ] });
}
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const BUCKET_NAME = "Product Images";
  const [imageUrls, setImageUrls] = useState([""]);
  const [specRows, setSpecRows] = useState([{ key: "", value: "" }]);
  const [longDesc, setLongDesc] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    image_url: "",
    price_range: "",
    is_featured: false,
    sort_order: 0
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order")
    ]);
    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };
  const addSpecRow = () => setSpecRows([...specRows, { key: "", value: "" }]);
  const removeSpecRow = (idx) => setSpecRows(specRows.filter((_, i) => i !== idx));
  const updateSpecRow = (idx, field, val) => {
    const updated = [...specRows];
    updated[idx][field] = val;
    setSpecRows(updated);
  };
  const addImageUrl = () => setImageUrls([...imageUrls, ""]);
  const removeImageUrl = (idx) => setImageUrls(imageUrls.filter((_, i) => i !== idx));
  const updateImageUrl = (idx, val) => {
    const updated = [...imageUrls];
    updated[idx] = val;
    setImageUrls(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      alert("Please fill in Product Name and Category.");
      return;
    }
    try {
      const specifications = specRows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()]);
      const validImages = imageUrls.filter((url) => url.trim() !== "");
      const mainImageUrl = validImages.length > 0 ? validImages[0] : "";
      const additionalImagesList = validImages.slice(1);
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const productData = {
        ...formData,
        slug,
        long_description: longDesc,
        image_url: mainImageUrl,
        specifications
      };
      let productId = editingId;
      if (editingId) {
        await supabase.from("products").update(productData).eq("id", editingId);
      } else {
        const { data } = await supabase.from("products").insert([productData]).select().single();
        if (data) productId = data.id;
      }
      if (productId) {
        await supabase.from("product_images").delete().eq("product_id", productId);
        if (additionalImagesList.length > 0) {
          const imageInserts = additionalImagesList.map((url, index) => ({
            product_id: productId,
            image_url: url,
            sort_order: index,
            alt_text: `${formData.name} - Image ${index + 2}`
          }));
          await supabase.from("product_images").insert(imageInserts);
        }
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await supabase.from("product_images").delete().eq("product_id", id);
      await supabase.from("products").delete().eq("id", id);
      fetchData();
    } catch (error) {
      alert("Error deleting product");
    }
  };
  const handleEdit = async (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      price_range: product.price_range || "",
      is_featured: product.is_featured || false,
      sort_order: product.sort_order || 0
    });
    setLongDesc(product.long_description || "");
    const specs = product.specifications;
    let rows = [];
    if (Array.isArray(specs)) {
      rows = specs.map(([key, value]) => ({ key, value: String(value) }));
    } else if (specs && typeof specs === "object") {
      rows = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
    }
    setSpecRows(rows.length > 0 ? rows : [{ key: "", value: "" }]);
    const { data: images } = await supabase.from("product_images").select("image_url").eq("product_id", product.id).order("sort_order");
    const allImages = [product.image_url || ""];
    if (images && images.length > 0) {
      allImages.push(...images.map((img) => img.image_url));
    }
    const validImages = allImages.filter(Boolean);
    setImageUrls(validImages.length > 0 ? validImages : [""]);
    setShowForm(true);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
      image_url: "",
      price_range: "",
      is_featured: false,
      sort_order: 0
    });
    setLongDesc("");
    setSpecRows([{ key: "", value: "" }]);
    setImageUrls([""]);
    setEditingId(null);
    setShowForm(false);
  };
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"]
    ]
  };
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const newUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
        if (uploadError) {
          console.error("Upload error for", file.name, uploadError);
          continue;
        }
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        if (data == null ? void 0 : data.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }
      if (newUrls.length > 0) {
        setImageUrls((prev) => {
          const existing = prev.filter((u) => u.trim() !== "");
          return [...existing, ...newUrls];
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading images");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Products" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowForm(true),
          className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 20 }),
            " Add Product"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-4xl my-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold", children: [
          editingId ? "Edit" : "Add",
          " Product"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: resetForm, className: "text-gray-500 hover:text-gray-700", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Product Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "e.g. 3HP Screw Air Compressor",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Category *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: formData.category_id,
                onChange: (e) => setFormData({ ...formData, category_id: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select Category" }),
                  categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Sort Order" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: formData.sort_order,
                onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Short Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              placeholder: "Brief product overview (1–2 lines)",
              value: formData.description,
              onChange: (e) => setFormData({ ...formData, description: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
              rows: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Detailed Description" }),
          /* @__PURE__ */ jsx("div", { className: "border border-gray-300 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsx(
            ReactQuill,
            {
              theme: "snow",
              value: longDesc,
              onChange: setLongDesc,
              modules: quillModules,
              placeholder: "Write a detailed product description with formatting…",
              style: { minHeight: "160px" }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-end", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Price Range" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "e.g. ₹80,000 – ₹1,00,000",
                value: formData.price_range,
                onChange: (e) => setFormData({ ...formData, price_range: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center h-[42px]", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: formData.is_featured,
                onChange: (e) => setFormData({ ...formData, is_featured: e.target.checked }),
                className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Featured Product" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: "Specifications" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addSpecRow,
                className: "flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium",
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 16 }),
                  " Add Row"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-3 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_1fr_36px] gap-2 text-xs font-semibold text-gray-500 uppercase px-1", children: [
              /* @__PURE__ */ jsx("span", { children: "Property" }),
              /* @__PURE__ */ jsx("span", { children: "Value" }),
              /* @__PURE__ */ jsx("span", {})
            ] }),
            specRows.map((row, idx) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_1fr_36px] gap-2 items-center", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. Motor Power",
                  value: row.key,
                  onChange: (e) => updateSpecRow(idx, "key", e.target.value),
                  className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. 3 HP",
                  value: row.value,
                  onChange: (e) => updateSpecRow(idx, "value", e.target.value),
                  className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeSpecRow(idx),
                  className: "p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50",
                  title: "Remove row",
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }, idx)),
            specRows.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 text-center py-2", children: 'No specifications added. Click "Add Row" above.' })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: "Product Images" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${uploadingImages ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"}`, children: [
                uploadingImages ? /* @__PURE__ */ jsx(Loader, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Upload, { size: 16 }),
                uploadingImages ? "Uploading…" : "Upload Files",
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    className: "hidden",
                    accept: "image/*",
                    multiple: true,
                    onChange: handleFileUpload,
                    disabled: uploadingImages
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: addImageUrl,
                  className: "flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium",
                  children: [
                    /* @__PURE__ */ jsx(ImagePlus, { size: 16 }),
                    " Add URL"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-3 space-y-2", children: [
            imageUrls.map((url, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 text-xs text-gray-400 font-semibold shrink-0", children: idx === 0 ? /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase", children: "Main" }) : /* @__PURE__ */ jsx(GripVertical, { size: 16, className: "text-gray-300" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  placeholder: "https://example.com/image.jpg",
                  value: url,
                  onChange: (e) => updateImageUrl(idx, e.target.value),
                  className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                }
              ),
              url.trim() && /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-100", children: /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "w-full h-full object-cover", onError: (e) => {
                e.target.style.display = "none";
              } }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeImageUrl(idx),
                  className: "p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 shrink-0",
                  title: "Remove image",
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }, idx)),
            imageUrls.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 text-center py-2", children: 'No images added. Click "Add Image" above.' }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "The first image is used as the main product image. Additional images appear in the gallery." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold",
              children: [
                editingId ? "Update" : "Add",
                " Product"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: resetForm,
              className: "px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2 text-sm font-semibold text-gray-600", children: "Name" }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2 text-sm font-semibold text-gray-600", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2 text-sm font-semibold text-gray-600", children: "Price" }),
          /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-2 text-sm font-semibold text-gray-600", children: "Order" }),
          /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-2 text-sm font-semibold text-gray-600", children: "Specs" }),
          /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-2 text-sm font-semibold text-gray-600", children: "Featured" }),
          /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2 text-sm font-semibold text-gray-600", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: products.map((product) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: product.name }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: ((_a = categories.find((c) => c.id === product.category_id)) == null ? void 0 : _a.name) || "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: product.price_range || "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-gray-500", children: product.sort_order ?? 0 }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: product.specifications && Object.keys(product.specifications).length > 0 ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700", children: Object.keys(product.specifications).length }) : /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "—" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: product.is_featured ? "✓" : "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 justify-end", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleEdit(product),
                  className: "p-2 text-blue-600 hover:bg-blue-50 rounded",
                  title: "Edit",
                  children: /* @__PURE__ */ jsx(Edit2, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(product.id),
                  className: "p-2 text-red-600 hover:bg-red-50 rounded",
                  title: "Delete",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                }
              )
            ] }) })
          ] }, product.id);
        }) })
      ] }),
      products.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center text-gray-400 py-8", children: "No products added yet." })
    ] })
  ] });
}
function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const [inquiriesRes, categoriesRes] = await Promise.all([
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*")
    ]);
    if (inquiriesRes.data) setInquiries(inquiriesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };
  const handleMarkAsRead = async (id, isRead) => {
    try {
      await supabase.from("inquiries").update({ is_read: !isRead }).eq("id", id);
      fetchData();
    } catch (error) {
      alert("Error updating inquiry");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await supabase.from("inquiries").delete().eq("id", id);
      setSelectedInquiry(null);
      fetchData();
    } catch (error) {
      alert("Error deleting inquiry");
    }
  };
  const getCategoryName = (categoryId) => {
    var _a;
    return ((_a = categories.find((c) => c.id === categoryId)) == null ? void 0 : _a.name) || "N/A";
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Contact Inquiries" }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "md:col-span-1 space-y-2 max-h-96 overflow-y-auto", children: inquiries.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500", children: "No inquiries yet" }) : inquiries.map((inquiry) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedInquiry(inquiry),
          className: `w-full text-left px-4 py-3 rounded-lg border-l-4 transition-colors ${(selectedInquiry == null ? void 0 : selectedInquiry.id) === inquiry.id ? "bg-blue-50 border-blue-600" : inquiry.is_read ? "bg-gray-50 border-gray-300" : "bg-yellow-50 border-yellow-500"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: `font-semibold ${!inquiry.is_read ? "text-yellow-700" : "text-gray-700"}`, children: inquiry.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: inquiry.email }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: new Date(inquiry.created_at).toLocaleDateString() })
          ]
        },
        inquiry.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: selectedInquiry ? /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-6 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold", children: selectedInquiry.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleMarkAsRead(selectedInquiry.id, selectedInquiry.is_read),
                className: "p-2 text-blue-600 hover:bg-blue-100 rounded",
                title: selectedInquiry.is_read ? "Mark as unread" : "Mark as read",
                children: selectedInquiry.is_read ? /* @__PURE__ */ jsx(EyeOff, { size: 20 }) : /* @__PURE__ */ jsx(Eye, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(selectedInquiry.id),
                className: "p-2 text-red-600 hover:bg-red-100 rounded",
                children: /* @__PURE__ */ jsx(Trash2, { size: 20 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Email" }),
            /* @__PURE__ */ jsx("a", { href: `mailto:${selectedInquiry.email}`, className: "text-blue-600 hover:underline", children: selectedInquiry.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Phone" }),
            /* @__PURE__ */ jsx("a", { href: `tel:${selectedInquiry.phone}`, className: "text-blue-600 hover:underline", children: selectedInquiry.phone })
          ] }),
          selectedInquiry.company && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Company" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: selectedInquiry.company })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Category" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: getCategoryName(selectedInquiry.category_id) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Date" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: new Date(selectedInquiry.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Message" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800 bg-white p-4 rounded-lg whitespace-pre-wrap", children: selectedInquiry.message })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-16 text-gray-500", children: /* @__PURE__ */ jsx("p", { children: "Select an inquiry to view details" }) }) })
    ] })
  ] });
}
function AdminGallery() {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    sort_order: 0
  });
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (data) setImages(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please provide an image URL");
      return;
    }
    try {
      await supabase.from("gallery_images").insert([formData]);
      setFormData({ title: "", image_url: "", description: "", sort_order: 0 });
      setShowForm(false);
      fetchImages();
    } catch (error) {
      alert("Error saving image");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await supabase.from("gallery_images").delete().eq("id", id);
      fetchImages();
    } catch (error) {
      alert("Error deleting image");
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Gallery" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowForm(!showForm),
          className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 20 }),
            " Add Image"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-6 rounded-lg mb-6 space-y-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Image Title",
          value: formData.title,
          onChange: (e) => setFormData({ ...formData, title: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Image URL",
          value: formData.image_url,
          onChange: (e) => setFormData({ ...formData, image_url: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Image Description",
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
          rows: 3
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          placeholder: "Sort Order",
          value: formData.sort_order,
          onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { type: "submit", className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Add Image" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setShowForm(false);
              setFormData({ title: "", image_url: "", description: "", sort_order: 0 });
            },
            className: "flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400",
            children: "Cancel"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-4 gap-4", children: images.map((image) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-32 bg-gray-200 overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: image.image_url, alt: image.title, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
        image.title && /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm mb-1", children: image.title }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
          "Order: ",
          image.sort_order ?? 0
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDelete(image.id),
            className: "w-full flex items-center justify-center gap-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 14 }),
              " Delete"
            ]
          }
        )
      ] })
    ] }, image.id)) })
  ] });
}
function AdminImageManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const BUCKET_NAME = "Product Images";
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  useEffect(() => {
    fetchFiles();
  }, []);
  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" }
    });
    if (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files: " + error.message);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };
  const handleUpload = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, "_")}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      await fetchFiles();
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const confirmDelete = (fileName) => {
    setFileToDelete(fileName);
    setDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      const fileName = fileToDelete;
      console.log("Attempting to delete:", fileName);
      const response = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
      console.log("Delete response:", response);
      if (response.error) {
        console.error("Delete error from Supabase:", response.error);
        throw response.error;
      }
      console.log("Fetching updated files...");
      await fetchFiles();
    } catch (error) {
      console.error("Delete exception:", error);
      alert("Error deleting file. It may be locked or already removed. " + (error.message || ""));
    } finally {
      setDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };
  const getPublicUrl = (fileName) => {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      textArea.remove();
      alert("URL copied to clipboard!");
    }
  };
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Image Manager" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchFiles,
            className: "p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors",
            title: "Refresh",
            children: /* @__PURE__ */ jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors", children: [
          uploading ? /* @__PURE__ */ jsx(Loader, { size: 20, className: "animate-spin" }) : /* @__PURE__ */ jsx(Upload, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Upload Image" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              className: "hidden",
              accept: "image/*",
              onChange: handleUpload,
              disabled: uploading
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full whitespace-nowrap", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Preview" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Filename" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Size" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: files.length === 0 && !loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-6 py-12 text-center text-gray-500", children: "No images found. Upload one to get started." }) }) : files.map((file) => {
        if (file.name === ".emptyFolderPlaceholder") return null;
        const publicUrl = getPublicUrl(file.name);
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-100", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: publicUrl,
              alt: file.name,
              className: "h-full w-full object-cover",
              onError: (e) => {
                e.target.src = "https://via.placeholder.com/64?text=Error";
              }
            }
          ) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 max-w-xs truncate", title: file.name, children: file.name }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: file.metadata ? formatBytes(file.metadata.size) : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: file.created_at ? formatDate(file.created_at) : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => copyToClipboard(publicUrl),
                className: "p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors",
                title: "Copy URL",
                children: /* @__PURE__ */ jsx(Copy, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => confirmDelete(file.name),
                className: "p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors",
                title: "Delete",
                children: /* @__PURE__ */ jsx(Trash2, { size: 18 })
              }
            )
          ] }) })
        ] }, file.id || file.name);
      }) })
    ] }) }) }),
    deleteModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-md p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "Delete Image" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-6", children: [
        "Are you sure you want to delete ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-800 break-all", children: fileToDelete }),
        "? This action cannot be undone and will break any links using this image."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setDeleteModalOpen(false);
              setFileToDelete(null);
            },
            className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleDelete,
            className: "px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 16 }),
              "Delete Image"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "zap",
    sort_order: 0
  });
  useEffect(() => {
    fetchServices();
  }, []);
  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setServices(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill required fields");
      return;
    }
    try {
      if (editingId) {
        await supabase.from("services").update(formData).eq("id", editingId);
      } else {
        await supabase.from("services").insert([formData]);
      }
      resetForm();
      fetchServices();
    } catch (error) {
      alert("Error saving service");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await supabase.from("services").delete().eq("id", id);
      fetchServices();
    } catch (error) {
      alert("Error deleting service");
    }
  };
  const resetForm = () => {
    setFormData({ title: "", description: "", icon: "zap", sort_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Services" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowForm(true),
          className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 20 }),
            " Add Service"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-6 rounded-lg mb-6 space-y-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Service Title",
          value: formData.title,
          onChange: (e) => setFormData({ ...formData, title: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Service Description",
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
          rows: 4,
          required: true
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: formData.icon,
          onChange: (e) => setFormData({ ...formData, icon: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
          children: [
            /* @__PURE__ */ jsx("option", { value: "zap", children: "Zap" }),
            /* @__PURE__ */ jsx("option", { value: "settings", children: "Settings" }),
            /* @__PURE__ */ jsx("option", { value: "headphones", children: "Headphones" }),
            /* @__PURE__ */ jsx("option", { value: "book", children: "Book" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          placeholder: "Sort Order",
          value: formData.sort_order,
          onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [
          editingId ? "Update" : "Add",
          " Service"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: resetForm,
            className: "flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400",
            children: "Cancel"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: services.map((service) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: service.title }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded", children: [
          "Order: ",
          service.sort_order ?? 0
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-3", children: service.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setEditingId(service.id);
              setFormData(service);
              setShowForm(true);
            },
            className: "flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded",
            children: [
              /* @__PURE__ */ jsx(Edit2, { size: 16 }),
              " Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDelete(service.id),
            className: "flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 16 }),
              " Delete"
            ]
          }
        )
      ] })
    ] }, service.id)) })
  ] });
}
function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0
  });
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Please fill required fields");
      return;
    }
    try {
      if (editingId) {
        await supabase.from("categories").update(formData).eq("id", editingId);
      } else {
        await supabase.from("categories").insert([formData]);
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      alert("Error saving category");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await supabase.from("categories").delete().eq("id", id);
      fetchCategories();
    } catch (error) {
      alert("Error deleting category");
    }
  };
  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", image_url: "", sort_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Categories" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowForm(true),
          className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 20 }),
            " Add Category"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-6 rounded-lg mb-6 space-y-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Category Name",
            value: formData.name,
            onChange: (e) => {
              const name = e.target.value;
              setFormData({
                ...formData,
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-")
              });
            },
            className: "px-4 py-2 border border-gray-300 rounded-lg",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Slug",
            value: formData.slug,
            onChange: (e) => setFormData({ ...formData, slug: e.target.value }),
            className: "px-4 py-2 border border-gray-300 rounded-lg",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Description",
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg resize-none",
          rows: 3
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Image URL",
            value: formData.image_url,
            onChange: (e) => setFormData({ ...formData, image_url: e.target.value }),
            className: "px-4 py-2 border border-gray-300 rounded-lg"
          }
        ),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            placeholder: "Sort Order",
            value: formData.sort_order,
            onChange: (e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 }),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [
          editingId ? "Update" : "Add",
          " Category"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: resetForm,
            className: "flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400",
            children: "Cancel"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: category.name }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded", children: [
          "Order: ",
          category.sort_order ?? 0
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-3", children: category.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setEditingId(category.id);
              setFormData(category);
              setShowForm(true);
            },
            className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded",
            children: [
              /* @__PURE__ */ jsx(Edit2, { size: 16 }),
              " Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDelete(category.id),
            className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded",
            children: [
              /* @__PURE__ */ jsx(Trash2, { size: 16 }),
              " Delete"
            ]
          }
        )
      ] })
    ] }, category.id)) })
  ] });
}
function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetchPages();
  }, []);
  const fetchPages = async () => {
    const { data } = await supabase.from("pages").select("*").order("sort_order", { ascending: true });
    if (data) setPages(data);
    setLoading(false);
  };
  const handleToggleEnabled = async (id, currentStatus) => {
    const { error } = await supabase.from("pages").update({ is_enabled: !currentStatus }).eq("id", id);
    if (!error) {
      setPages(pages.map(
        (p) => p.id === id ? { ...p, is_enabled: !currentStatus } : p
      ));
    }
  };
  const handleMove = async (index, direction) => {
    if (direction === "up" && index === 0 || direction === "down" && index === pages.length - 1) return;
    const newPages = [...pages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
    const updatedPages = newPages.map((page, idx) => ({
      ...page,
      sort_order: (idx + 1) * 10
    }));
    setPages(updatedPages);
    setSaving(true);
    const updates = updatedPages.map((p) => ({
      id: p.id,
      sort_order: p.sort_order
    }));
    for (const update of updates) {
      await supabase.from("pages").update({ sort_order: update.sort_order }).eq("id", update.id);
    }
    setSaving(false);
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Manage Pages" }),
      saving && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
        " Saving order..."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-sm font-medium text-gray-500", children: "Page Name" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-sm font-medium text-gray-500", children: "Path" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-sm font-medium text-gray-500", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-sm font-medium text-gray-500", children: "Order" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-sm font-medium text-gray-500", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: pages.map((page, index) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-900", children: page.label }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-500", children: page.path }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.is_enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: page.is_enabled ? "Visible" : "Hidden" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-500", children: page.sort_order }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleToggleEnabled(page.id, page.is_enabled),
              className: `p-1 rounded hover:bg-gray-200 ${page.is_enabled ? "text-green-600" : "text-red-600"}`,
              title: page.is_enabled ? "Disable" : "Enable",
              children: page.is_enabled ? /* @__PURE__ */ jsx(Eye, { size: 18 }) : /* @__PURE__ */ jsx(EyeOff, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1 ml-2 border-l pl-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleMove(index, "up"),
                disabled: index === 0,
                className: "p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600",
                title: "Move Up",
                children: /* @__PURE__ */ jsx(ArrowUp, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleMove(index, "down"),
                disabled: index === pages.length - 1,
                className: "p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600",
                title: "Move Down",
                children: /* @__PURE__ */ jsx(ArrowDown, { size: 18 })
              }
            )
          ] })
        ] }) })
      ] }, page.id)) })
    ] }) })
  ] });
}
function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    products: 0,
    inquiries: 0,
    categories: 0,
    services: 0
  });
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      const { data: adminData } = await supabase.from("admins").select("*").eq("id", session.user.id).maybeSingle();
      if (!adminData) {
        navigate("/admin/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);
  useEffect(() => {
    if (user) {
      const fetchCounts = async () => {
        const [products, inquiries, categories, services] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("inquiries").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true })
        ]);
        setCounts({
          products: products.count || 0,
          inquiries: inquiries.count || 0,
          categories: categories.count || 0,
          services: services.count || 0
        });
      };
      fetchCounts();
    }
  }, [user]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading..." });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Everest Admin Panel" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: user == null ? void 0 : user.email }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700",
            children: [
              /* @__PURE__ */ jsx(LogOut, { size: 20 }),
              " Logout"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-4 mb-8", children: [
        { id: "dashboard", label: "Dashboard", icon: Settings },
        { id: "settings", label: "Settings", icon: Settings },
        { id: "categories", label: "Categories", icon: Package },
        { id: "products", label: "Products", icon: Package },
        { id: "images", label: "Images", icon: Image },
        { id: "services", label: "Services", icon: Zap },
        { id: "gallery", label: "Website Gallery", icon: Image },
        { id: "inquiries", label: "Inquiries", icon: MessageSquare },
        { id: "pages", label: "Pages", icon: Settings }
      ].map((tab) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setCurrentTab(tab.id),
          className: `flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${currentTab === tab.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`,
          children: [
            /* @__PURE__ */ jsx(tab.icon, { size: 20 }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label })
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
        currentTab === "dashboard" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Dashboard" }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-4 gap-4", children: ["Products", "Inquiries", "Categories", "Services"].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: item }),
            /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-blue-600", children: counts[item.toLowerCase()] })
          ] }, i)) })
        ] }),
        currentTab === "settings" && /* @__PURE__ */ jsx(AdminSettings, {}),
        currentTab === "categories" && /* @__PURE__ */ jsx(AdminCategories, {}),
        currentTab === "products" && /* @__PURE__ */ jsx(AdminProducts, {}),
        currentTab === "images" && /* @__PURE__ */ jsx(AdminImageManager, {}),
        currentTab === "services" && /* @__PURE__ */ jsx(AdminServices, {}),
        currentTab === "gallery" && /* @__PURE__ */ jsx(AdminGallery, {}),
        currentTab === "inquiries" && /* @__PURE__ */ jsx(AdminInquiries, {}),
        currentTab === "pages" && /* @__PURE__ */ jsx(AdminPages, {})
      ] })
    ] })
  ] });
}
function WhatsAppFAB() {
  const [whatsapp, setWhatsapp] = useState("");
  useEffect(() => {
    supabase.from("site_settings").select("whatsapp").limit(1).maybeSingle().then(({ data }) => {
      if (data == null ? void 0 : data.whatsapp) {
        setWhatsapp(data.whatsapp.replace(/[^\d]/g, ""));
      }
    });
  }, []);
  if (!whatsapp) return null;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `https://wa.me/${whatsapp}`,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Chat on WhatsApp",
      className: "md:hidden fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold rounded-full shadow-lg transition-colors",
      children: [
        /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "white", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" }) }),
        "WhatsApp"
      ]
    }
  );
}
async function appLayoutLoader() {
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  return { settings: data };
}
function AppLayout() {
  const { settings } = useLoaderData();
  const localBusinessSchema = buildLocalBusinessSchema(settings || null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(WhatsAppFAB, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const routes = [
  {
    path: "/admin/login",
    element: /* @__PURE__ */ jsx(AdminLogin, {})
  },
  {
    path: "/admin/dashboard",
    element: /* @__PURE__ */ jsx(AdminDashboard, {})
  },
  {
    path: "/",
    element: /* @__PURE__ */ jsx(AppLayout, {}),
    loader: appLayoutLoader,
    children: [
      { index: true, element: /* @__PURE__ */ jsx(Home, {}), loader: loader$4 },
      { path: "about", element: /* @__PURE__ */ jsx(About, {}) },
      { path: "products", element: /* @__PURE__ */ jsx(Products, {}), loader: loader$3 },
      { path: "products/:slug", element: /* @__PURE__ */ jsx(ProductDetail, {}), loader: loader$2 },
      { path: "services", element: /* @__PURE__ */ jsx(Services, {}), loader: loader$1 },
      { path: "gallery", element: /* @__PURE__ */ jsx(Gallery, {}), loader },
      { path: "contact", element: /* @__PURE__ */ jsx(Contact, {}) },
      { path: "privacy", element: /* @__PURE__ */ jsx(Privacy, {}) },
      { path: "terms", element: /* @__PURE__ */ jsx(Terms, {}) },
      { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) }
    ]
  }
];
const createRoot = ViteReactSSG({
  routes
});
export {
  createRoot
};
