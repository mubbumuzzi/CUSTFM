# CustFM Production Deployment Guide

Deploying the **Customer Facing Platform (`CustFM`)** to server `http://13.140.146.12:8080/`.

---

## Architecture Overview

```
Client Request (http://13.140.146.12:8080)
                     │
                     ▼
          ┌─────────────────────┐
          │     Nginx :80       │ (Exposed on host port 8080)
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
  - Customer Web App: `http://13.140.146.12:8080/`
  - Backend API: `http://13.140.146.12:8080/api/catalog/services`
  - Database Console: `http://13.140.146.12:8080/h2-console`
