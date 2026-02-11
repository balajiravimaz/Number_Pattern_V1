@echo off
cd /d "%~dp0"
echo Starting application...
start "" http://localhost:8080
index.exe file-server --listen :8080 --root "%cd%"
