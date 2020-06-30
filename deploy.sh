#!/bin/bash
#Please add variables as environmental variables in Travis settings for the project when using this script.
#These lines should also be added in the "script block" of travis.yml.
#- export BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)
#- echo "TRAVIS_BRANCH=$TRAVIS_BRANCH, PR=$PR, BRANCH=$BRANCH"
set -e
BRANCH=$1
PUBLIC_URL=$2
PULL_REQUEST=${PUBLIC_URL:1}
FILENAME=forvaltningsportal_$PULL_REQUEST.tar.gz
echo "Making archive..."
tar --directory=build -zcf $FILENAME .
echo "Deploying..."
if [ "${BRANCH}" == "master" ]
 then
  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $FILENAME $scp_user@$prod_dest  
  curl -X POST -H 'Content-type: application/json' --data '{"text":"deploy forvaltning master"}' $slackaddy
fi
if [ "$PULL_REQUEST" != "" ]
 then
  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $FILENAME $scp_user@$scp_dest
  curl -X POST -H 'Content-type: application/json' --data '{"text":"deploy forvaltning '$PULL_REQUEST'"}' $slackaddy
fi
