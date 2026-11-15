# CustFM Production Deployment Guide

Deploying the **Customer Facing Platform (`CustFM`)** for **`famousmobiles.com`** (Server: `13.140.146.12`).

---

## Architecture Overview

```
Client Request (https://famousmobiles.com / http://13.140.146.12)
                     │
                     ▼
          ┌─────────────────────┐
          │     Nginx :80       │ (Exposed on host port 80)
          └──────────┬──────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   / (Frontend)               /api/ (Backend)
 Next.js 15 SSR             Spring Boot 3 REST API
  (Port 3000)                   (Port 8081)
                                      │
                                      ▼
                               H2 / SQLite DB
                              (/app/data Volume)
```

---

## Method 1: Direct Sync (Fastest — No Git remote needed)

From your local machine terminal:

```bash
# 1. Sync project files directly to the server
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude 'target' --exclude '.git' ./ root@13.140.146.12:/var/CustFM/

# 2. SSH into your server and run deployment
ssh root@13.140.146.12
cd /var/CustFM
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Method 2: Git Remote Deployment

### Step A: Push from local machine
```bash
git remote add origin https://github.com/mubbumuzzi/CustFM.git
git push -u origin master
```

### Step B: Pull & Deploy on `13.140.146.12`
```bash
ssh root@13.140.146.12
cd /var
git clone https://github.com/mubbumuzzi/CustFM.git CustFM
cd /var/CustFM
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Managing the Deployment

- **View Live Logs:**
  ```bash
  docker compose logs -f
  ```
- **Restart Services:**
  ```bash
  docker compose restart
  ```
- **Stop Services:**
  ```bash
  docker compose down
  ```
- **Access Endpoints:**
  - Customer Web App: `http://famousmobiles.com` (or `http://13.140.146.12/`)
  - Backend API: `http://famousmobiles.com/api/catalog/services`
  - Database Console: `http://13.140.146.12/h2-console`
