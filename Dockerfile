FROM node:latest

WORKDIR /app
COPY . .
RUN npm i
EXPOSE  ${VITE_PORT}

CMD npm run vite -- --host ${VITE_HOST} --port ${VITE_PORT}
