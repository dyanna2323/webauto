# Plesk Deployment Guide - technexo.ai

Complete guide to deploy your AI Web Builder on a **dedicated host with Plesk** control panel.

## Prerequisites

- ✅ Dedicated hosting with Plesk panel access
- ✅ Domain: technexo.ai configured in Plesk
- ✅ SSH/FTP access credentials
- ✅ OpenAI API key

---

## Table of Contents

1. [Install Node.js Extension](#1-install-nodejs-extension)
2. [Create PostgreSQL Database](#2-create-postgresql-database)
3. [Upload Application Files](#3-upload-application-files)
4. [Configure Node.js Application](#4-configure-nodejs-application)
5. [Set Environment Variables](#5-set-environment-variables)
6. [Install Dependencies & Start](#6-install-dependencies--start)
7. [Configure SSL Certificate](#7-configure-ssl-certificate-https)
8. [Testing & Troubleshooting](#8-testing--troubleshooting)

---

## 1. Install Node.js Extension

### Check if Node.js is already installed

1. Log in to **Plesk Control Panel**
2. Go to **Extensions** (in the sidebar)
3. Look for **"Node.js"** or **"Node.js Toolkit"**

### If not installed:

1. Click **Extensions Catalog**
2. Search for **"Node.js"**
3. Click **Install** on "Node.js Toolkit" or "Node.js support"
4. Wait for installation to complete

✅ **Done!** Node.js support is now enabled.

---

## 2. Create PostgreSQL Database

### Using Plesk Database Panel

1. Go to **Websites & Domains** → **technexo.ai**
2. Click **Databases**
3. Click **Add Database**

**Configure:**
- **Database name:** `technexo_ai`
- **Database user:** `technexo_user`
- **Password:** Generate a strong password (click 🔑 icon)
- **Access:** Local server

4. Click **OK**

### Save your database credentials:

```
Database URL format:
postgresql://technexo_user:your_password@localhost:5432/technexo_ai

Example:
postgresql://technexo_user:Xy9#mK2pL8qR@localhost:5432/technexo_ai
```

💡 **Tip:** Click "Show" next to the password to copy it.

---

## 3. Upload Application Files

### Method A: File Manager (Easiest)

1. **Download your project** from Replit as a ZIP file
2. **Extract the ZIP** on your local computer
3. **Delete the `node_modules` folder** (if it exists) - Plesk will install this automatically
4. **In Plesk**, go to **Files** (or **File Manager**)
5. Navigate to: `/httpdocs/` (or `/public_html/`)
6. Click **Upload** and select all your project files
7. Upload everything **except** `node_modules/`

**Files to upload:**
```
✅ server/ (folder)
✅ client/ (folder)
✅ shared/ (folder)
✅ package.json
✅ package-lock.json
✅ vite.config.ts
✅ tsconfig.json
✅ tailwind.config.ts
✅ postcss.config.js
✅ drizzle.config.ts
✅ .env.example (rename to .env later)
❌ node_modules/ (DO NOT UPLOAD)
❌ dist/ (will be built on server)
```

### Method B: FTP/SFTP (Alternative)

Use FileZilla or any FTP client:

```
Host: your-server-hostname
Username: your-ftp-username
Password: your-ftp-password
Port: 21 (FTP) or 22 (SFTP)

Upload to: /httpdocs/
```

### Method C: Git (Advanced)

If you have Git extension in Plesk:

1. Go to **Git** in Plesk
2. Click **Add Repository**
3. Enter your Git repository URL
4. Set deployment path to `/httpdocs/`
5. Click **OK**

---

## 4. Configure Node.js Application

### Setup Application Settings

1. In Plesk, go to **Websites & Domains** → **technexo.ai**
2. Click **Node.js** (you should see the Node.js icon)
3. Configure the following:

**Application Settings:**

| Setting | Value | Notes |
|---------|-------|-------|
| **Node.js version** | `20.x` (latest LTS) | Select from dropdown |
| **Package manager** | `npm` | Keep default |
| **Application mode** | `production` | Sets NODE_ENV=production |
| **Application root** | `/httpdocs/` | Where your files are |
| **Document root** | `/httpdocs/client/dist/` | For static files (created after build) |
| **Application startup file** | `dist/index.js` | Entry point after build |

⚠️ **Important Notes:**

- **Document Root** must be a subdirectory of Application Root on Linux
- **Startup file** path is relative to Application Root
- We'll build the app first, then the `dist/index.js` file will be created

4. Click **Apply** (but don't enable yet - we need to set environment variables first)

---

## 5. Set Environment Variables

### Add Environment Variables

In the same **Node.js** configuration screen, scroll to **Environment Variables** section:

Click **+ Add Variable** for each:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `DATABASE_URL` | Your PostgreSQL connection | `postgresql://technexo_user:pass@localhost:5432/technexo_ai` |
| `SESSION_SECRET` | Random secure string | Generate using method below |
| `OPENAI_API_KEY` | Your OpenAI key | `sk-proj-...` |
| `PORT` | `3000` | Plesk manages port internally |
| `NODE_ENV` | `production` | Already set by Application mode |

### Generate SESSION_SECRET:

**Method 1:** Use online generator
- Visit: https://randomkeygen.com/
- Copy a "Fort Knox Password" (256-bit)

**Method 2:** Use Node.js (if you have SSH access)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example result:**
```
5f8a9c3d2e1b7f4a6c9d8e3f1a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6d8e1f3a5b7
```

---

## 6. Install Dependencies & Start

### Build and Start Your Application

Now that everything is configured:

1. **Install Dependencies:**
   - Click **NPM Install** button
   - Wait for completion (may take 2-3 minutes)
   - Check for "Completed successfully" message

2. **Run Build Script:**
   - Click **Run Script** button
   - Select: `build` from the dropdown
   - This runs `npm run build` to create production files
   - Wait for completion

3. **Push Database Schema:**
   - Click **Run Script** button
   - Select: `db:push` from the dropdown
   - This creates your database tables
   - Wait for "Completed successfully"

4. **Enable & Start Application:**
   - Toggle **Enable Node.js** to ON
   - Click **Restart App**

5. **Verify Application is Running:**
   - Visit: `http://technexo.ai` (or your domain)
   - You should see your application!

---

## 7. Configure SSL Certificate (HTTPS)

### Free SSL with Let's Encrypt

1. In Plesk, go to **Websites & Domains** → **technexo.ai**
2. Click **SSL/TLS Certificates**
3. Click **Install** next to "Let's Encrypt"
4. Configure:
   - ✅ Include `www.technexo.ai`
   - ✅ Secure the website
   - Email: your-email@example.com
5. Click **Install**

### Enable HTTPS Redirect

1. Go to **Hosting Settings** for technexo.ai
2. Find **Security** section
3. ✅ Check **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
4. Click **Apply**

✅ **Done!** Your site is now at `https://technexo.ai`

---

## 8. Testing & Troubleshooting

### Test Your Application

1. **Visit your website:** https://technexo.ai
2. **Test registration:** Create a new user account
3. **Test website generation:** Create a website
4. **Check database:** Verify data is saved (use Plesk database tools)

### View Application Logs

**In Plesk:**
1. Go to **Websites & Domains** → **technexo.ai**
2. Click **Logs**
3. View error logs and access logs

**Via SSH (if available):**
```bash
tail -f /var/log/passenger/passenger.log
```

### Common Issues & Solutions

#### ❌ **"Application failed to start"**

**Cause:** Missing dependencies or build errors

**Solution:**
1. Click **NPM Install** again
2. Check logs for errors
3. Verify `package.json` is in Application Root
4. Make sure `dist/index.js` exists (run build script)

---

#### ❌ **"Cannot connect to database"**

**Cause:** Wrong DATABASE_URL or database doesn't exist

**Solution:**
1. Verify database exists in Plesk → Databases
2. Check DATABASE_URL format:
   ```
   postgresql://user:password@localhost:5432/database_name
   ```
3. Test connection using phpPgAdmin in Plesk

---

#### ❌ **"Module not found" errors**

**Cause:** Dependencies not installed

**Solution:**
1. Delete `node_modules` folder (if exists)
2. Click **NPM Install** in Plesk
3. Wait for completion
4. Restart App

---

#### ❌ **"404 Not Found" on all pages**

**Cause:** Document Root misconfigured

**Solution:**
1. Go to Node.js settings
2. Set Document Root to: `/httpdocs/client/dist/`
3. Make sure `npm run build` was executed
4. Restart App

---

#### ❌ **"OpenAI API error"**

**Cause:** OPENAI_API_KEY not set or invalid

**Solution:**
1. Check Environment Variables in Node.js settings
2. Verify key starts with `sk-proj-` or `sk-`
3. Test key at https://platform.openai.com/api-keys
4. Add/update OPENAI_API_KEY variable
5. Restart App

---

### Restart Application

**When to restart:**
- After changing environment variables
- After updating code files
- After running build script
- When app is not responding

**How to restart:**
1. Go to **Node.js** settings for your domain
2. Click **Restart App** button

OR via SSH:
```bash
touch /httpdocs/tmp/restart.txt
```

---

## 📝 Application Updates

### How to Update Your Application

1. **Upload new files** via File Manager/FTP
   - Replace changed files only
   - **Don't upload** `node_modules/` or `dist/`

2. **Install new dependencies** (if package.json changed)
   - Click **NPM Install**

3. **Rebuild application**
   - Click **Run Script** → `build`

4. **Push database changes** (if schema changed)
   - Click **Run Script** → `db:push`

5. **Restart application**
   - Click **Restart App**

---

## 🔒 Security Checklist

- [ ] SSL certificate installed (HTTPS)
- [ ] Strong SESSION_SECRET generated
- [ ] Database password is complex
- [ ] OPENAI_API_KEY is secure
- [ ] Application mode set to `production`
- [ ] HTTP→HTTPS redirect enabled
- [ ] Regular backups scheduled in Plesk

---

## 📊 Database Backups

### Schedule Automatic Backups in Plesk

1. Go to **Tools & Settings**
2. Click **Backup Manager**
3. Click **Schedule**
4. Configure:
   - ✅ Full backup
   - Frequency: Daily at 2:00 AM
   - Retention: Keep 7 backups
5. Click **OK**

### Manual Backup

1. Go to **Databases** → Select `technexo_ai`
2. Click **Export Dump**
3. Download the `.sql` file

---

## 💰 Cost Benefits

**Plesk Dedicated Host:**
- All-in-one solution (hosting + control panel)
- Database included
- SSL certificates free (Let's Encrypt)
- No additional charges for Node.js
- Total: **Your existing hosting plan** (already paid)

**vs. Separate VPS:**
- Would need: VPS + cPanel/Plesk license + management time
- Savings: **$10-30/month** by using existing infrastructure

---

## 🎯 Quick Reference

### Important Paths

| Item | Path |
|------|------|
| Application Root | `/httpdocs/` |
| Document Root | `/httpdocs/client/dist/` |
| Startup File | `dist/index.js` |
| Logs | `/var/log/passenger/` |
| Database | Via Plesk panel |

### Important Commands (SSH)

```bash
# Navigate to app directory
cd /httpdocs/

# Install dependencies
npm install

# Build application
npm run build

# Push database schema
npm run db:push

# View logs
tail -f /var/log/passenger/passenger.log

# Restart app
touch tmp/restart.txt
```

---

## 📚 Resources

- [Plesk Node.js Documentation](https://docs.plesk.com/en-US/obsidian/administrator-guide/website-management/hosting-nodejs-applications.76652/)
- [Plesk SSL Guide](https://docs.plesk.com/en-US/obsidian/administrator-guide/website-security/ssl-tls-certificates.59350/)
- [PostgreSQL in Plesk](https://docs.plesk.com/en-US/obsidian/administrator-guide/website-databases.59256/)

---

## ✅ Production Checklist

- [ ] Node.js extension installed
- [ ] PostgreSQL database created
- [ ] Application files uploaded (without node_modules)
- [ ] Node.js configured (version, paths, startup file)
- [ ] Environment variables set (DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY)
- [ ] Dependencies installed (NPM Install)
- [ ] Application built (npm run build)
- [ ] Database schema pushed (npm run db:push)
- [ ] Node.js enabled and app started
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] Application tested and working
- [ ] Backups scheduled

---

**Your app is now live at https://technexo.ai** 🚀

**Support:** If you need help, check Plesk logs or contact your hosting provider's support team.
