FROM node:16-alpine as builder

WORKDIR /app

COPY ./app .

RUN npm ci

RUN npm run build

# EXPOSE 3000

# CMD ["npx", "serve", "dist"]

FROM nginx:latest as production
ENV NODE_ENV production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]