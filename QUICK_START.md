# Quick Start Guide

## First Time Setup (2 minutes)

```bash
# 1. Install dependencies
npm install --include=dev

# 2. Run development server
npm run dev

# 3. Open browser
# Visit: http://localhost:5173
```

## Admin Login

1. Go to `http://localhost:5173/admin/login`
2. **First Admin Account Setup** (requires database access):
   - Go to Supabase dashboard
   - Create a user in Auth section
   - Copy the user ID
   - Insert into `admins` table:
     ```sql
     INSERT INTO admins (id, email, role)
     VALUES ('your-user-id', 'your-email@example.com', 'admin');
     ```
3. Use email and password to log in

## Key Admin Actions

### Update Company Info
1. Admin Dashboard → Settings
2. Edit: Company name, phone, email, address, colors
3. Click "Save Settings"

### Add a Product
1. Admin Dashboard → Products
2. Click "Add Product"
3. Fill: Name, description, category, image URL, price
4. Check "Featured" if for homepage
5. Click "Add Product"
6. Appears on website immediately

### Add Product Category
1. Admin Dashboard → Categories
2. Click "Add Category"
3. Fill: Name, description, image URL
4. Click "Add Category"

### View Contact Forms
1. Admin Dashboard → Inquiries
2. Click inquiry to view details
3. Click eye icon to mark as read
4. Reply via email/phone provided

## Website Navigation

**Public Pages:**
- `/` - Home
- `/about` - About Us
- `/products` - Products
- `/services` - Services
- `/gallery` - Gallery
- `/contact` - Contact
- `/privacy` - Privacy Policy
- `/terms` - Terms & Conditions

**Admin Pages:**
- `/admin/login` - Admin Login
- `/admin/dashboard` - Admin Panel

## Building for Production

```bash
# Create optimized build
npm run build

# Output: dist/ folder
# Ready to deploy to any hosting
```

## Environment Variables

Already configured in `.env`:
- `VITE_SUPABASE_URL` - Database URL
- `VITE_SUPABASE_ANON_KEY` - Database key

## Common Tasks

### Change Website Colors
1. Admin Dashboard → Settings
2. Primary Color: Main brand color
3. Secondary Color: Supporting color
4. Accent Color: Buttons and highlights
5. Save Settings

### Add Testimonial
1. Direct database access needed (Supabase dashboard)
2. Insert into `testimonials` table with:
   - author_name
   - author_company
   - author_role
   - content
   - rating (1-5)

### Update Gallery
1. Admin Dashboard → Gallery
2. Click "Add Image"
3. Paste image URL (use https:// URLs)
4. Add title and description
5. Click "Add Image"

### Manage Working Hours
1. Admin Dashboard → Settings
2. Update "Working Hours" field
3. Format: "Mon - Fri: 9:00 AM - 6:00 PM"
4. Save Settings

## Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install --include=dev
npm run build
```

### Can't Login to Admin
1. Check email in Supabase Auth dashboard
2. Verify user ID is in `admins` table
3. Check table RLS policies are enabled

### Database Connection Issues
1. Check `.env` has correct credentials
2. Verify Supabase project is active
3. Check network connection

## File Locations

- **Source Code**: `/src`
- **Build Output**: `/dist`
- **Database Config**: `.env`
- **Configuration**: `vite.config.ts`, `tailwind.config.js`
- **Setup Guide**: `SETUP.md`
- **Feature List**: `WEBSITE_FEATURES.md`

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

## Next Steps

1. Set up admin account (see Admin Login section)
2. Update site settings with your company info
3. Add your products and categories
4. Upload gallery images
5. Test contact form
6. Build for production
7. Deploy!

---

**Everything is ready to go. Start with `npm run dev` and visit `/admin/login`**
