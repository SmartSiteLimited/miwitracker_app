import type { IRequestResponse } from "@/composables/backend"
import { API_ENDPOINT } from "@/config"
import { ref } from "process"

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
