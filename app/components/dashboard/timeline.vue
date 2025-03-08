<template>
    <section>
        <div
            class="phase-box"
            v-for="(phase, index) in phases"
            :key="index"
            :class="{
                complete: phaseIndex > index || phases[phaseIndex].phaseName === 'live',
                active: phaseIndex === index && phases[phaseIndex].phaseName !== 'live',
                incomplete: phaseIndex < index,
            }"
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
    project: Project
}

const props = defineProps<Props>()

const phases: Phase[] = [
    {
        name: "Discovery",
        phaseName: "discovery",
        shortDescription: "In this phase, we define the project scope, goals, and requirements.",
        description:
            "The Discovery phase is where we work closely with the client to gather detailed requirements, understand their goals, and define the project’s scope. We aim to establish a clear direction for the project and ensure alignment between all stakeholders.",
    },
    {
        name: "Design",
        phaseName: "design",
        shortDescription: "We create design concepts and prototypes based on the defined project goals and requirements.",
        description:
            "During the Design phase, we translate the project requirements into visual concepts. This includes creating wireframes, mockups, and prototypes, which will help the client visualize the final product. We work iteratively with the client to refine the design before moving to development.",
    },
    {
        name: "Development",
        phaseName: "development",
        shortDescription: "This phase involves the actual creation of the product, including coding and technical setup.",
        description:
            "The Development phase is where the design is turned into a fully functional product. Our team works on coding, setting up the necessary infrastructure, and integrating any required third-party services. This is the longest phase and involves frequent collaboration with the client to ensure the product meets their expectations.",
    },
    {
        name: "Testing",
        phaseName: "testing",
        shortDescription: "We rigorously test the product to ensure it meets quality standards and is ready for launch.",
        description:
            "The Testing phase involves thorough quality assurance (QA) to identify and fix any bugs or issues in the product. We conduct functional testing, usability testing, and performance testing to ensure that the product is stable and works as intended before launch.",
    },
    {
        name: "Launch",
        phaseName: "launch",
        shortDescription: "Here we finalize the product, deploy it to the live environment, and guide the client through the first steps of using the product.",
        description:
            "In the Launch phase, the product is deployed to the live environment, and we guide the client through its use. This includes onboarding, training, and providing documentation on how to manage the product. We ensure that the client is fully equipped to use and maintain the product moving forward.",
    },
    {
        name: "Live",
        phaseName: "live",
        shortDescription: "The product is live, and we provide ongoing support and maintenance to ensure smooth operation.",
        description:
            "The Live phase is where the product is in full operation. We provide ongoing support, monitor its performance, and address any issues that arise. Additionally, we assist the client with updates and new features, ensuring that the product continues to meet their needs as their business evolves.",
    },
]

const phaseIndex = computed(() => {
    return phases.findIndex((phase) => phase.phaseName === props.project.phase) || 0
})
</script>

<style lang="scss" scoped>
h3 {
    padding-inline: 25px;
    padding-block: 25px 0;
}

section {
    overflow-y: auto;
    max-height: 100%;
    gap: 50px;
    display: flex;
    flex: 1;
    max-height: 100%;
    padding-inline: 25px;

    overflow-x: hidden;
    flex-direction: column;
}

.phase-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    background: $text-light1;
    padding: 15px 15px;
    margin-inline: 15px;
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
            content: none;
            /* Remove content */
        }

        &::after {
            content: none;
            /* Remove content */
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
