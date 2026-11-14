FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY server.cjs accounts.cjs progression.cjs progression-http.cjs ranked.cjs game-runtime.cjs ./
RUN mkdir -p /app/data && chown node:node /app/data
COPY public ./public
USER node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server.cjs"]
