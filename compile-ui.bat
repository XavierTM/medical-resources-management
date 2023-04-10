

@REM compile ui
cd ui
npm run build
cd ..

@REM put static files on backend
move-item ./ui/build ./api/static -force