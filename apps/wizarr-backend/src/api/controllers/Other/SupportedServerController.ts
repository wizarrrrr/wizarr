import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { ControllerBase } from "../BaseController";
import { OpenAPI } from "routing-controllers-openapi";

import type { SupportedServers as ISupportedServers } from "@wizarrrr/wizarr-sdk";

@Service()
@JsonController()
export class SupportedServerController extends ControllerBase {
    /**
     * @api {get} /supported-servers Supported Media Servers
     * @apiName Supported Media Servers
     * @apiDescription Get all supported media servers
     */
    @Get("/supported-servers")
    @OpenAPI({ tags: ["Media Servers"] })
    public async supportedServers(): Promise<ISupportedServers> {
        return [
            {
                name: "Jellyfin",
                slug: "jellyfin",
                description: "Jellyfin is the volunteer-built media solution that puts you in control of your media. Stream to any device from your own server, with no strings attached. Your media, your server, your way.",
                logo: "https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/e2/fb/ab/e2fbab54-b05d-b7c2-fe40-c1d19c591695/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/60x60bb.jpg",
                website: "https://jellyfin.org/",
                docs: "https://jellyfin.org/docs/",
                api: "https://jellyfin.org/docs/general/server/api.html",
                repository: "https://github.com/jellyfin/jellyfin",
            },
            {
                name: "Emby",
                slug: "emby",
                description: "Emby, formerly Media Browser, is a media aggregator plugin for Media Center that takes your recorded, digital, or ripped media and presents it in a simple, easy to use interface.",
                logo: "https://emby.media/wp-content/uploads/2018/10/emby-horizontal-color.svg",
                website: "https://emby.media/",
                docs: "https://emby.media/community/index.php?/forum/116-api/",
            },
            {
                name: "Plex",
                slug: "plex",
                description: "Plex is a client-server media player system and software suite comprising two main components. The Plex Media Server desktop application runs on Windows, macOS, and Linux. The server desktop application organizes video, audio, and photos from a user's collections and from online services, enabling the players to access and stream the contents.",
                logo: "https://plex.tv/desktop/logo.svg",
                website: "https://plex.tv/",
                docs: "https://plex.tv/api-docs/index.html",
                api: "https://plex.tv/api-docs/index.html",
            },
        ];
    }
}
