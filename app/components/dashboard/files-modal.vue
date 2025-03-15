<template>
    <dialog id="files-modal" ref="modal" @click="handleClose()">
        <section class="modal-body" @click.stop.prevent>
            <header>
                <h3>Upload a file</h3>
                <form-kit
                    v-if="options.length > 1 || projectId"
                    type="select"
                    validation="required"
                    v-model="selectedProjectId"
                    :options="options"
                    help="Select a project"
                ></form-kit>
            </header>

            <div class="modal-content">
                <div class="upload-box" v-if="!filesInput.length">
                    <Icon name="ic:outline-upload-file" size="50" style="color: grey" />
                    <h3>
                        Drag and Drop or
                        <span @click.stop="triggerFileInput()">Click to upload</span>
                    </h3>
                    <p>Supports all formats | Max Size: 100Mb</p>
                </div>

                <div v-else class="upload-box">
                    <Icon name="ic:outline-upload-file" size="50" style="color: grey" />
                    <div>{{ filesInput.length }} {{ filesInput.length > 1 ? "items" : "item" }} selected</div>
                    <button-primary-m @click="filesInput = []">Remove</button-primary-m>
                </div>

                <div class="controls">
                    <button-primary-m class="cancel-button" @click="modal?.close()">Cancel</button-primary-m>
                    <button-primary-m @click="uploadFiles()" :loading="loading">
                        {{ loading ? "loading" : "upload" }}
                    </button-primary-m>
                </div>
            </div>
        </section>
        <input type="file" ref="fileInputRef" hidden multiple @change="handleInput" />
        {{ isFileInputOpen }}
    </dialog>
</template>

<script setup lang="ts">
import FilesController from "~~/controllers/FilesController"
const route = useRoute()
const projectId = route.params.id as string
const $Projects = useProjectStore()
const modal = ref<HTMLDialogElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
let isFileInputOpen = ref(false)
const options = computed(() => {
    return $Projects.state.projects.map((p) => {
        return p.id
    })
})
const selectedProjectId = ref(projectId || options.value[0])

function handleClose() {
    if (!modal.value) return
    setTimeout(() => {
        console.log("Hllo")
        if (isFileInputOpen.value) return

        console.log("Hello")
        modal.value?.close()
    }, 1)
}

const filesInput = ref<File[]>([])

function handleInput(event: Event) {
    isFileInputOpen.value = false
    const target = event.target as HTMLInputElement | null
    if (!target || !target.files || target.files.length === 0) return

    filesInput.value = []

    Array.from(target.files).forEach((f) => {
        if (f.size > 100 * 1024 * 1024) {
            return
        }

        filesInput.value.push(f)
    })
}

function triggerFileInput() {
    if (!fileInputRef.value) {
        console.log("File input not found")
        return
    }

    isFileInputOpen.value = true
    fileInputRef.value.click()
}
const loading = ref(false)
async function uploadFiles() {
    try {
        loading.value = true
        if (!selectedProjectId.value) throw new Error("no project id")
        await FilesController.addFilesToProject(selectedProjectId.value, $User.state.user.email, filesInput.value)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (!modal.value || !fileInputRef.value) return

    modal.value.addEventListener("drop", (e) => {
        e.preventDefault()
        console.log("detected item")
    })
})
</script>

<style lang="scss" scoped>
@use "~/style/modal.scss" as *;

header {
    display: flex;
    justify-content: space-between;
    background: var(--secondary);
    padding-inline: 25px;
    padding-block: 25px;
}

.modal-body {
    display: flex;
    flex-direction: column;
    min-width: 500px;
    min-height: 300px;

    background: var(--background);
    border-radius: $border-radius;

    .upload-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;

        outline: 2px dashed var(--text3);
        height: 250px;
        border-radius: 25px;

        h3 {
            margin-top: 15px;
            font-size: 1.1rem;

            span {
                font-size: 1rem;
                color: blue;
                cursor: pointer;
                text-decoration: underline;
            }
        }

        p {
            font-size: 0.9rem;
            color: var(--text6);
        }
    }
}

.modal-content {
    padding-block: 50px 25px;
    padding-inline: 25px;
}

.controls {
    display: flex;
    justify-content: flex-end;
    padding-block: 25px 0px;
    gap: 10px;
    margin-left: auto;
}

.cancel-button {
    border: 1px solid var(--primary);
    background-color: white;
    color: var(--text5);
}
</style>
