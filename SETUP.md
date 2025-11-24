# Everest Hydro Pneumatic Solutions - Website Setup Guide

## Overview

This is a fully-featured React web application for Everest Hydro Pneumatic Solutions with:
- Public-facing website with 7 main pages
- Complete admin panel for managing content
- Supabase database integration
- Authentication system
- Contact form with inquiry management
- SEO optimization
- Mobile-responsive design

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

## Quick Start

### 1. Install Dependencies

```bash
npm install --include=dev
```

### 2. Environment Variables

Your `.env` file is already configured with Supabase credentials:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Database Setup

The database schema and sample data have been automatically created:
- 8 tables for products, categories, services, testimonials, gallery, inquiries, and settings
- Row Level Security (RLS) policies for data protection
- Sample data with products, categories, and testimonials

### 4. Development Server

```bash
npm run dev
```

The development server will start on `http://localhost:5173`

### 5. Production Build

```bash
npm run build
```

Build outputs to the `dist/` directory.

## Website Pages

### Public Pages

1. **Home** (`/`)
   - Hero banner with call-to-action
   - Key features section
   - Product categories showcase
   - Featured products
   - Industries served
   - Testimonials
   - Contact CTA

2. **About** (`/about`)
   - Company history and overview
   - Mission & Vision
   - Core values
   - Capabilities and services

3. **Products** (`/products`)
   - Browseable product catalog
   - Filter by category
   - Product details and enquiry buttons
   - Categories: Hydraulic Fittings, Pneumatic Valves, Hydraulic Hoses, etc.

4. **Services** (`/services`)
   - Service offerings
   - Process flow
   - Call to action for consultations

5. **Gallery** (`/gallery`)
   - Image gallery with lightbox
   - High-quality product and facility images

6. **Contact** (`/contact`)
   - Contact form with validation
   - Business information (phone, email, address)
   - Google Maps embed option
   - WhatsApp integration
   - Contact inquiries saved to database

7. **Privacy Policy & Terms** (`/privacy`, `/terms`)
   - Legal pages (editable)

### Admin Pages

1. **Admin Login** (`/admin/login`)
   - Email and password authentication
   - Restricted to admin users only

2. **Admin Dashboard** (`/admin/dashboard`)
   - **Dashboard Tab**: Overview stats
   - **Settings Tab**: Edit site configuration, colors, contact info
   - **Categories Tab**: Manage product categories
   - **Products Tab**: CRUD operations for products
   - **Services Tab**: Manage service offerings
   - **Gallery Tab**: Upload and manage gallery images
   - **Inquiries Tab**: View and manage contact form submissions

## Admin Access

To create an admin account:

1. Create a user in Supabase Auth dashboard
2. Add their user ID to the `admins` table in Supabase
3. They can then log in via `/admin/login`

Example SQL to add admin:
```sql
INSERT INTO admins (id, email, role)
VALUES ('user-uuid-here', 'admin@example.com', 'admin');
```

## Editable Content

Via the admin panel, you can edit:

- **Site Settings**
  - Company name and tagline
  - Contact information (phone, email, address, WhatsApp)
  - Working hours
  - About text, mission, and vision
  - Brand colors (primary, secondary, accent)
  - Google Maps embed code

- **Products**
  - Product name and description
  - Category assignment
  - Images
  - Price ranges
  - Featured status
  - Specifications

- **Categories**
  - Category names
  - Descriptions
  - Images
  - Slugs (auto-generated from name)

- **Services**
  - Service titles and descriptions
  - Icon selection

- **Gallery**
  - Images with titles and descriptions

- **Testimonials**
  - Via direct database management

- **Contact Inquiries**
  - View all inquiries
  - Mark as read/unread
  - Delete inquiries

## Database Schema

### Tables

- **site_settings** - Global website configuration
- **categories** - Product categories
- **products** - Product catalog
- **testimonials** - Customer testimonials
- **services** - Service offerings
- **gallery_images** - Gallery images
- **inquiries** - Contact form submissions
- **admins** - Admin user management

All tables include:
- UUID primary keys
- Timestamps for audit trails
- RLS policies for security
- Proper foreign key relationships

## Security Features

- **Row Level Security (RLS)**: All tables protected with RLS policies
- **Authentication**: Admin panel requires Supabase authentication
- **Authorization**: Only admins can manage content
- **Data Protection**: Public users can only view published content
- **Secure Inquiries**: Contact form submissions stored securely

## Customization

### Change Brand Colors

Visit `/admin/dashboard` → Settings tab:
- Primary Color: Main brand color
- Secondary Color: Supporting color
- Accent Color: Call-to-action and highlight color

### Add/Edit Products

Visit `/admin/dashboard` → Products tab:
- Add new products with images and details
- Organize by category
- Mark as featured for homepage display

### Modify Contact Information

Visit `/admin/dashboard` → Settings tab:
- Update phone number, email, address
- Add WhatsApp number for direct messaging
- Embed Google Maps for location

## Performance

- **Build Size**: ~419KB (gzipped: ~114KB)
- **Images**: Using Pexels for high-quality stock photos
- **Lazy Loading**: Implemented for images
- **Responsive Design**: Mobile-first approach
- **SEO**: Schema markup for local business, meta tags, structured data

## Deployment

The built site (in `dist/`) can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider
- Traditional web servers

## Support & Maintenance

### Update Site Content
1. Log in to admin panel at `/admin/login`
2. Navigate to the relevant section
3. Make changes and save
4. Changes appear immediately on the public site

### Add New Products
1. Create product category first (if new)
2. Add product with details and images
3. Mark as featured if needed
4. Will appear on Products page and/or homepage

### Manage Inquiries
1. View all contact form submissions in Admin → Inquiries
2. Click inquiry to view full details
3. Mark as read/unread
4. Delete when processed

## Troubleshooting

### Development Server Not Starting
```bash
npm install --include=dev
npm run dev
```

### Build Errors
```bash
npm run typecheck
npm run lint
npm run build
```

### Database Issues
- Check Supabase dashboard for table status
- Verify RLS policies are enabled
- Check user permissions in admins table

## Next Steps

1. Set up admin account
2. Log in to admin panel
3. Update site settings with your company information
4. Add/import your products
5. Update gallery with your facility images
6. Test contact form
7. Deploy to your hosting provider

## Support

For more information about:
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
