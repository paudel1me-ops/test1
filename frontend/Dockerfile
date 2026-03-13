FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better build caching.
COPY package.json ./package.json
RUN npm install --legacy-peer-deps

# Copy frontend source.
COPY public ./public
COPY src ./src

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
