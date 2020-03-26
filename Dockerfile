FROM node:10

WORKDIR /app
RUN apt update && apt install -y --no-install-recommends apt-utils curl
#RUN curl -o- -L https://yarnpkg.com/install.sh | /bin/bash
RUN groupadd -r --gid 1007 dockerrunner && useradd -r -g dockerrunner dockerrunner
COPY package*.json ./

#RUN npm install 
RUN npm ci --only=production
COPY . .
RUN npm run test && \
    npm run build && 
USER dockerrunner
CMD [ "npm", "start" ]




