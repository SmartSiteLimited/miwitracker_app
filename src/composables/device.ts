
export type Device = {
    id: number
    project: string
    miwi_group_id: string | null
    firmware_version: string | null
    imei: string
    iccid: string | null
    phone_number: string | null
    created: string
    updated: string
}