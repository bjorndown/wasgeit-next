ARG IMAGE_VER="18-alpine3.16"
FROM node:${IMAGE_VER} as build

WORKDIR /opt/wasgeit

ADD . .

RUN npm install

RUN cd crawler && npm run compile && npm run test && npm run build

FROM node:${IMAGE_VER} as runtime

COPY --from=build /opt/wasgeit/crawler/dist/index.js .

CMD ["node", "index.js"]