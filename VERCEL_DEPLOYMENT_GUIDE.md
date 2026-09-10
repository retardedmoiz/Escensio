# 🚀 Vercel Deployment & MongoDB Setup Guide - ESCENSIO Luxury Perfume E-Commerce

This guide covers step-by-step instructions for pushing the **ESCENSIO** codebase to **GitHub** and deploying it seamlessly on **Vercel** with a **MongoDB Atlas** database.

---

## 📋 Overview

The application is built using Next.js App Router with serverless API endpoints integrated inside `client/src/app/api/`. This architecture allows the entire site—including the luxury e-commerce storefront, admin settings, inventory manager, POS kiosk billing system, and thermal receipt printing—to run directly on Vercel from a single repository push.

---

## Step 1: Push Code to GitHub

1. Open your terminal in the root directory `escensio`:
   ```bash
   git init
   git add .
   git commit -m "ESCENSIO Luxury Perfume E-Commerce, POS Kiosk & Vercel API"
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g., `escensio-luxury-perfume`).

3. Link your local repo and push to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/escensio-luxury-perfume.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository (`escensio-luxury-perfume`).
4. In the project configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `client` (Click Edit next to Root Directory and pick `client`).
5. Expand **Environment Variables** and add the following:

   | Environment Variable | Recommended Value | Description |
   | :--- | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/escensio?retryWrites=true&w=majority` | Your MongoDB Atlas Connection URI |
   | `ADMIN_EMAIL` | `admin@escensio.com` | Admin panel login email |
   | `ADMIN_PASSWORD` | `admin123` | Admin panel password |

6. Click **Deploy**. Vercel will automatically build and publish your website!

---

## 🛒 Key Application URLs

Once deployed (e.g., at `https://escensio-perfumes.vercel.app`):

- **Luxury Storefront**: `https://escensio-perfumes.vercel.app`
- **Admin Dashboard**: `https://escensio-perfumes.vercel.app/admin`
- **POS Billing & Thermal Receipt Printer**: `https://escensio-perfumes.vercel.app/admin/pos`
- **Inventory Manager**: `https://escensio-perfumes.vercel.app/admin/inventory`
- **Website Settings & Hero Image Changer**: `https://escensio-perfumes.vercel.app/admin/settings`
- **Orders & Shipping Labels**: `https://escensio-perfumes.vercel.app/admin/orders`

---

## 🖨️ POS Kiosk Thermal Receipt Printing Instructions

1. Navigate to `/admin/pos` on any desktop, laptop, or kiosk tablet touchscreen.
2. Add products to the order, select bottle size, customer details, discount/tax, and payment mode (Cash, Card, UPI).
3. Click **Print Receipt & Complete Bill**.
4. The styled thermal receipt modal pops up with your store logo, tax breakdown, barcode, and total.
5. Click **Print Thermal Bill Now** to send the receipt straight to your connected 80mm thermal receipt printer or standard A4 printer via native browser printing.

---

## 🔒 Database & Fallback Mode

- When `MONGODB_URI` is supplied in Vercel settings, all products, orders, POS transactions, and site settings persist in your live MongoDB database.
- If no `MONGODB_URI` is supplied, the app gracefully falls back to an optimized in-memory store so all features remain testable out of the box!
