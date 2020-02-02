ssh grunnkart@hydra 'mkdir -p ~/tilesdata/forvaltningsportalen/kart'
scp build/metadata.json grunnkart@hydra:~/tilesdata/forvaltningsportalen/kart/metadata.json

ssh grunnkart@cerastes 'mkdir -p ~/dockerapper/tilesdata/forvaltningsportalen/kart'
scp build/metadata.json grunnkart@cerastes:~/dockerapper/tilesdata/forvaltningsportalen/kart/metadata.json
ssh grunnkart@cerberos 'mkdir -p ~/dockerapper/tilesdata/forvaltningsportalen/kart'
scp build/metadata.json grunnkart@cerberos:~/dockerapper/tilesdata/forvaltningsportalen/kart/metadata.json
