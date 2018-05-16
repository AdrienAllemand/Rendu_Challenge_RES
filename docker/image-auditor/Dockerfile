FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY ./src/* ./

ENTRYPOINT [ "node", "auditor.js" ]

