ARG BASE_IMAGE=node:22-slim
FROM ${BASE_IMAGE} AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ src/
RUN npm run build
RUN rm -f /product_uuid || true

FROM ${BASE_IMAGE}
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist/ dist/
COPY version.json* ./
RUN [ -f version.json ] || echo '{"semver":"0.0.0-dev","version":"0.0.0-dev","sha":"unknown","branch":"unknown","builtAt":"unknown","component":"claims-manager"}' > version.json
COPY public/ public/
USER 1000:1000
EXPOSE 8080
CMD ["node", "dist/index.js"]
