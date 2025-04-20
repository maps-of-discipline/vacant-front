FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN --mount=type=secret,id=env_file \
  if [ -f "/run/secrets/env_file" ]; then \
  cp /run/secrets/env_file .env; \
  fi

RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
