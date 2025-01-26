<template>
    <section class="phases">
        <div
            class="phase-box"
            v-for="(phase, index) in phases"
            :key="index"
            :class="{ complete: phaseIndex > index, active: phaseIndex === index, incomplete: phaseIndex < index }"
        >
            <div class="left">
                <div class="number">{{ index + 1 }}</div>
                <div class="name">{{ phase.name }}</div>
            </div>

            <div class="right">
                <div class="short-description">{{ phase?.shortDescription }}</div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Phase {
    name: string
    shortDescription: string
    description: string
    phaseName: ProjectPhase
}

interface Props {
    project: Project | undefined
}

const props = defineProps<Props>()

const phaseIndex = computed(() => {
    return phases.findIndex((phase) => phase.phaseName === props.project?.phase) || 0
})
const phases: Phase[] = [
    {
        name: "Discovery",
        phaseName: "discovery",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
    {
        name: "Design",
        phaseName: "design",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
    {
        name: "Development",
        phaseName: "development",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
    {
        name: "Final Approval",
        phaseName: "final-approval",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
    {
        name: "Testing",
        phaseName: "testing",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
    {
        name: "Launch",
        phaseName: "launch",
        shortDescription: "This is where we work together to define the project goals.",
        description: "This is where we work together to define the project goals.",
    },
]
</script>

<style lang="scss" scoped>
.phases {
    display: flex;
    flex-direction: column;
    gap: 50px;
    padding-inline: 25px;
    overflow-y: auto;
    overflow-x: visible;
}

.phase-box {
    display: flex;
    gap: 20px;
    align-items: center;
    background: $text-light1;
    padding: 15px 15px;
    margin-inline: 10px;
    border-radius: 10px;
    position: relative;

    &:nth-child(odd) {
        &::before {
            content: "";
            position: absolute;
            height: 190px;
            width: 15px;
            left: -18px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            top: 50%;
            z-index: 100;
        }

        &::after {
            content: "";
            position: absolute;
            background: white;
            height: 184px;
            width: 12px;
            left: -15px;
            border-top-left-radius: 7px;
            border-bottom-left-radius: 7px;
            top: calc(50% + 3px);
            z-index: 100;
        }
    }

    &:nth-child(even) {
        &::before {
            content: "";
            position: absolute;
            height: 190px;
            width: 15px;
            right: -18px;
            top: 50%;
            z-index: 100;

            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        &::after {
            content: "";
            position: absolute;
            background: white;
            height: 184px;
            width: 12px;
            right: -15px;
            top: calc(50% + 3px);
            z-index: 100;

            border-top-right-radius: 7px;
            border-bottom-right-radius: 7px;
        }
    }

    &:last-child {
        &::before {
            content: none; /* Remove content */
        }

        &::after {
            content: none; /* Remove content */
        }
    }
    &.complete {
        border: 3px solid $primary;
        .number {
            background: $primary;
            color: $text-light1;
        }

        .name {
            color: $primary;
        }

        &::before {
            background: $primary;
        }
    }

    &.active {
        border: 3px solid $primary;

        .number {
            border: 3px solid $primary;
            color: $primary;
        }

        &::before {
            background: $text-light3;
        }

        .name {
            color: $primary;
        }
    }

    &.incomplete {
        .number {
            color: $text-light3;
            border: 3px solid $text-light3;
        }

        &::before {
            background: $text-light3;
        }

        .name {
            color: $text-light3;
        }
    }
    .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        .number {
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 1.25rem;
            line-height: 0;
            font-weight: bold;
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .name {
            text-align: center;
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
        }
    }

    .right {
        font-size: 0.9rem;
    }
}
</style>
