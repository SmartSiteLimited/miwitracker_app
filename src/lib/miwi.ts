import type { IRequestResponse } from "@/composables/backend"
import { API_ENDPOINT } from "@/config"
import { useAppStore } from "@/stores/app"
export class MiwiBackend {

    public static checkOnlines(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        return MiwiBackend.request<{ [key: string]: boolean }>("/devices/task/check-online", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "imeis": imeis.join(",") }),
        }).then((results) => {
            Object.entries(results).forEach(([imei, online]) => {
                resultMap.set(imei, online)
            })

            return resultMap
        })
    }

    public static async locate(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei => 
            MiwiBackend.request<boolean>("/devices/task/locate/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to locate ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setFallAlert(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        const store = useAppStore()
        const project = store.curProject
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })
        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/setfallalert/" + imei + "/" + project, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
                }).catch((error) => {
                    console.log(`Failed to set fall alert for ${imei}:`, error)
                })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setPhoneBook(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/setphonebook/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to set phone book for ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setBlockPhone(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/setblockphone/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to set block phone for ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setHealth(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/sethealth/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to set health for ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setSOS(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/setsos/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to set SOS for ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async setCallCenter(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/setcallcenter/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to set Call Center for ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async Reboot(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/reboot/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to reboot device ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async PowerOff(imeis: string[]): Promise<Map<string, boolean | null>> {
        const resultMap = new Map<string, boolean | null>()
        imeis.forEach(imei => {
            resultMap.set(imei, null)
        })

        const requests = imeis.map(imei =>
            MiwiBackend.request<boolean>("/devices/task/poweroff/" + imei, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).then((success) => {
                resultMap.set(imei, success)
            }).catch((error) => {
                // Keep null value for failed requests
                console.error(`Failed to power off device ${imei}:`, error)
            })
        )

        await Promise.all(requests)
        return resultMap
    }

    public static async request<T>(uri: string, options?: RequestInit) {
        let url = API_ENDPOINT + uri
        const response = await fetch(url, options)
        const res: IRequestResponse<T> = await response.json()
        if (res.success) {
            return res.data
        } else {
            throw new Error(res.message || "Unknown error")
        }
    }

    public static async runInBatches(fns: Array<() => Promise<void>>, batchSize = 5) {
        for (let i = 0; i < fns.length; i += batchSize) {
            const batch = fns.slice(i, i + batchSize).map(fn => fn())
            await Promise.all(batch)
        }
    }
}
