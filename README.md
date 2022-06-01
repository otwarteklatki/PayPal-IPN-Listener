# PayPal-IPN-Listener
This project listens for paypal IPNs from the OpenCages UK paypal account. It will then record these IPNs in mongodb and request [this project](https://github.com/otwarteklatki/uk-sendgrid-api) to send a receipt email. 

### ENV VARS
- MONGO_URI - Mongodb uri, point this at some mongodb instance and database.
- SENDGRID_API_SERVICE_KEY - API key so that this project can request sending an email from [this project](https://github.com/otwarteklatki/uk-sendgrid-api), it has to match the IPN_LISTENER_API_KEY env var on the deployment of that project for a request to be successful. 
- SENDGRID_API_SERVICE_URL - url for the deployment of [this project](https://github.com/otwarteklatki/uk-sendgrid-api).

### How do I test this?
Use https://developer.paypal.com/developer/ipnSimulator/ to test sending IPNs to the API. I would suggest using a local tunnel of some sort to test this on your local. 

### How to deploy
Push to master

### PROD URL
https://ocuk-paypal-ipn-master-uepvew4upa-ew.a.run.app

### The rest of the README
The readme from the forked repo is below... I copied the base of this API from some wonderful github account because getting paypal IPNs to work was a nightmare. 

<h1 align="center">
  PayPal IPN Listener
</h1>

A Node.js and MongoDB based listener for PayPal IPN events.

![GitHub Workflow Status](<https://img.shields.io/github/workflow/status/Fairbanks-io/PayPal-IPN-Listener/Create%20Release(s)?label=Docker%20Build>)
![GitHub top language](https://img.shields.io/github/languages/top/Fairbanks-io/PayPal-IPN-Listener.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/fairbanksio/paypal-ipn-listener.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/Fairbanks-io/PayPal-IPN-Listener.svg)
![Lines of code](https://img.shields.io/tokei/lines/github/jonfairbanks/docker-node-init)
![License](https://img.shields.io/github/license/Fairbanks-io/PayPal-IPN-Listener.svg)

## Getting Started

#### Prerequisites

The following will need to be installed before proceeding:

- Node v12+
- MongoDB
- Nginx

#### Clone the Project

```sh
# Clone it
git clone https://github.com/Fairbanks-io/PayPal-IPN-Listener.git
cd PayPal-IPN-Listener/
```

#### Run the Listener

```
# Install Dependencies
npm install

# Start Server
npm start
```

The IPN listener should now be running on http://localhost:8888

## Docker

This IPN Listener is also available on [Dockerhub](https://hub.docker.com/r/fairbanksio/paypal-ipn-listener).

To launch the Dockerfile, the following can be used as an example:

```sh
docker run -d -p 8888:8888 -e 'MONGO_URI=mongodb://user:password@localhost:27018/paypal' --restart unless-stopped --name 'paypal-ipn' fairbanksio/paypal-ipn-listener
```

The IPN listener should now be running on http://localhost:8888

If you need to get into the container for some reason, simply run the following on the Docker host:

```sh
docker exec -it paypal-ipn /bin/bash
```

## Environment Variables

| ENV            | Required? | Details                                                                                       | Example                                          |
| -------------- | --------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `MONGO_URI`    | No        | What Mongo instance to use. If the ENV is not provided, `mongodb://localhost/paypal` is used. | `mongodb://user:password@localhost:27018/paypal` |
| `LOG_LOCATION` | No        | Override where the IPN log is written. By default the log is written into the app directory.  | `/Logs/ipn.log`                                  |
| `PORT`         | No        | Override the application port. Defaults to 8888.                                              | `8889`                                           |

## Configure Nginx

PayPal requires that your IPN Listener be hosted on an HTTPS enabled domain. To achieve both of those, you can use an Nginx reverse proxy with the following configuration:

```
server {
    if ($host = ipn.mysite.io) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name ipn.mysite.io;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl http2;
    ssl on;
    ssl_certificate fullchain.pem;
    ssl_certificate_key privkey.pem;
    server_name ipn.mysite.io;
    add_header X-Frame-Options "SAMEORIGIN";
    large_client_header_buffers 4 8k;
    location / {
        proxy_pass http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

The IPN listener should now be available on the URL configured when setting up Nginx. To complete setup, [update your IPN url](https://developer.paypal.com/docs/classic/ipn/integration-guide/IPNSetup/) on PayPal and run a test payment with the [IPN Simulator](https://developer.paypal.com/developer/ipnSimulator/).
