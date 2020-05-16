FROM edipaulo/proxy-1mk


# ENV POSTGRES_DB  plataforma

ADD . /app
WORKDIR /app
# RUN rm -r ./public/service-worker.js
# RUN rm -r ./public/manifest.json
RUN yarn
RUN yarn build-server

# CMD [ "npm", "start" ]
CMD [ "node", "out/server.js" ]
