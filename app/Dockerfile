FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json trước để tận dụng cache layer
COPY package.json ./
RUN npm install --omit=dev

# Copy toàn bộ source code và phân quyền cho user node
COPY . .
RUN chown -R node:node /usr/src/app

# HARDENING: Chạy container với user không phải root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
