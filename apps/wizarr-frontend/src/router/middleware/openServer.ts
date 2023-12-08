import type { NavigationGuardNext } from "vue-router";
import { useInformationStore } from "@/stores/information";

export default async function openServer({ next, authStore }: { next: NavigationGuardNext; authStore: any }) {
    try {
        const informationStore = useInformationStore();
        // location.href = informationStore.settings.server_url_override ?? serverStore.settings.server_url;
    } catch {
        console.error("Failed to open server");
    }

    return next();
}
