import Link from "@docusaurus/Link";
import React from "react";

interface CommunityProjectProps {
    title: string;
    description: string;
    url: string;
}

const projects: CommunityProjectProps[] = [
    {
        title: "wizarr-go",
        description: `An alternative to the wizarr-CLI that doesn't depend on nodejs. It specializes in importing Google Photos Takeout archives.`,
        url: "https://github.com/simulot/wizarr-go",
    },
    {
        title: "WizarrFrame",
        description: "Run an Wizarr slideshow in a photo frame.",
        url: "https://github.com/3rob3/WizarrFrame",
    },
    {
        title: "API Album Sync",
        description: "A Python script to sync folders as albums.",
        url: "https://git.orenit.solutions/open/wizarralbumpull",
    },
    {
        title: "Remove offline files",
        description: "A simple way to remove orphaned offline assets from the Wizarr database",
        url: "https://github.com/Thoroslives/wizarr_remove_offline_files",
    },
    {
        title: "Wizarr-Tools",
        description: "Provides scripts for handling problems on the repair page.",
        url: "https://github.com/clumsyCoder00/Wizarr-Tools",
    },
    {
        title: "Lightroom Publisher: mi.Wizarr.Publisher",
        description: "Lightroom plugin to publish photos from Lightroom collections to Wizarr albums.",
        url: "https://github.com/midzelis/mi.Wizarr.Publisher",
    },
    {
        title: "Lightroom Wizarr Plugin: lrc-wizarr-plugin",
        description: "Another Lightroom plugin to publish or export photos from Lightroom to Wizarr.",
        url: "https://github.com/bmachek/lrc-wizarr-plugin",
    },
    {
        title: "Wizarr Duplicate Finder",
        description: "Webapp that uses machine learning to identify near-duplicate images.",
        url: "https://github.com/vale46n1/wizarr_duplicate_finder",
    },
    {
        title: "Wizarr-Tiktok-Remover",
        description: "Script to search for and remove TikTok videos from your Wizarr library.",
        url: "https://github.com/mxc2/wizarr-tiktok-remover",
    },
    {
        title: "Wizarr Android TV",
        description: "Unofficial Wizarr Android TV app.",
        url: "https://github.com/giejay/Wizarr-Android-TV",
    },
    {
        title: "Create albums from folders",
        description: "A Python script to create albums based on the folder structure of an external library.",
        url: "https://github.com/Salvoxia/wizarr-folder-album-creator",
    },
    {
        title: "Powershell Module PSWizarr",
        description: "Powershell Module for the Wizarr API",
        url: "https://github.com/hanpq/PSWizarr",
    },
    {
        title: "Wizarr Distribution",
        description: "Snap package for easy install and zero-care auto updates of Wizarr. Self-hosted photo management.",
        url: "https://wizarr-distribution.nsg.cc",
    },
    {
        title: "Wizarr Kiosk",
        description: "Lightweight slideshow to run on kiosk devices and browsers.",
        url: "https://github.com/damongolding/wizarr-kiosk",
    },
    {
        title: "Wizarr Power Tools",
        description: "Power tools for organizing your wizarr library.",
        url: "https://github.com/varun-raj/wizarr-power-tools",
    },
    {
        title: "Wizarr Public Proxy",
        description: "Share your Wizarr photos and albums in a safe way without exposing your Wizarr instance to the public.",
        url: "https://github.com/alangrainger/wizarr-public-proxy",
    },
    {
        title: "Wizarr Kodi",
        description: "Unofficial Kodi plugin for Wizarr.",
        url: "https://github.com/vladd11/wizarr-kodi",
    },
    {
        title: "Wizarr Downloader",
        description: "Downloads a configurable number of random photos based on people or album ID.",
        url: "https://github.com/jon6fingrs/wizarr-dl",
    },
];

function CommunityProject({ title, description, url }: CommunityProjectProps): JSX.Element {
    return (
        <section className="flex flex-col gap-4 justify-between dark:bg-wizarr-dark-gray bg-wizarr-gray dark:border-0 border-gray-200 border border-solid rounded-2xl px-4 py-6">
            <div className="flex flex-col gap-2">
                <p className="m-0 items-start flex gap-2 text-2xl font-bold text-wizarr-primary dark:text-wizarr-dark-primary">
                    <span>{title}</span>
                </p>

                <p className="m-0 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                <p className="m-0 text-sm text-gray-600 dark:text-gray-300 my-4">
                    <a href={url}>{url}</a>
                </p>
            </div>
            <div className="flex">
                <Link className="px-4 py-2 bg-wizarr-primary/10 dark:bg-gray-300 rounded-xl text-sm hover:no-underline text-wizarr-primary dark:text-wizarr-dark-bg font-semibold" to={url}>
                    View Link
                </Link>
            </div>
        </section>
    );
}

export default function CommunityProjects(): JSX.Element {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {projects.map((project) => (
                <CommunityProject {...project} />
            ))}
        </div>
    );
}
