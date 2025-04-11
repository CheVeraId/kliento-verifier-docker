FROM node:23.11.0-slim
LABEL org.opencontainers.image.source="https://github.com/CheVeraId/kliento-verifier-docker"
WORKDIR /opt/kliento-verifier
COPY . ./
RUN npm ci --omit=dev
USER node
CMD ["node", "--experimental-transform-types", "server.ts"]
EXPOSE 3000
