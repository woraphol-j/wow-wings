FROM node:7.3.0

MAINTAINER WowBox team <wb@telenordigital.com>

ARG app_dir=/usr/src/app
RUN mkdir -p $app_dir
WORKDIR $app_dir

ADD package.json $app_dir

RUN npm install -s -g

COPY . $app_dir

ENV PORT 8080
EXPOSE $PORT

CMD ["npm", "start"]