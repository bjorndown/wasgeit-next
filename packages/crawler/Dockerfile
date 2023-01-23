ARG IMAGE_VER="18-alpine3.16"
FROM node:${IMAGE_VER} as build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /opt/wasgeit

ADD . .

RUN pnpm install && cd packages/crawler && pnpm run compile && pnpm run test && pnpm run build

FROM node:${IMAGE_VER} as runtime

COPY --from=build /opt/wasgeit/packages/crawler/dist/index.js .

CMD ["node", "index.js"]