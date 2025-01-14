<template>
    <div class="flex flex-col items-center space-y-4">
        <!-- Share Data -->
        <div class="flex flex-col items-center space-y-2">
            <div class="group relative rounded-md w-[156px] h-[156px] overflow-hidden cursor-pointer" @click="downloadQRCode">
                <img class="absolute" :src="qrcode" alt="Share QRcode" />
                <span class="group-hover:bg-black opacity-[65%] absolute w-full h-full"></span>
                <i class="group-hover:block hidden fa-solid fa-download text-white absolute bottom-0 right-0 m-2"></i>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded p-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer" @click="copyToClipboard">
                <span>{{ invitationLink }}</span>
            </div>
        </div>

        <!-- Share Message -->
        <div class="flex flex-col items-center space-y-1 w-2/3 text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ __("Share this link with your friends and family to invite them to join your media server.") }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useClipboard } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode.mjs";

import type { InvitationData } from "../InvitationForm.vue";

export default defineComponent({
    name: "InvitationComplete",
    components: {},
    props: {
        invitationData: {
            type: Object as () => InvitationData,
            required: true,
        },
    },
    data() {
        return {
            invitationLink: `${window.location.origin}/j/${this.invitationData.inviteCode}`,
            clipboard: useClipboard({
                legacy: true,
            }),
            qrcode: useQRCode(`${window.location.origin}/j/${this.invitationData.inviteCode}`, {
                type: "image/png",
                errorCorrectionLevel: "H",
                margin: 3,
                color: {
                    dark: "#000000ff",
                    light: "#ffffffff",
                },
            }),
        };
    },
    methods: {
        downloadQRCode() {
            const link = document.createElement("a");
            link.download = `qrcode-${this.invitationData.inviteCode}.png`;
            link.href = this.qrcode;
            link.click();
        },
        copyToClipboard() {
            if (this.clipboard.isSupported) {
                this.clipboard.copy(this.invitationLink);
                this.$toast.info(this.__("Copied to clipboard"));
            } else {
                this.$toast.error(this.__("Your browser does not support copying to clipboard"));
            }
        },
    },
});
</script>
