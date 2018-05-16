FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

# Bundle app source
COPY ./src/* ./

RUN npm install

# EXPOSE 8080
ENTRYPOINT [ "node", "musician.js" ]

