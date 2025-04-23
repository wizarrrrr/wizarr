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
> however it was stolen, to continue using Wizarr effectivly in the future
> please migrate over to this repository.

## Features

-   **Multi-Server Management**:

    -   Manage multiple servers from a single interface
    -   Add, remove, and configure servers easily

-   **Invitations**:

    -   Create and manage user invitations for Plex, Jellyfin, and Emby
    -   Customize invitation settings and templates

-   **Multiple Languages**:

    -   Wizarr supports multiple languages, making it accessible to a global audience

-   **Live Notifications**:

    -   Receive real-time notifications for server events and updates
    -   Stay informed about server status and user activity

-   **Swagger API**:

    -   Access a powerful API for developers to integrate Wizarr with other applications

-   **Dark Mode**:

    -   Enjoy a sleek dark mode interface for comfortable usage in low-light environments

-   **PostgreSQL Database**:
    -   Wizarr uses PostgreSQL for efficient data storage and management
    -   Support for SQLite too, but not recommended for production use

---

## Getting Started

> **ALPHA STAGE**  
> Wizarr is currently in the alpha stage of development. While it is functional, many features are still in the works or missing.
> We are actively working on improving the software and appreciate your feedback. Please report any bugs or issues you encounter.

**JUST FOR TESTERS**

You can follow the instructions on our [Website](https://wizarr.org/docs/install/docker-compose) to get Wizarr up and running in no time.
<br>

**JUST FOR DEVELOPERS**:<br>

**Note:** Make sure that you have Docker installed on your system. You can find the installation instructions for Docker on the [official Docker website](https://docs.docker.com/get-docker/).

1. Clone the repository:

    ```bash
    git clone https://github.com/wizarrrrr/wizarr.git
    ```

2. Change to the project directory:

    ```bash
    cd wizarr
    ```

3. You can now start Wizarr in development mode using Docker Compose:

    ```bash
    docker compose -f ./docker/docker-compose.dev.yml up
    ```

4. Open your web browser and navigate to `http://localhost:5690` to access the Wizarr web interface.

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
