---
sidebar_position: 80
---

# TrueNAS SCALE [Community]

:::note
This is a community contribution and not officially supported by the Wizarr team, but included here for convenience.

Community support can be found in the dedicated channel on the [Discord Server](https://discord.immich.app/).

**Please report app issues to the corresponding [Github Repository](https://github.com/truenas/charts/tree/master/community/immich).**
:::

Wizarr can easily be installed on TrueNAS SCALE via the **Community** train application.
Consider reviewing the TrueNAS [Apps tutorial](https://www.truenas.com/docs/scale/scaletutorials/apps/) if you have not previously configured applications on your system.

TrueNAS SCALE makes installing and updating Wizarr easy, but you must use the Wizarr web portal and mobile app to configure accounts and access libraries.

## First Steps

The Wizarr app in TrueNAS SCALE installs, completes the initial configuration, then starts the Wizarr web portal.
When updates become available, SCALE alerts and provides easy updates.

Before installing the Wizarr app in SCALE, review the [Environment Variables](#environment-variables) documentation to see if you want to configure any during installation.
You may also configure environment variables at any time after deploying the application.

### Setting up Storage Datasets

Before beginning app installation, [create the datasets](https://www.truenas.com/docs/scale/scaletutorials/storage/datasets/datasetsscale/) to use in the **Storage Configuration** section during installation.
Wizarr requires seven datasets: `library`, `upload`, `thumbs`, `profile`, `video`, `backups`, and `pgData`.
You can organize these as one parent with seven child datasets, for example `/mnt/tank/immich/library`, `/mnt/tank/immich/upload`, and so on.

:::info Permissions
The **pgData** dataset must be owned by the user `netdata` (UID 999) for postgres to start. The other datasets must be owned by the user `root` (UID 0) or a group that includes the user `root` (UID 0) for immich to have the necessary permissions.

If the **library** dataset uses ACL it must have [ACL mode](https://www.truenas.com/docs/core/coretutorials/storage/pools/permissions/#access-control-lists) set to `Passthrough` if you plan on using a [storage template](/docs/administration/storage-template.mdx) and the dataset is configured for network sharing (its ACL type is set to `SMB/NFSv4`). When the template is applied and files need to be moved from **upload** to **library**, immich performs `chmod` internally and needs to be allowed to execute the command. [More info.](https://github.com/wizarrrrr/wizarr/pull/13017)
:::

## Installing the Wizarr Application

To install the **Wizarr** application, go to **Apps**, click **Discover Apps**, either begin typing Wizarr into the search field or scroll down to locate the **Wizarr** application widget.

<img
src={require('./img/truenas01.webp').default}
width="50%"
alt="Wizarr App Widget"
className="border rounded-xl"
/>

Click on the widget to open the **Wizarr** application details screen.

<br/><br/>

<img
src={require('./img/truenas02.webp').default}
width="100%"
alt="Wizarr App Details Screen"
className="border rounded-xl"
/>

Click **Install** to open the Wizarr application configuration screen.

<br/><br/>

Application configuration settings are presented in several sections, each explained below.
To find specific fields click in the **Search Input Fields** search field, scroll down to a particular section or click on the section heading on the navigation area in the upper-right corner.

### Application Name and Version

<img
src={require('./img/truenas03.webp').default}
width="100%"
alt="Install Wizarr Screen"
className="border rounded-xl"
/>

Accept the default value or enter a name in **Application Name** field.
In most cases use the default name, but if adding a second deployment of the application you must change this name.

Accept the default version number in **Version**.
When a new version becomes available, the application has an update badge.
The **Installed Applications** screen shows the option to update applications.

### Wizarr Configuration

<img
src={require('./img/truenas05.webp').default}
width="40%"
alt="Configuration Settings"
className="border rounded-xl"
/>

Accept the default value in **Timezone** or change to match your local timezone.
**Timezone** is only used by the Wizarr `exiftool` microservice if it cannot be determined from the image metadata.

Untick **Enable Machine Learning** if you will not use face recognition, image search, and smart duplicate detection.

Accept the default option or select the **Machine Learning Image Type** for your hardware based on the [Hardware-Accelerated Machine Learning Supported Backends](/docs/features/ml-hardware-acceleration.md#supported-backends).

Wizarr's default is `postgres` but you should consider setting the **Database Password** to a custom value using only the characters `A-Za-z0-9`.

The **Redis Password** should be set to a custom value using only the characters `A-Za-z0-9`.

Accept the **Log Level** default of **Log**.

Leave **Hugging Face Endpoint** blank. (This is for downloading ML models from a different source.)

Leave **Additional Environment Variables** blank or see [Environment Variables](#environment-variables) to set before installing.

### Network Configuration

<img
src={require('./img/truenas06.webp').default}
width="40%"
alt="Networking Settings"
className="border rounded-xl"
/>

Accept the default port `30041` in **WebUI Port** or enter a custom port number.
:::info Allowed Port Numbers
Only numbers within the range 9000-65535 may be used on SCALE versions below TrueNAS Scale 24.10 Electric Eel.

Regardless of version, to avoid port conflicts, don't use [ports on this list](https://www.truenas.com/docs/references/defaultports/).
:::

### Storage Configuration

Wizarr requires seven storage datasets.

<img
src={require('./img/truenas07.webp').default}
width="20%"
alt="Configure Storage ixVolumes"
className="border rounded-xl"
/>

:::note Default Setting (Not recommended)
The default setting for datasets is **ixVolume (dataset created automatically by the system)** but this results in your data being harder to access manually and can result in data loss if you delete the immich app. (Not recommended)
:::

For each Storage option select **Host Path (Path that already exists on the system)** and then select the matching dataset [created before installing the app](#setting-up-storage-datasets): **Wizarr Library Storage**: `library`, **Wizarr Uploads Storage**: `upload`, **Wizarr Thumbs Storage**: `thumbs`, **Wizarr Profile Storage**: `profile`, **Wizarr Video Storage**: `video`, **Wizarr Backups Storage**: `backups`, **Postgres Data Storage**: `pgData`.

<img
src={require('./img/truenas08.webp').default}
width="40%"
alt="Configure Storage Host Paths"
className="border rounded-xl"
/>
The image above has example values.

<br/>

### Additional Storage [(External Libraries)](/docs/features/libraries)

<img
src={require('./img/truenas10.webp').default}
width="40%"
alt="Configure Storage Host Paths"
className="border rounded-xl"
/>

You may configure [External Libraries](/docs/features/libraries) by mounting them using **Additional Storage**.
The **Mount Path** is the loaction you will need to copy and paste into the External Library settings within Wizarr.
The **Host Path** is the location on the TrueNAS SCALE server where your external library is located.

<!-- A section for Labels would go here but I don't know what they do. -->

### Resources Configuration

<img
src={require('./img/truenas09.webp').default}
width="40%"
alt="Resource Limits"
className="border rounded-xl"
/>

Accept the default **CPU** limit of `2` threads or specify the number of threads (CPUs with Multi-/Hyper-threading have 2 threads per core).

Accept the default **Memory** limit of `4096` MB or specify the number of MB of RAM. If you're using Machine Learning you should probably set this above 8000 MB.

:::info Older SCALE Versions
Before TrueNAS SCALE version 24.10 Electric Eel:

The **CPU** value was specified in a different format with a default of `4000m` which is 4 threads.

The **Memory** value was specified in a different format with a default of `8Gi` which is 8 GiB of RAM. The value was specified in bytes or a number with a measurement suffix. Examples: `129M`, `123Mi`, `1000000000`
:::

Enable **GPU Configuration** options if you have a GPU that you will use for [Hardware Transcoding](/docs/features/hardware-transcoding) and/or [Hardware-Accelerated Machine Learning](/docs/features/ml-hardware-acceleration.md). More info: [GPU Passtrough Docs for TrueNAS Apps](https://www.truenas.com/docs/truenasapps/#gpu-passthrough)

### Install

Finally, click **Install**.
The system opens the **Installed Applications** screen with the Wizarr app in the **Deploying** state.
When the installation completes it changes to **Running**.

<img
src={require('./img/truenas04.webp').default}
width="100%"
alt="Wizarr Installed"
className="border rounded-xl"
/>

Click **Web Portal** on the **Application Info** widget to open the Wizarr web interface to set up your account and begin uploading photos.

:::tip
For more information on how to use the application once installed, please refer to the [Post Install](/docs/install/post-install.mdx) guide.
:::

## Edit App Settings

- Go to the **Installed Applications** screen and select Wizarr from the list of installed applications.
- Click **Edit** on the **Application Info** widget to open the **Edit Wizarr** screen.
- Change any settings you would like to change.
  - The settings on the edit screen are the same as on the install screen.
- Click **Update** at the very bottom of the page to save changes.
  - TrueNAS automatically updates, recreates, and redeploys the Wizarr container with the updated settings.

## Environment Variables

You can set [Environment Variables](/docs/install/environment-variables) by clicking **Add** on the **Additional Environment Variables** option and filling in the **Name** and **Value**.

<img
src={require('./img/truenas11.webp').default}
width="40%"
alt="Environment Variables"
className="border rounded-xl"
/>

:::info
Some Environment Variables are not available for the TrueNAS SCALE app. This is mainly because they can be configured through GUI options in the [Edit Wizarr screen](#edit-app-settings).

Some examples are: `WIZARR_VERSION`, `UPLOAD_LOCATION`, `DB_DATA_LOCATION`, `TZ`, `WIZARR_LOG_LEVEL`, `DB_PASSWORD`, `REDIS_PASSWORD`.
:::

## Updating the App

When updates become available, SCALE alerts and provides easy updates.
To update the app to the latest version:

- Go to the **Installed Applications** screen and select Wizarr from the list of installed applications.
- Click **Update** on the **Application Info** widget from the **Installed Applications** screen.
- This opens an update window with some options
  - You may select an Image update too.
  - You may view the Changelog.
- Click **Upgrade** to begin the process and open a counter dialog that shows the upgrade progress.
  - When complete, the update badge and buttons disappear and the application Update state on the Installed screen changes from Update Available to Up to date.
