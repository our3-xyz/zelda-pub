FROM node:14-alpine as builder

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm ci
COPY . .
RUN npm run buildM

FROM nginx:1.23.0-alpine
#copies React to the container directory
# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY --from=builder /app/build .

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]


