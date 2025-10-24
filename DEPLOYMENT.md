# Self-Hosting Deployment Guide - technexo.ai

Complete guide to deploy your AI Web Builder on your own VPS/hosting to point **technexo.ai** to your server.

## Prerequisites

- VPS server (DigitalOcean, Hetzner, AWS, Linode, etc.)
- Ubuntu 22.04 LTS or similar (recommended)
- Domain: technexo.ai with DNS access
- Minimum: 1GB RAM, 1 CPU core, 25GB storage
- Recommended: 2GB RAM, 2 CPU cores for better performance

---

## Table of Contents

1. [Server Setup](#1-server-setup)
2. [Install Dependencies](#2-install-dependencies)
3. [Database Setup](#3-database-setup)
4. [Deploy Application](#4-deploy-application)
5. [Configure NGINX](#5-configure-nginx)
6. [SSL Certificate](#6-ssl-certificate-https)
7. [DNS Configuration](#7-dns-configuration)
8. [Process Management](#8-process-management-pm2)
9. [Maintenance](#9-maintenance)

---

## 1. Server Setup

### SSH into your VPS

```bash
ssh root@your-server-ip
```

### Create a non-root user (security best practice)

```bash
adduser technexo
usermod -aG sudo technexo
su - technexo
```

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Install Dependencies

### Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
npm --version
```

### Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install NGINX

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Install build tools

```bash
sudo apt install -y build-essential git
```

---

## 3. Database Setup

### Create PostgreSQL database and user

```bash
sudo -u postgres psql
```

In PostgreSQL prompt:

```sql
CREATE DATABASE technexo_ai;
CREATE USER technexo_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE technexo_ai TO technexo_user;
\q
```

### Test database connection

```bash
psql -U technexo_user -d technexo_ai -h localhost
# Enter password when prompted
\q
```

### Get your DATABASE_URL

```
postgresql://technexo_user:your-secure-password@localhost:5432/technexo_ai
```

---

## 4. Deploy Application

### Clone/Upload your code

**Option A: Using Git (recommended)**

```bash
cd /home/technexo
git clone <your-git-repo-url> technexo-ai
cd technexo-ai
```

**Option B: Manual upload**

```bash
# On your local machine:
scp -r /path/to/project technexo@your-server-ip:/home/technexo/technexo-ai
```

**Option C: Download from Replit**

Download the entire project as ZIP from Replit, then upload to server.

### Install dependencies

```bash
cd /home/technexo/technexo-ai
npm install
```

### Configure environment variables

```bash
cp .env.example .env
nano .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://technexo_user:your-secure-password@localhost:5432/technexo_ai
SESSION_SECRET=generate-a-long-random-string-here
OPENAI_API_KEY=sk-your-openai-api-key
PORT=5000
NODE_ENV=production
```

**Generate secure SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Push database schema

```bash
npm run db:push
```

### Build the application

```bash
npm run build
```

This will:
- Build the frontend (Vite)
- Bundle the backend (esbuild)
- Output to `dist/` folder

### Test the build

```bash
npm start
```

Visit `http://your-server-ip:5000` to verify it works. Press Ctrl+C to stop.

---

## 5. Configure NGINX

### Create NGINX configuration

```bash
sudo nano /etc/nginx/sites-available/technexo.ai
```

Copy the contents from `nginx.conf.example` in this project.

### Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/technexo.ai /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default config
```

### Test NGINX configuration

```bash
sudo nginx -t
```

### Reload NGINX

```bash
sudo systemctl reload nginx
```

---

## 6. SSL Certificate (HTTPS)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Get SSL certificate

```bash
sudo certbot --nginx -d technexo.ai -d www.technexo.ai
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically:
- Obtain SSL certificate
- Configure NGINX for HTTPS
- Set up auto-renewal

### Test auto-renewal

```bash
sudo certbot renew --dry-run
```

---

## 7. DNS Configuration

### Point your domain to the server

Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**A Records:**

| Type | Name | Value            | TTL  |
|------|------|------------------|------|
| A    | @    | your-server-ip   | 3600 |
| A    | www  | your-server-ip   | 3600 |

**Alternative: CNAME for www**

| Type  | Name | Value        | TTL  |
|-------|------|--------------|------|
| A     | @    | your-server-ip | 3600 |
| CNAME | www  | technexo.ai  | 3600 |

### Wait for DNS propagation

Can take 5 minutes to 48 hours. Check status:

```bash
dig technexo.ai
nslookup technexo.ai
```

---

## 8. Process Management (PM2)

### Start the application with PM2

```bash
cd /home/technexo/technexo-ai
pm2 start ecosystem.config.js
```

### Check status

```bash
pm2 status
pm2 logs technexo-ai
pm2 monit  # Real-time monitoring
```

### Setup auto-restart on server reboot

```bash
pm2 startup
# Copy and run the command it outputs
pm2 save
```

### Useful PM2 commands

```bash
pm2 restart technexo-ai   # Restart app
pm2 stop technexo-ai      # Stop app
pm2 delete technexo-ai    # Remove from PM2
pm2 logs --lines 100      # View last 100 log lines
```

---

## 9. Maintenance

### Update the application

```bash
cd /home/technexo/technexo-ai

# Pull latest code
git pull origin main

# Install dependencies (if package.json changed)
npm install

# Rebuild
npm run build

# Restart with zero downtime
pm2 reload technexo-ai
```

### Database backups

**Create backup:**

```bash
pg_dump -U technexo_user technexo_ai > backup_$(date +%Y%m%d).sql
```

**Restore backup:**

```bash
psql -U technexo_user technexo_ai < backup_20241024.sql
```

**Automated daily backups:**

```bash
crontab -e
```

Add:

```
0 2 * * * pg_dump -U technexo_user technexo_ai > /home/technexo/backups/backup_$(date +\%Y\%m\%d).sql
```

### Monitor logs

```bash
# PM2 logs
pm2 logs technexo-ai

# NGINX logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Server monitoring

```bash
# Install monitoring
pm2 install pm2-server-monit

# Check server resources
htop
df -h  # Disk space
free -m  # Memory
```

---

## Cost Breakdown (Monthly)

**Recommended VPS Providers:**

- **Hetzner Cloud**: €4.49/month (2GB RAM, 1 CPU, 40GB SSD) - Best value
- **DigitalOcean**: $6/month (1GB RAM, 1 CPU, 25GB SSD)
- **Vultr**: $6/month (1GB RAM, 1 CPU, 25GB SSD)
- **Linode**: $5/month (1GB RAM, 1 CPU, 25GB SSD)

**Additional costs:**
- SSL Certificate: FREE (Let's Encrypt)
- Domain: Already owned (technexo.ai)
- PostgreSQL: FREE (self-hosted)
- Total: **~$4-6/month** vs Replit's higher hosting costs

---

## Troubleshooting

### App won't start

```bash
# Check logs
pm2 logs technexo-ai

# Check if port 5000 is in use
sudo lsof -i :5000

# Kill process on port 5000
sudo kill -9 $(sudo lsof -t -i:5000)
```

### Database connection errors

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U technexo_user -d technexo_ai -h localhost

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### NGINX errors

```bash
# Test config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart NGINX
sudo systemctl restart nginx
```

### SSL certificate issues

```bash
# Renew manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Production Checklist

- [ ] Server secured (firewall, SSH keys)
- [ ] PostgreSQL database created and secured
- [ ] Environment variables configured
- [ ] Application built successfully
- [ ] NGINX configured and tested
- [ ] SSL certificate installed
- [ ] DNS pointing to server
- [ ] PM2 auto-restart enabled
- [ ] Database backups scheduled
- [ ] Monitoring configured

---

## Security Best Practices

1. **Firewall:** Only allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **SSH Key Authentication:** Disable password login
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

3. **Regular updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Strong passwords:** Use generated passwords for database and session secrets

5. **Environment variables:** Never commit `.env` to version control

---

## Support

- PostgreSQL docs: https://www.postgresql.org/docs/
- NGINX docs: https://nginx.org/en/docs/
- PM2 docs: https://pm2.keymetrics.io/docs/
- Let's Encrypt: https://letsencrypt.org/
- Node.js docs: https://nodejs.org/docs/

---

**Your app is now live at https://technexo.ai** 🚀
