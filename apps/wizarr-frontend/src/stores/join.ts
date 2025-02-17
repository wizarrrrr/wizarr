import { defineStore } from "pinia";
import type { Invitation as IInvitation } from "@wizarrrrr/wizarr-sdk";

interface JoinStoreState {
    invitationData: IInvitation | null;
}

export const useJoinStore = defineStore("join", {
    state: (): JoinStoreState => ({
        invitationData: null,
    }),
    actions: {
        async validateInvitation(token: string) {
            // Make Validation request to /api/invitations/:token/validate
            const invitationData = await this.$axios
                .get<IInvitation>(`/api/invitations/${token}/validate`, {
                    params: {
                        relations: "server",
                    },
                })
                .catch((err) => {
                    this.$toast.error("Could not validate invitation");
                    return null;
                });

            // If the invitationData is null, return
            if (invitationData === null) return;

            // Set the invitationData
            this.invitationData = invitationData.data;

            // Return the invitationData
            return invitationData.data;
        },
    },
    getters: {
        serverType(state) {
            return state.invitationData?.server.type;
        },
    },
});
