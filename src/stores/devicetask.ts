import { MiwiBackend } from "@/lib/miwi";
import { runSequentially } from "@/lib/utils";
import { defineStore } from "pinia";

export interface IDeviceTaskStore {
    running: boolean
    taskName: string
    imeis: Set<string>
    status: Map<string, 'pending' | 'running' | 'failed' | 'done'>
    result: Map<string, boolean | null>
}

export const useDeviceTaskStore = (id: string) =>
    defineStore("deviceTask-" + id, {
        state: () =>
        ({
            running: false,
            taskName: '',
            imeis: new Set(),
            status: new Map(),
            result: new Map(),
        } as IDeviceTaskStore),
        getters: {
            successImeis: (state) => {
                return Array.from(state.imeis).filter(imei => {
                    return state.result.get(imei) === true
                })
            },
            failImeis: (state) => {
                return Array.from(state.imeis).filter(imei => {
                    return state.result.get(imei) === false
                })
            },
        },
        actions: {
            reset() {
                this.running = false
                this.taskName = ''
                this.imeis.clear()
                this.status.clear()
                this.result.clear()
            },
            async startTask(taskName: string, imeis: string[], batchSize = 5) {
                this.reset()

                this.running = true
                this.taskName = taskName
                this.imeis = new Set(imeis)

                imeis.forEach(imei => {
                    this.status.set(imei, 'pending')
                    this.result.set(imei, null)
                })

                let taskFns: Array<() => Promise<void>> = []
                try {
                    if (taskName === 'check_online') {
                        taskFns = await this.chunkTasks(MiwiBackend.checkOnlines, imeis, imeis.length)
                    }
                    if (taskName === 'locate') {
                        taskFns = await this.chunkTasks(MiwiBackend.locate, imeis, batchSize)
                    }
                    if (taskName ==='set_phonebook') {
                        taskFns = await this.chunkTasks(MiwiBackend.setPhoneBook , imeis , batchSize)
                    }
                    if (taskName ==='set_blockphone') {
                        taskFns = await this.chunkTasks(MiwiBackend.setBlockPhone , imeis , batchSize)
                    }
                    if (taskName ==='set_sos') {
                        taskFns = await this.chunkTasks(MiwiBackend.setSOS , imeis , batchSize)
                    }
                    if (taskName ==='set_health') {
                        taskFns = await this.chunkTasks(MiwiBackend.setHealth , imeis , batchSize)
                    }
                    if (taskName ==='set_callcenter') {
                        taskFns = await this.chunkTasks(MiwiBackend.setCallCenter , imeis , batchSize)
                    }
                    if (taskName ==='reboot') {
                        taskFns = await this.chunkTasks(MiwiBackend.Reboot , imeis , batchSize)
                    }
                    if (taskName ==='power_off') {
                        taskFns = await this.chunkTasks(MiwiBackend.PowerOff , imeis , batchSize)
                    }
                    if (taskName ==='set_fallalert') {
                        taskFns = await this.chunkTasks(MiwiBackend.setFallAlert , imeis , batchSize)
                    }
                    await runSequentially(taskFns)

                } catch (error) {
                    console.error("Error executing task:", error)
                } finally {
                    this.running = false
                }
            },
            async chunkTasks(taskFunc: (imeis: string[]) => Promise<Map<string, boolean | null>>, imeis: string[], batchSize = 5) {
                const promises: Array<() => Promise<void>> = []

                for (let i = 0; i < imeis.length; i += batchSize) {
                    const batchImeis = imeis.slice(i, i + batchSize)
                    
                    promises.push(async () => {
                        batchImeis.forEach(imei => {
                            this.status.set(imei, 'running')
                        })

                        try {
                            const results = await taskFunc(batchImeis)
                            results.forEach((result, imei) => {
                                this.status.set(imei, 'done')
                                this.result.set(imei, result)
                            })
                        } catch (error) {
                            console.error(error)
                            batchImeis.forEach(imei => {
                                this.status.set(imei, 'failed')
                                this.result.set(imei, false)
                            })
                        }
                    })
                }

                return promises
            }
        },
    })();
