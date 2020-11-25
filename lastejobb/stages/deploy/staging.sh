#!/bin/bash
set -e

# Publiser programkoden 
rsync -av -e ssh --exclude='temp/' ./ grunnkart@hydra:~/okologiskegrunnkart-lastejobb/lastejobb/
