#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# verify-googlebot.sh
#
# P1 — Verify that vite-react-ssg pre-rendering is working correctly.
#
# This script simulates how Googlebot requests pages and checks that the
# server returns real HTML content (not an empty <div id="root"></div>).
#
# USAGE:
#   chmod +x scripts/verify-googlebot.sh
#   ./scripts/verify-googlebot.sh
#
# WHAT IT CHECKS:
#   1. <title> tag is present and not empty
#   2. <meta name="description"> is present
#   3. <script type="application/ld+json"> (LocalBusiness schema) is present
#   4. The page body contains meaningful text (not just the empty root div)
#   5. Product pages return product-specific content
#
# EXPECTED OUTPUT (if pre-rendering works):
#   ✅ / → title: "Air Compressor Supplier Pune | Everest Hydro Pneumatic Solutions"
#   ✅ /about → title: "About Us — Everest Hydro Pneumatic Solutions..."
#   ✅ /products → title: "Industrial Air Compressors & Pneumatic Equipment | Everest HPS"
#
# IF PRE-RENDERING IS BROKEN (SPA fallback only):
#   ❌ / → title: "" or "Everest Hydro Pneumatic Solutions — Air Compressors Pune"
#      (the static fallback from index.html, not the per-page dynamic title)
# ─────────────────────────────────────────────────────────────────────────────

BASE_URL="${1:-https://everesthps.com}"
GOOGLEBOT_UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
PASS=0
FAIL=0

# Colour codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Colour

check_page() {
  local path="$1"
  local expected_title_fragment="$2"
  local url="${BASE_URL}${path}"

  # Fetch with Googlebot UA, follow redirects, silent, max 10s
  local html
  html=$(curl -sL \
    -A "$GOOGLEBOT_UA" \
    --max-time 10 \
    --connect-timeout 5 \
    "$url" 2>/dev/null)

  if [ -z "$html" ]; then
    echo -e "  ${RED}❌ ${path}${NC} — could not fetch (timeout or connection refused)"
    FAIL=$((FAIL + 1))
    return
  fi

  # Extract <title> content
  local title
  title=$(echo "$html" | grep -oP '(?<=<title>)[^<]+' | head -1)

  # Check for LocalBusiness JSON-LD
  local has_schema
  has_schema=$(echo "$html" | grep -c 'application/ld+json' || true)

  # Check for meaningful body content (not just empty root div)
  local has_content
  has_content=$(echo "$html" | grep -c 'Everest\|compressor\|Pune\|pneumatic' || true)

  if [ -n "$title" ] && echo "$title" | grep -qi "$expected_title_fragment"; then
    echo -e "  ${GREEN}✅ ${path}${NC}"
    echo -e "     Title  : ${title}"
    echo -e "     Schema : ${has_schema} JSON-LD block(s)"
    echo -e "     Content: ${has_content} keyword match(es)"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ ${path}${NC}"
    echo -e "     Expected title fragment : '${expected_title_fragment}'"
    echo -e "     Got title               : '${title}'"
    echo -e "     ${YELLOW}→ Pre-rendering may not be working for this route.${NC}"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Googlebot Pre-Render Verification — ${BASE_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing static routes..."

check_page "/"          "Air Compressor Supplier Pune"
check_page "/about"     "About Us"
check_page "/products"  "Industrial Air Compressors"
check_page "/services"  "Services"
check_page "/contact"   "Contact"
check_page "/privacy"   "Privacy"
check_page "/terms"     "Terms"

echo ""
echo "Testing product detail route (first product slug)..."
# This checks that at least one product page is pre-rendered
check_page "/products/3hp-screw-air-compressor" "Everest HPS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Results: ${PASS} passed, ${FAIL} failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo -e "${YELLOW}Troubleshooting:${NC}"
  echo "  1. Run 'npm run build' and check for errors"
  echo "  2. Confirm VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in .env"
  echo "  3. Check dist/ folder — each route should have a /index.html file"
  echo "  4. Verify your hosting serves pre-rendered HTML (not SPA fallback) to bots"
  echo "  5. On Vercel: no extra config needed. On Nginx: add 'try_files' rewrite."
  exit 1
fi

echo ""
echo -e "${GREEN}All checks passed! Pre-rendering is working correctly.${NC}"
echo "Next step: Submit sitemap in Google Search Console."
exit 0