mkdir build/static
cp -R wms-assistent/build/ build/static/
cp -R wms-assistent/public/* build/static/
tar czf $(basename $GITHUB_REPOSITORY).tar.gz -C build .
