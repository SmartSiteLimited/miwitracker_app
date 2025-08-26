<template>
    <div id="container" class="max-h-full">
        <Select class="bg-red-300" v-model="selectedProject"
            @update="selectedProject = $event.trim() !== '' ? +$event : null">
            <SelectTrigger aria-label="Select Project">           
            <SelectValue placeholder="Select Project" 
            :class="cn('w-[200px] h-auto p-4', selectedProject ? 'text-black' : 'text-gray-500')" />

            </SelectTrigger>
            <SelectContent class="max-h-[200px]">
                <SelectItem v-for="(option, index) in projects" :key="index" :value="option">{{ option }}
                </SelectItem>
            </SelectContent>
        </Select>
        <Select class="bg-red-300" v-model="Switch"
            @update="Switch = $event.trim() !== '' ? +$event : null">
            <SelectTrigger aria-label="Select Project">           
            <SelectValue placeholder="Select Project" 
            :class="cn('w-[200px] h-auto p-4', Switch ? 'text-black' : 'text-gray-500')" />

            </SelectTrigger>
            <SelectContent class="max-h-[200px]">
                <SelectItem value="1">Switch On</SelectItem>
                <SelectItem value="0">Switch Off</SelectItem>
            </SelectContent>
        </Select>
        <CalenderInput 
        :model-value = "created"
        @update:model-value="created = $event"
        :placeholder="'Select Date'"
        :show-time="true"
        class="w-[30%] h-10"
        :dt-max="new Date()"
        />  
        <div class="flex justify-center items-center ">
            <!-- <select v-model="selectedImei" @change="getProjectsOptions">
                <option value="">Select IMEI</option>
                <option v-for="imei in imeis" :key="imei" :value="imei">{{ imei }}</option>
            </select> -->
            <div class="flex gap-4 flex-wrap mt-4 mb-4">
                <input type="text" v-model="inputImei" placeholder="Enter the Specific Target IMEI" class="p-2 border rounded w-[400px]" />
                <Button class="bg-red-300" @click="fetchDevices">Reload All Devices</Button>
                <Button class="bg-red-300" @click="setSOS">Set SOS</Button>
                <Button class="bg-red-300" @click="setPhoneBook">Set Phone Book</Button>
                <Button class="bg-red-300" @click="checkOnline">Check Online</Button>
                <Button class="bg-red-300" @click="setBlockPhone">Set Block Phone</Button>
                <Button class="bg-red-300" @click="setHealth">Set Health</Button>
                <Button class="bg-red-300" @click="setCallCenter">Set Call Center</Button>
                <Button class="bg-red-300" @click="setAlert">Set Alert</Button>
                <Button class="bg-red-300" @click="locate">Locate</Button>
                <Button class="bg-red-300" @click="reboot">Reboot</Button>
                <Button class="bg-red-300" @click="powerOff">Power Off</Button>
                <Button class="bg-red-300" @click="saveCallNumber" >Save Call Number</Button>
                <Button class="bg-red-300" @click="savePhoneBooksettings">Save Phone Book</Button>
                <Button class="bg-red-300" @click="AddDeviceList">Add Device List</Button>
            </div>
        </div>
        <table class="p-4 border-1 border-solid" v-if="projects.length > 0">
            <thead>
                <tr>
                    <th class="p-2">Project</th>
                    <th class="p-2">IMEI</th>
                    <th class="p-2">Online</th>
                    <th class="p-2">Created Time</th>
                    <th class="p-2">Last updated</th>
                    <th class="p-2">CallCenter Number Settings</th>
                    <th class="p-2">Phone Book Settings</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(imei, index) in imeis" :key="index">
                    <td class="p-4 text-center">{{ selectedProject }}</td>
                    <td class="p-4 text-center">{{ imei.IMEI_id }}</td>
                    <td :class="{ 'text-green-500': isOnline(imei), 'text-red-600': !isOnline(imei) }" class="p-4 text-center">{{
                        isOnline(imei) ? 'Online' : 'Offline' }}</td>
                    <td class="p-4 text-center">{{ imei.created }}</td>
                    <td class="p-4 text-center">{{ imei.updated }}</td>
                    <td class="p-4 text-center"><span v-for="(v, k) in projectSettings.call_center_number" :key="k">
                            <p>{{ v }}</p>
                        </span></td>
                    <td class="p-4 text-center"><span v-for="(v, k) in projectSettings.phone_number" :key="k">
                            <p>{{ v }}</p>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="message">{{ message }}</p>
        <pre v-if="result">{{ result }}</pre>
    </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,

} from '@/ui/select'
import CalenderInput from '@/components/CalendarInput.vue'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'




const message = ref('')
const result = ref('')
const app_endpoint = 'http://localhost:8000'
const projects = ref([])
const projectSettings = ref({})
const imeis = ref([])
const selectedProject = ref('')
const inputImei = ref('')
const Switch = ref("1") //default switch to on
const created = ref('')
//default the created date to tomorrow string
created.value = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const phone_number_list = computed(() => {
    if (!imeis.value || imeis.value.length === 0) return []
    const phoneNumbers = imeis.value.map(imei => imei.phone_number)
    const firstNumberArray = phoneNumbers[0]
    return firstNumberArray ? firstNumberArray : []
})

watch(phone_number_list, (newValue) => {
    phone_number_list.value.forEach(element => {
    console.log('element in the array list :', element)
});
}, { immediate: true })

watch(created, (newValue) => {
    console.log('Created date changed:', newValue)
    getImeisListByProject(newValue).then(() => {
        
    })
}, { immediate: true })


const isOnline = (imei) => {
    if (imei.online_status == 1) {
        return true
    } else {
        return false
    }
}

async function AddDeviceList() {
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (!inputImeiArray || inputImeiArray.length === 0) {
        message.value = 'No IMEI numbers provided.'
        return
    }
    const formData = new FormData()
    formData.append('project', selectedProject.value)
    formData.append('imeis', JSON.stringify(inputImeiArray))

    try {
        const { data } = await axios.post(`${app_endpoint}/add_list`, formData)
        message.value = data.message
        getImeisListByProject(created.value).then(() => {
            fetchSettings()
        })
    } catch (error) {
        console.error('Error adding device list:', error)
        message.value = 'Failed to add device list.'
    }
}

async function saveCallNumber() {

    const callNumber = prompt('Enter the call number to save by separating with commas:')
    if (!confirm('Are you sure you want to save the call number with project ' + selectedProject.value + '?')) {
        return
    }
    //split the call number by comma
    const callNumbersArray = callNumber.split(',').map(num => num.trim())
    

    if (callNumber) {
        const formData = new FormData()
        formData.append('project', selectedProject.value)

        formData.append('callcenter_number', callNumbersArray)
        const { data } = await axios.post(`${app_endpoint}/set_callcenter_number`, formData)
        message.value = data.message
        getImeisListByProject(created.value).then(() => {
            fetchSettings()
        })
        

    }
}

async function savePhoneBooksettings() {

    const phoneBook = prompt('Enter the phone book entries to save by separating with commas:')
    if (!confirm('Are you sure you want to save the phone book with project ' + selectedProject.value + '?')) {
        return
    }
    //split the phone book by comma
    const phoneBookArray = phoneBook.split(',').map(num => num.trim())

    if (phoneBook) {
        const formData = new FormData()
        formData.append('project', selectedProject.value)
        formData.append('phone_number', phoneBookArray)
        const { data } = await axios.post(`${app_endpoint}/set_phone_number`, formData)
        message.value = data.message
        getImeisListByProject(created.value).then(() => {
            fetchSettings()
        })
    }
}

async function getProjectsOptions() {
    const { data } = await axios.get(`${app_endpoint}/get_projects`)
    //convert the data.data promise to an array
    const project_list_array = data.data
    console.log(project_list_array)
    projects.value = project_list_array
}

onMounted(() => {
    getProjectsOptions().then(() => {
        console.log('Projects loaded:', projects.value)
        //
        selectedProject.value = projects.value.length > 0 ? projects.value[0] : null

    })
})

async function getImeisListByProject(createdDate = null) {
    if (!selectedProject.value) return
    const formData = new FormData()
    if (createdDate) {
        formData.append('created', createdDate)
    }
    console.log('Fetching IMEIs for project:', selectedProject.value)
    formData.append('project', selectedProject.value);
    const { data } = await axios.post(`${app_endpoint}/get_imeis_by_project`, formData)
    imeis.value = data.data || []

}

watch(selectedProject, async (newValue) => {
    console.log('Selected project changed:', newValue)
    await getImeisListByProject(created.value).then(() => {
        console.log('IMEIs loaded:', imeis.value)
        fetchSettings()
    })

})

async function fetchDevices() {
    const { data } = await axios.post(`${app_endpoint}/fetch_watches`)
    console.log(data)
    return data.devices
}

async function setSOS() {
    const formData = new FormData()
    if (!selectedProject.value) {
        message.value = 'Please select a project first.'
        return
    }
    if (!projectSettings.value || !projectSettings.value.call_center_number) {
        message.value = 'No call_center settings no. found for this project. Please set call_center first.'
        return
    }
    if (created.value) {
        formData.append('created', created.value)
    }
    const settings = projectSettings.value.call_center_number
    console.log('Settings for SOS:', settings)
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    formData.append('project', selectedProject.value)
    formData.append('settings', settings)
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    const { data } = await axios.post(`${app_endpoint}/set_sos`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function setPhoneBook() {
    const formData = new FormData()
    formData.append('project', selectedProject.value)
    if (!projectSettings.value || !projectSettings.value.phone_number) {
        message.value = 'No phone book settings found for this project. Please set phone book first.'
        return
    }

    if (created.value) {
        formData.append('created', created.value)
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    const settings = projectSettings.value.phone_number
    formData.append('settings' , settings)
    console.log('Settings for Phone Book:', settings)
    const { data } = await axios.post(`${app_endpoint}/set_phone_book`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function checkOnline() {
    const formData = new FormData()
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    formData.append('project', selectedProject.value)
    formData.append('created', created.value)
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray) 
    } 
    console.log('created' , created.value)
    const { data } = await axios.post(`${app_endpoint}/check_online`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function setBlockPhone() {
    const formData = new FormData()
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    formData.append('switch', Switch.value)
    

    const { data } = await axios.post(`${app_endpoint}/set_block_phone`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function setHealth() {
    const formData = new FormData()
    if (!selectedProject.value) {
        message.value = 'Please select a project first.'
        return
    }
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    const { data } = await axios.post(`${app_endpoint}/set_health`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function setCallCenter() {
    const formData = new FormData()
    formData.append('project', selectedProject.value)
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    if (!projectSettings.value || !projectSettings.value.call_center_number) {
        message.value = 'No call_center settings no. found for this project. Please set call_center first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    formData.append('created', created.value)
    formData.append('settings', projectSettings.value.call_center_number)
    const { data } = await axios.post(`${app_endpoint}/set_callcenter`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function setAlert() {
    const formData = new FormData()
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    if (!selectedProject.value) {
        message.value = 'Please select a project first.'
        return
    }
    if(!Switch.value) {
        message.value = 'Please select a switch state first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    formData.append('switch', Switch.value)
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    formData.append('switch', Switch.value)
    const { data } = await axios.post(`${app_endpoint}/set_alert`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function locate() {
    const formData = new FormData()
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    if (inputImeiArray.length > 0) {
        formData.append('imeis', inputImeiArray)
    }
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    
    const { data } = await axios.post(`${app_endpoint}/locate`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function powerOff() {
    if (!selectedProject.value) {
        message.value = 'Please select a project first.'
        return
    }
    const formData = new FormData()
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    formData.append('imeis', inputImeiArray)
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    formData.append('switch', "0")
    const { data } = await axios.post(`${app_endpoint}/power`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}
async function reboot() {
    const formData = new FormData()
    if (!created.value) {
        message.value = 'Please select a date first.'
        return
    }
    const inputImeiArray = inputImei.value ? inputImei.value.split(',').map(num => num.trim()) : []
    formData.append('imeis', inputImeiArray)
    formData.append('created', created.value)
    formData.append('project', selectedProject.value)
    formData.append('switch', "1")
    const { data } = await axios.post(`${app_endpoint}/power`, formData)
    message.value = data.message
    result.value = JSON.stringify(data.data, null, 2)
}

async function fetchSettings() {
    const formData = new FormData()
    formData.append('project', selectedProject.value)
    const { data } = await axios.post(`${app_endpoint}/get_setting_by_project`, formData)
    if (!data || !data.data) {
        console.log('No settings data received')
        projectSettings.value = []
        return
    }
    
    projectSettings.value = data.data
    console.log('Project settings fetched:', projectSettings.value)
}
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

#container {
    min-width: 1200px;
    height: auto;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}


button:hover {
    background-color: #45a049;
}

p,
pre {
    margin: 10px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    word-wrap: break-word;
}

pre {
    overflow-x: auto;
}
</style>
