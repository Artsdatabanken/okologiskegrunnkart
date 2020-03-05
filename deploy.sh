#!/bin/bash
#Please add variables as environmental variables in Travis settings for the project when using this script.
#These lines should also be added in the "script block" of travis.yml.
#- export BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)
#- echo "TRAVIS_BRANCH=$TRAVIS_BRANCH, PR=$PR, BRANCH=$BRANCH"
BRANCH=$1
FILENAME=forvaltningsportal_$BRANCH.tar.gz
echo "Making archive..."
tar --directory=build -zcf $FILENAME .
echo "Deploying..."
if [ "${BRANCH}" == "master" ]
 then
  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $FILENAME $scp_user@$scp_dest
  #Posting to slack to trigger deployment
  curl -X POST --data-urlencode "payload={\"channel\": \"$slack_chan\", \"username\": \"travis not the band\", \"text\": \"$slack_command\", \"icon_emoji\": \":ghost:\"}" https://hooks.slack.com/services/$SLACK_TOKEN

  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $BRANCH.tar.gz $scp_user@$prod_dest
 else
  echo "This branch will not be deployed, since it's not the master branch."
fi
