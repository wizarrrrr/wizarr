<template>
    <FormKit type="form" @submit="passwordLogin" :actions="false">
        <div class="space-y-4">
            <div class="flex justify-center flex-col space-y-4">
                <h1 class="text-gray-900 dark:text-white text-2xl font-semibold">Login with your account</h1>
            </div>

            <FormKit type="text" v-model="username" label="Username" name="username" placeholder="Username" required autocomplete="username webauthn" autofocus />
            <FormKit type="password" v-model="password" label="Password" name="password" placeholder="Password" required autocomplete="current-password" />

            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <FormKit type="submit" :classes="{ outer: 'w-full', input: 'text-xs w-full justify-center !font-bold' }">
                    {{ __("Login with Password") }}
                </FormKit>
                <FormKit v-if="passkeySupported" type="button" data-theme="secondary" :classes="{ outer: 'w-full', input: 'text-xs w-full justify-center' }" prefix-icon="fa-user-lock" @click="passkeyLogin">
                    {{ __("Login with Passkey") }}
                </FormKit>
            </div>
        </div>
    </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "PasswordForm",
    props: {
        passkeySupported: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        passwordLogin() {
            this.$emit("passwordLogin", {
                username: this.username,
                password: this.password,
            });
        },
        passkeyLogin() {
            if (!this.username) {
                this.$toast.warning("Please enter your username");
                return;
            }

            this.$emit("passkeyLogin", {
                username: this.username,
            });
        },
    },
});
</script>
