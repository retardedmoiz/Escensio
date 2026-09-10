# Escensio Deployment Guide for Hostinger

This guide covers everything you need to deploy the **Escensio** e-commerce platform (Next.js frontend and Express/Node.js backend) to Hostinger.

## Prerequisites
- A Hostinger VPS or a shared hosting plan that supports Node.js.
- A MongoDB Atlas database (or another hosted MongoDB instance).

## Step 1: Prepare the Backend (Server)

1.  **Environment Variables:**
    In your Hostinger environment, you need to set up the following environment variables for the backend application:
    -   `PORT=5000` (or whatever port Hostinger assigns)
    -   `MONGO_URI=your_mongodb_connection_string`
    -   `JWT_SECRET=your_secure_random_string`
    -   `CORS_ORIGIN=https://your-frontend-domain.com` (Crucial for production security)
    -   `ADMIN_EMAIL=admin@escensio.com`
    -   `ADMIN_PASSWORD=your_secure_password`

2.  **Build and Upload:**
    -   In your local machine's terminal, navigate to the `server` directory: `cd server`
    -   Run the build command to compile the TypeScript code: `npm run build`
    -   This will create a `dist` folder.
    -   Zip the following files and folders: `dist/`, `package.json`, `package-lock.json`, and the empty `public/` directory (make sure `public/uploads` exists).
    -   Upload this zip file to your Hostinger server (using File Manager or FTP) and extract it.
    -   Alternatively, you can use Git to clone the repository on the server and run `npm run build` there.

3.  **Install Dependencies and Start:**
    -   SSH into your Hostinger server or use the built-in terminal.
    -   Navigate to the directory where you extracted the backend files.
    -   Install only production dependencies: `npm install --production`
    -   Start the server. How you do this depends on your Hostinger plan (e.g., using `pm2`, or their specific Node.js app runner). The entry point is `dist/index.js`. Example using pm2: `pm2 start dist/index.js --name "escensio-api"`

## Step 2: Prepare the Frontend (Client)

1.  **Update Environment Variable:**
    -   Before building the frontend, you **must** ensure it knows the URL of your newly deployed backend.
    -   Locate the file `client/.env.production` in your local project.
    -   Change `NEXT_PUBLIC_API_URL` to point to your live backend domain (e.g., `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`).
    -   Also update `next.config.ts`'s `remotePatterns` to include your new Hostinger backend domain so images can load correctly.

2.  **Build the Next.js App:**
    -   In your local terminal, navigate to the `client` directory: `cd client`
    -   Run the build command: `npm run build`
    -   Next.js will generate an optimized production build in the `.next` directory.

3.  **Upload and Start:**
    -   Zip the entire `client` directory (including `.next`, `public`, `package.json`, etc., but exclude `node_modules`).
    -   Upload the zip to your Hostinger server (to a different directory or subdomain than the backend, e.g., your main domain folder).
    -   Extract the files.
    -   Install production dependencies: `npm install --production`
    -   Start the Next.js application. Example using pm2: `pm2 start npm --name "escensio-web" -- start`

## Additional Notes
-   **Static Export Alternative:** If you have a basic shared hosting plan that doesn't support running Node.js apps well, and your Next.js app doesn't rely heavily on server-side rendering (SSR), you can look into Next.js static exports (`output: 'export'` in `next.config.ts`). However, for an e-commerce site with an admin panel, a Node.js environment is strongly recommended.
-   **Images:** Uploaded product images are stored in `server/public/uploads`. Ensure this directory exists on the server and has the correct read/write permissions.
-   **Domain Setup:** It's common to host the frontend on the main domain (`yourdomain.com`) and the backend on a subdomain (`api.yourdomain.com`). Configure your DNS settings and reverse proxy (like Nginx, often handled automatically by Hostinger's control panel) accordingly.
