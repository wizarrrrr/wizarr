<p align="center"> 
  <a href="https://opensource.org/license/gpl-2.0"><img src="https://img.shields.io/badge/License-GPL_2.0-blue.svg?color=3F51B5&style=for-the-badge&label=License&logoColor=000000&labelColor=ececec" alt="License: GPL 2.0"></a>
  <a href="https://discord.gg/XXCz7aM3ak"><img src="https://img.shields.io/discord/1020742926856372224.svg?label=Discord&logo=Discord&style=for-the-badge&logoColor=000000&labelColor=ececec" alt="Chat on Discord"></a>
  <br/>
  <br/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/wizarrrrr/wizarr/master/apps/wizarr-frontend/src/assets/img/wizard.png" width="300" title="Wizarr">
</p>

<h3 align="center">Server Management Wizard</h3>
<br/>

<p align="center">
  <a href="https://github.com/wizarrrrr/wizarr/releases"><img alt="Current Release" src="https://img.shields.io/github/release/wizarrrrr/wizarr.svg" /></a>
  <a href="https://opencollective.com/wizarr"><img alt="Backers" src="https://img.shields.io/opencollective/all/wizarr.svg?label=backers" /></a>
  <a href="https://features.wizarr.org"><img alt="Submit Feature Requests" src="https://img.shields.io/badge/vote_now-features?label=features" /></a>
  <a href="https://github.com/wizarrrrr/wizarr/issues"><img alt="Github Issues" src="https://img.shields.io/github/issues/wizarrrrr/wizarr" /></a>
  <a href="https://github.com/wizarrrrr/wizarr/actions/workflows/release.yml"><img alt="GitHub Build" src="https://img.shields.io/github/actions/workflow/status/wizarrrrr/wizarr/docker.yml" /></a>
</p>

---

## Introduction

Wizarr is an open-source software designed to simplify the management of media servers such as Jellyfin, Plex, and Emby. Initially created to allow users to easily invite others to their media servers, Wizarr has rapidly evolved with plans to broaden its scope. The ultimate goal is for Wizarr to become a versatile, centralized server management tool that can seamlessly interact with various APIs, allowing users to manage, configure, and deploy settings across multiple server environments.

> **⚠️ Warning!**  
> Wizarr originally was located at wizarrrr/wizarr
> however it was stolen, to continue using Wizarr effectivly
> please migrate over to this repository.

## Features

-   Create User Invitations for Plex, Jellyfin & Emby
-   Multi-language support with quick switching
-   Passkey Authentication for admins
-   Advanced configuration options for Invitations
-   Auto-add users to systems like **Ombi**, **Jellyseerr**, and **Overseerr**
-   Discord Intergration
-   Custom On-Boarding Screens for new users
-   Live Log output in Web Panel
-   Session Management to Logout Remote Computers
-   Live Notification System
-   Swagger API Documentation
-   Light/Dark Mode
-   Postgres/Sqlite Supported
-   Supports Unlimited Servers

---

## Getting Started

> **Maintenance**  
> Currently your not able to Download Wizarr and run it without compiling the Docker yourself,
> this can be done using the following instructions, but as of the 13/01/2025 this version is still
> incomplete and not ready for Live Production use.

**JUST FOR TESTERS**

1. Clone the repo to your local computer & then enter the root directory for Wizarr:<br>
   `git clone https://github.com/wizarrrrr/wizarr`<br>
   `cd ./wizarr/`<br>
2. If you would like to run Wizarr in Developer mode please skip this step, otherwise you can build Wizarr's Docker image:<br>
   `docker compose -f docker/docker-compose.dev.yml build`<br>
   `docker compose -f docker/docker-compose.dev.yml up`<br>
   **Your done, you can reach the test version of Wizarr @ http://localhost:5690**<br>

**JUST FOR DEVELOPERS**:<br>

1. Using **Node** Version **22.11.0** & **NPM** Version **10.9.0** install the dependencies required:<br>
   `npm install`<br>
2. Build Wizarr by running the following:<br>
   `npm run build`<br>
3. Install Redis to your computer and begin a Redis-Server instance:<br>
   [https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)<br>
4. Now you are ready to start Wizarr's Frontend & Backend:<br>
    - You can do this together by running:<br>
      `npm run start`<br>
    - or whats better for debugging is to run both Backend & Frontend in two different terminals:<br>
      **Terminal #1:** `npm run start:backend`<br>
      **Terminal #2:** `npm run start:frontend`<br>

## Repository activity

![Activities](https://repobeats.axiom.co/api/embed/07115294f1a67cea2134f778d59a3d335cc0af9d.svg "Repobeats analytics image")

## Star history

<a href="https://star-history.com/#wizarrrrr/wizarr&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=wizarrrrr/wizarr&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=wizarrrrr/wizarr&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=wizarrrrr/wizarr&type=Date" width="100%" />
 </picture>
</a>

## Contributors

<a href="https://github.com/wizarrrrr/wizarr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=wizarrrrr/wizarr" width="100%"/>
</a>
