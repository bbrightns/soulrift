@echo off
setlocal enabledelayedexpansion

:: Name of the output file
set "output=bundle.txt"

:: Delete previous bundle if it exists
if exist "%output%" del "%output%"

:: Process index.html in the root
if exist "index.html" (
    echo --- SOURCE: index.html --- >> "%output%"
    type "index.html" >> "%output%"
    echo. >> "%output%"
)

:: Process files in subfolders
for %%f in (css\* data\* js\*) do (
    echo --- SOURCE: %%f --- >> "%output%"
    type "%%f" >> "%output%"
    echo. >> "%output%"
)

echo Bundling complete! Check %output%.
pause