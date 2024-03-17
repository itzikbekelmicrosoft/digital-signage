FROM node:16-alpine
COPY . /app
WORKDIR /app
RUN npm install
RUN cd mongoose-crudify && npm link
RUN npm link mongoose-crudify

ENTRYPOINT ["npm", "start"]
EXPOSE 80