FROM ghcr.io/puppeteer/puppeteer:22.0.0

WORKDIR /app

COPY package*.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm install

COPY bot.js .

CMD ["node", "bot.js"]
