
export type Device = {
    id: number
    project: string
    imei: string
    iccid: string | null
    firmware_version: string | null
    miwi_group_id: number | null
    phone_number: string | null
    created: string
    updated: string | null
}

export type MiwiGroup = {
    GroupId: number
    OrgId: number
    GroupName: string
    Description: string
    ParentId: number
    Created: string
    Deleted: boolean
    Icon: string
}