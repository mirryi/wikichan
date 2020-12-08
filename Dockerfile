FROM node:15.3 as build

WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG TARGET
RUN yarn build:$TARGET

FROM scratch as export-stage
COPY --from=build /build/dist .
