@echo off

CALL ng build --prod --base-href "https://sharpiro.github.io/health/"
CALL npx ngh

