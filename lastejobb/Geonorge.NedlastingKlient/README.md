# Geonorge.NedlastingKlient

This project provides a client software for downloading dataset's published through Geonorge's Atom Feed. The general idea is to provided a tool to synchronize dataset on a regular basis.

It includes a desktop application for browsing and selecting files you want to download. A console application is provided to perform downloads. This console application can be scheduled to run through Scheduled tasks on windows, or cron on \*nix platforms.

# Introduction

Use the graphical client to select which files you want to download. The selected files are saved to download.json. The file is saved at the following locations:

Windows:
C:\Users\{USERNAME}\AppData\Local\Geonorge\Nedlasting

Linux/Mac:
/home/{USERNAME}/.local/share/Geonorge/Nedlasting

When you start the console application the download.json file is parsed together with the latest version of the Atom Feed. The application inspects the last updated date and compares it with the local copy of the file. If a new file has been published it will start the download.

The graphical client is only available on Windows. But the console application can be run on all platforms. This means that you can configure a list of files to download. Copy the download.json from your Windows machine on to your mac/linux machine and run the console application to perform download.

## How to change download location

The default download location is **My Documents\Geonorge-Nedlasting** (windows) or **/home/{username}/Geonorge-Nedlasting** (linux/mac).

To change this location go into the application settings directory, se previous paragraph, and edit the settings.json file. Here you can change the DownloadDirectory setting. Save the file and it will be used next time you run the download application.

## How to setup development environment

Project depends on:

- .net core 2.1 SDK
- .net framework 4.7.1 Developer pack

Packages can be downloaded from here:
https://www.microsoft.com/net/download/windows

Solution builds with Visual Studio 2017.

Signing of application binaries can be done with signtool.exe. This tool is a part of Windows 8 SDK. On the build server you can start Visual Studio Installer, select modify on your Build Tools installation and select Windows 8 SDK. The signtool will hopefully be available at C:\Program Files (x86)\Windows Kits\8.1\bin\x86\signtool.exe.

Remember to sign both the exe file and the final setup exe/msi file.

## Project structure

### NedlastingKlient

Common class library for parsing atom feeds and downloading files.

Compilation targets both netstandard 2.1 (.net core) and .net framework 4.7.1

### NedlastingKlient.Gui

Graphical user interface for browsing and selecting files for download

Compilation target: .net framework 4.7.1

### NedlastingKlient.Konsoll

Console application for downloading selected files

Compilation target: netstandard 2.1 (.net core)

## How to build

Build and publish for windows (64-bit)

    dotnet publish -r win-x64

Build and publish for windows (64 bit) self contained

    dotnet publish -r win-x64 --self-contained
