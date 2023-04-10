

@REM compile ui
cd ui
npm run build
cd ..

@REM put static files on backend
rd /S /Q api/static
move /Y ui/build api/static