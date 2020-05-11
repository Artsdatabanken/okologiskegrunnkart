#!/bin/bash
set -e

# Publiser programkoden 
rsync -av -e ssh --exclude='temp/' ./ grunnkart@hydra:~/forvaltningsportal-lastejobb/lastejobb/
