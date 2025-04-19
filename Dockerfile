FROM node:20-alpine AS build-stage

WORKDIR /app

ARG VITE_VACANT_API
ARG VITE_ADMIN_API
ARG VITE_ADMIN_API_BACKED
ARG VITE_MAPS_API
ARG VITE_BASE_URL


ENV VITE_VACANT_API=${VITE_VACANT_API}
ENV VITE_ADMIN_API=${VITE_ADMIN_API}
ENV VITE_ADMIN_API_BACKED=${VITE_ADMIN_API_BACKED}
ENV VITE_MAPS_API=${VITE_MAPS_API}
ENV VITE_BASE_URL=${VITE_BASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
