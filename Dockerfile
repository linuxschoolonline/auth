FROM node
WORKDIR /app
ADD .env app.js db.js package.json package-lock.json ./
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm","start"]
