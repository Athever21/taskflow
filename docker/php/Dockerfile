FROM php:8.3-fpm-alpine

# System deps
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev

# PHP extensions Laravel needs
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Composer (copied from official image — best practice)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Create non-root user matching typical host UID
RUN addgroup -g 1000 app && adduser -G app -u 1000 -D app

USER app

WORKDIR /var/www/backend

# Default command: run PHP-FPM
CMD ["php-fpm"]