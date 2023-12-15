mkdir build/static
cp -R wms-assitent/build/ build/static/
tar czf $(basename $GITHUB_REPOSITORY).tar.gz -C build .
