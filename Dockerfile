# FROM node:16-alpine as builder

# WORKDIR /app

# COPY ./app .

# RUN npm ci

# RUN npm run build

# # EXPOSE 3000

# # CMD ["npx", "serve", "dist"]

# FROM nginx:latest as production
# ENV NODE_ENV production

# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]



# Build React frontend
FROM node:lts-alpine as build-stage-frontend
WORKDIR /app
COPY app/package*.json ./
COPY app/ .
RUN npm ci
RUN npm run build

# Build Go backend
FROM golang:latest as build-stage-backend
WORKDIR /backend
COPY backend/ .
RUN go get -d -v ./...
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./api

# Final stage: nginx server for React static files and Go binary
FROM nginx:alpine as production-stage
RUN apk add --no-cache supervisor
COPY --from=build-stage-frontend /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy Go binary from the build stage
COPY --from=build-stage-backend /backend /go/bin/main

# Add Supervisord config
COPY supervisord.conf /etc/supervisord.conf

# Run Go binary
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]

# Expose port 80 for nginx
EXPOSE 80
