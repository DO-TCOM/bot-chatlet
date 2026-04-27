FROM ghcr.io/puppeteer/puppeteer:22.0.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXEC_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY bot.js .

CMD ["node", "bot.js"]
