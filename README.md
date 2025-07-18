# 🧾 Ticketing App – Containerized with Docker & MongoDB

[![Docker](https://img.shields.io/badge/Dockerized-Yes-blue?logo=docker)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/github/license/ob-adams/ticketing-app-dockerized)](LICENSE)
[![Author](https://img.shields.io/badge/Author-ob--adams-blueviolet)](https://github.com/ob-adams)

This project transforms a previously built ticketing app (Next.js) into a fully containerized microservice environment using **Docker**, **MongoDB**, and **Mongo Express**. The web app is built using a **multi-stage Dockerfile** to optimize image size and performance.

> **Repo:** [ob-adams/ticketing-app-dockerized](https://github.com/ob-adams/ticketing-app-dockerized)

---

## 📷 Screenshot

> ![Ticketing App Screenshot](./docs/screenshot.png)

---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) (frontend + API routes)
- [MongoDB](https://www.mongodb.com/) (database)
- [Mongo Express](https://github.com/mongo-express/mongo-express) (DB GUI)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🐳 Docker Architecture

This app is deployed using Docker Compose and includes the following services:

| Service          | Description                                     |
| ---------------- | ----------------------------------------------- |
| `web-app-ticket` | Next.js app, built using multi-stage Dockerfile |
| `mongodb`        | MongoDB database with secure credentials        |
| `mongo-express`  | Web-based admin GUI for MongoDB                 |

Environment variables are securely loaded from a `.env` file **excluded** from version control and image builds via `.gitignore` and `.dockerignore`.

---

## 📁 Project Structure

```
ticketing-app/
├── Dockerfile
├── docker-compose.yml
├── .env
├── .dockerignore
├── .gitignore
├── package.json
├── public/
├── app/ or pages/
└── ...
```

---

## 🛠️ Dockerfile (Multi-Stage Build)

```Dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run production server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📂 .env File Format

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin1OBOB
MONGO_INITDB_ROOT_PASSWORD=secret1OBOB

# Used by the Next.js app
MONGODB_URI=mongodb://admin1OBOB:secret1OBOB@mongodb

# Mongo Express
ME_CONFIG_MONGODB_ADMINUSERNAME=admin1OBOB
ME_CONFIG_MONGODB_ADMINPASSWORD=secret1OBOB
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=secret
```

---

## 🧰 Docker Compose Reference

```yaml
services:
  web-app:
    image: web-app-ticket
    build:
      context: .
      dockerfile: Dockerfile
    container_name: web-app-ticket
    restart: unless-stopped
    environment:
      - MONGODB_URI=${MONGODB_URI}
    ports:
      - 3000:3000

  mongodb:
    image: mongo:8.0
    container_name: mongodb
    restart: unless-stopped
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
    volumes:
      - mongodb-data:/data/db

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    restart: unless-stopped
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_MONGODB_ADMINUSERNAME=${ME_CONFIG_MONGODB_ADMINUSERNAME}
      - ME_CONFIG_MONGODB_ADMINPASSWORD=${ME_CONFIG_MONGODB_ADMINPASSWORD}
      - ME_CONFIG_BASICAUTH_USERNAME=${ME_CONFIG_BASICAUTH_USERNAME}
      - ME_CONFIG_BASICAUTH_PASSWORD=${ME_CONFIG_BASICAUTH_PASSWORD}

volumes:
  mongodb-data:
```

---

## 🧾 .dockerignore

```dockerignore
node_modules
.next
.env
.git
*.log
*.md
.dockerignore
.gitignore
Dockerfile*
```

---

## 🚀 How to Run

```bash
# Build and start containers
docker compose up --build

# Stop and remove containers
docker compose down
```

Visit the app at: [http://localhost:3000](http://localhost:3000)  
Visit Mongo Express: [http://localhost:8081](http://localhost:8081)

---

## ☁️ Optional Deployment

You can push your built image to a container registry and deploy it on platforms like:

- **[Docker Hub](https://hub.docker.com/)**  
  Example:

  ```bash
  docker tag web-app-ticket obobob/web-app-ticket
  docker push obobob/web-app-ticket
  ```

- **[Render](https://render.com/)**  
  Configure a Docker service using your GitHub repo and `.env` settings.

- **[Fly.io](https://fly.io/)**  
  For full Docker deployments with custom domains and persistent volumes.

---

## ✅ Final Notes

- Make sure `.env` is **not committed** to your repo.
- Build is optimized with multi-stage Dockerfile.
- Shared Docker network allows seamless communication between containers without needing exposed ports for internal calls.

---

## 👤 Author

Developed and containerized by [ob-adams](https://github.com/ob-adams)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
