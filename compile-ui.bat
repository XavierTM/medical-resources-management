

@REM compile ui
cd ui
npm run build
cd ..

@REM put static files on backend
rmdir api/static -Recurse -Force
move ui/build api/static