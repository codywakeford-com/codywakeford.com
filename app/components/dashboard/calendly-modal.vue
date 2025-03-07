<template>
    <div class="modal hidden" id="calendlyPopupModal" @click="$Calendly.close" ref="modal">
        <div class="modal-content" @click="$Calendly.close">
            <div id="calendly-embed"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MeetingController from "~~/controllers/MeetingController"

const modal = ref<HTMLElement | null>(null)
const calendly = useCalendly()

const loadCalendlyWidget = async () => {
    await nextTick()
    const parentElement = document.getElementById("calendly-embed")
    if (parentElement) {
        parentElement.innerHTML = ""
        calendly.initInlineWidget({
            url: $Calendly.state.rescheduleUrl || $Calendly.state.url,
            parentElement,
        })
    }
}

onMounted(() => {
    window.addEventListener("message", (event) => {
        if (event.data?.event === "calendly.event_scheduled") {
            MeetingController.onMeetingScheduled(event.data)
        }
    })
    loadCalendlyWidget()
})

// Watch for changes in URL and reload the widget
watchEffect(() => {
    if ($Calendly.state.rescheduleUrl || $Calendly.state.url) {
        loadCalendlyWidget()
    }
})
</script>

<style scoped lang="scss">
.modal {
    position: fixed;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    height: 100vh;
    min-width: 100vw;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        opacity 0.25s,
        transform 0.15s;

    transform: scale(1);

    iframe,
    #calendly-embed {
        position: relative;
        height: 800px;
        width: 1000px;
        max-width: 95vw;
        overflow: hidden;
        mix-blend-mode: multiply;
        z-index: 100;
    }

    &.hidden {
        z-index: -100000 !important;
        pointer-events: none;
        transform: scale(0.9);
        opacity: 0;
    }
}
</style>
