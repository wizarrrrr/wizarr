import type { NavigationGuardNext } from "vue-router";
import { useInformationStore } from "@/stores/information";

export default async function openServer({ next, authStore }: { next: NavigationGuardNext; authStore: any }) {
    return next();
}
