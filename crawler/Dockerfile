ARG IMAGE_VER="18-alpine3.16"
FROM node:${IMAGE_VER} as build

WORKDIR /opt/wasgeit

ADD . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install && cd crawler && pnpm run compile && pnpm run test && pnpm run build

FROM node:${IMAGE_VER} as runtime

COPY --from=build /opt/wasgeit/crawler/dist/index.js .

CMD ["node", "index.js"]