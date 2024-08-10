#!/bin/sh

# set -e
cmd="$@"
echo $cmd

echo "Env: $ENVIRONMENT"

# if
#     wget -O /opt/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
# then
#     ls /opt
# else
#     echo file not fetched
# fi


if [[ $ENVIRONMENT == "dev" ]]; then
    npm run dev
else
    npm run dev
fi
