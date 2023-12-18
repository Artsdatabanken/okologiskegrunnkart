mkdir build/static
ls -la wms-assistent/build/
cp -R wms-assistent/build/ build/static/
tar czf $(basename $GITHUB_REPOSITORY).tar.gz -C build .
