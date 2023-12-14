import { defineStore } from "pinia";
import type { Invitation as IInvitation, Invitations as IInvitations, InvitationRequest as IInvitationRequest, InvitationResponse as IInvitationResponse } from "@wizarrrr/wizarr-sdk";

export const useInvitationStore = defineStore("invitations", {
    state: (): { invitations: IInvitations } => ({
        invitations: [],
    }),
    actions: {
        async getInvitations() {
            // Get invites from API
            const invitations = await this.$axios.get<IInvitationResponse>("/api/invitations").catch(() => {
                this.$toast.error("Could not get invitations");
                return null;
            });

            // If the response is null, return
            if (invitations === null) return;

            // Add the invites to the store
            this.invitations = invitations.data.rows;
        },
        async createInvitation(invitation: IInvitationRequest) {
            const response = await this.$axios.post<IInvitation>("/api/invitations", invitation).catch(() => {
                this.$toast.error("Could not create invitation");
                return null;
            });

            // If the response is null, return
            if (response === null) return;

            // Add the invite to the store
            this.invitations.push(response.data);
            this.$toast.success("Invitation created");

            return response.data;
        },
        async deleteInvitation(id: string) {
            // Delete the invite from the API
            const response = await this.$axios.delete(`/api/invitations/${id}`, { disableInfoToast: true }).catch((err) => {
                this.$toast.error("Could not delete invitation");
                return null;
            });

            // If the response is null, return
            if (response === null) return;

            // Remove the invite from the store
            const index = this.invitations.findIndex((invitation: IInvitation) => invitation.id === id);
            if (index !== -1) this.invitations.splice(index, 1);
        },
    },
    persist: true,
});
