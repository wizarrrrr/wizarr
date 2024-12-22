<template>
    <FormKit type="form" v-model="accountForm" @submit="createAccount" :submit-label="__('Create Account')" :submit-attrs="{ wrapperClass: 'flex justify-end' }">
        <!-- Display Name -->
        <FormKit type="text" :label="__('Display Name')" name="display_name" placeholder="Marvin Brown" validation="alpha_spaces:latin" required autocomplete="name" />

        <!-- Username -->
        <FormKit type="text" :label="__('Username')" name="username" placeholder="marvin" validation="alpha:latin|lowercase" required autocomplete="username" :restrictions="{ alpha_numeric: true }" />

        <!-- Email -->
        <FormKit type="email" :label="__('Email')" name="email" placeholder="marvin@wizarr.org" validation="email" required autocomplete="email" />

        <!-- Password -->
        <FormKit type="password" :label="__('Password')" name="password" placeholder="••••••••" required autocomplete="new-password" />
        <PasswordMeter :password="accountForm.password" class="mb-[23px] mt-1 px-[2px]" v-if="accountForm.password" />

        <!-- Confirm Password -->
        <FormKit type="password" :label="__('Confirm Password')" name="confirm_password" placeholder="••••••••" required autocomplete="new-password" />
    </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DefaultButton from "@/components/Buttons/DefaultButton.vue";
import PasswordMeter from "vue-simple-password-meter";

export default defineComponent({
    name: "AdminAccount",
    components: {
        DefaultButton,
        PasswordMeter,
    },
    data() {
        return {
            accountForm: {
                display_name: "",
                username: "",
                email: "",
                password: "",
                confirm_password: "",
            },
        };
    },
    methods: {
        async createAccount() {
            // If the passwords do not match, display an error
            if (this.accountForm.password !== this.accountForm.confirm_password) {
                this.$toast.error("Passwords do not match");
                return;
            }

            // Create the account object to submit to the API
            const account = {
                name: this.accountForm.display_name,
                username: this.accountForm.username,
                email: this.accountForm.email,
                password: this.accountForm.password,
                roles: ["admin"],
            };

            // Create the account
            const response = await this.$axios.post("/api/auth/register", account).catch((err) => {
                // Display a generic error
                this.$toast.error("Failed to create account");
                return null;
            });

            // Check if we have a response
            if (response?.status !== 200) return;

            // Display a success message
            this.$toast.success("Successfully created admin account");
            this.$emit("nextStep");
        },
    },
});
</script>
