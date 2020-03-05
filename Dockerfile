FROM node:10

WORKDIR /app
RUN apt update && apt install -y --no-install-recommends apt-utils curl
#RUN curl -o- -L https://yarnpkg.com/install.sh | /bin/bash

COPY package*.json ./

#RUN npm install 
RUN npm ci --only=production
COPY . .
RUN npm run test && \
    npm run build && 

CMD [ "npm", "start" ]
