@echo off
title Turon Odob-Ilm 1:1 3D Loyiha Serveri
echo ========================================================
echo   TURON ODOB-ILM (FURQAT) - 1:1 3D ARXITEKTURA LOYIHASI
echo ========================================================
echo Brauzerda ochilmoqda: http://localhost:8765/index.html
echo To'xtatish uchun bu oynani yoping (Ctrl+C).
cd /d "%~dp0"
start "" "http://localhost:8765/index.html"
python -m http.server 8765
