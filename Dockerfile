# FROM node:16
# # WORKDIR 
# COPY package.json .
# RUN npm install
# EXPOSE 5000
# CMD ["npm", "start"]


# Use Node 18 alpine as parent image
FROM node:16


# RUN apk update && apk add gcc vim nano git openssh-client libressl-dev

# Change the working directory on the Docker image to /app

ADD . /opt
WORKDIR /opt

# # Install wget for fetching mongoconnect-ssl
# RUN apk update && apk add wget
# # Download the file using wget
# RUN wget -O /opt/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# RUN openrc
# RUN touch /run/openrc/softlevel

# RUN mv nginx.conf /etc/nginx/http.d/default
# # RUN mv default.conf /etc/nginx/nginx.conf
# # RUN rc-service nginx restart

# RUN addgroup -S chatbot \
#     && adduser -S -G chatbot chatbot

# RUN chown -R chatbot /opt

# RUN mkdir -p /opt/logs
# RUN chown -R chatbot:chatbot /opt/logs


# # Copy package.json and package-lock.json to the /app directory
# COPY package.json package-lock.json ./

# Install dependencies
WORKDIR /opt

RUN npm install
#install pm2 gloablly to run the app
# RUN npm install -g pm2
# RUN npm install -g @socket.io/pm2
COPY ./deploy.sh /opt/deploy.sh

RUN chmod +x /opt/deploy.sh 

#ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD ["./deploy.sh"]
