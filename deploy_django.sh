#!/bin/bash
#Please add variables as environmental variables in Travis settings for the project when using this script.
#These lines should also be added in the "script block" of travis.yml.
#- export BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)
#- echo "TRAVIS_BRANCH=$TRAVIS_BRANCH, PR=$PR, BRANCH=$BRANCH"
set -e
BRANCH=$1
FILENAME=forvaltningsportal_django_$BRANCH.tar.gz
echo "Making archive..."
tar --directory=django -zcf $FILENAME .
echo "Deploying..."
if [ "${BRANCH}" == "master" ]
 then
  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $FILENAME $scp_user@$scp_dest2
  sshpass -p $scp_pass scp -o StrictHostKeyChecking=no $FILENAME $scp_user@$prod_dest2
 else
  echo "This branch will not be deployed, since it's not the master branch."
fi
