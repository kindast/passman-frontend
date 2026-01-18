# Build
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run
FROM nginx:alpine
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser
RUN mkdir -p /app/www
COPY --from=builder /app/dist /app/www
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown -R webuser:webuser /app/www /var/cache/nginx /var/log/nginx && chmod -R 755 /app/www
EXPOSE 80
USER webuser
CMD ["nginx", "-g", "daemon off;"]