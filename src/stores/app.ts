import { defineStore } from "pinia";

const THEME_KEY = "themeMode";

export interface IAppStore {
    themeMode: "light" | "dark";
    caches: Record<string, any>;
    curProject: string | null;
}

export const useAppStore = defineStore("app", {
    state: () =>
    ({
        themeMode: "light",
        caches: {},
        curProject: null
    } as IAppStore),
    getters: {
        theme: (state) => state.themeMode,
        isDark: (state) => state.themeMode === "dark",
    },
    actions: {
        initTheme() {
            const cache = localStorage.getItem(THEME_KEY);
            if (cache) {
                this.themeMode = cache as "light" | "dark";
            } else {
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    this.themeMode = "dark";
                }
            }

            this.applyTheme();
        },
        toggleTheme(store = true) {
            this.themeMode = this.themeMode === "light" ? "dark" : "light";
            this.applyTheme();
            if (store) {
                localStorage.setItem(THEME_KEY, this.themeMode);
            }
        },
        changeProject(projectId: string | null) {
            this.curProject = projectId;
        },
        getCache(key: string, defaultValue?: any) {
            return this.caches[key] || defaultValue;
        },
        setCache(key: string, value: any) {
            this.caches[key] = value;
        },
        appUnmount() {
        },
        applyTheme() {
            document.documentElement.classList.remove("light", "dark");
            document.body.classList.remove("light", "dark");
            document.documentElement.classList.add(this.themeMode);
            document.body.classList.add(this.themeMode);
        },
    },
});
