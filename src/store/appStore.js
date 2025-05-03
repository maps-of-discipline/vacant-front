import { defineStore } from "pinia";


export const useAppStore = defineStore("app", {
    state: () => ({
        isDarkMode: localStorage.getItem("isDarkMode") === "true" || false,
    }),

    actions: {
        setDarkMode(value) {
            this.isDarkMode = value;
            localStorage.setItem("isDarkMode", value)
        },
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode
            localStorage.setItem("isDarkMode", this.isDarkMode)
        },

        init() {
            document.documentElement.classList.toggle("my-app-dark", this.isDarkMode);

            this.$subscribe((mutation, state) => {
                document.documentElement.classList.toggle("my-app-dark", state.isDarkMode);
            });
        }
    },
});
