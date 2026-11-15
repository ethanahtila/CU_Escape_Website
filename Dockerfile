FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY server.cjs accounts.cjs progression.cjs progression-remote.cjs turso-sql.cjs progression-http.cjs ranked.cjs campus.cjs game-runtime.cjs achievement-catalog.json achievement-rules.cjs cosmetics-catalog.json shop-rules.cjs ./
RUN mkdir -p /app/data && chown node:node /app/data
COPY public ./public
USER node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server.cjs"]
