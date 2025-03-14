<script setup lang="ts">
const $Projects = useProjectStore()
const $Actions = useActionStore()

interface Props {
    interface: "staff" | "client"
}

const props = defineProps<Props>()

function getProjectUrl(projectId: string) {
    if (props.interface === "staff") {
        return `/dashboard/staff/${projectId}`
    } else {
        return `/dashboard/client/${projectId}`
    }
}
</script>

<template>
    <section>
        <div class="cards">
            <nuxt-link
                @click="$Projects.state.selectedProjectId = project.id"
                :to="getProjectUrl(project.id)"
                class="card"
                v-for="project in $Projects.state.projects"
            >
                <header>
                    <div class="box" :style="`background: ${project.color || 'orange'}`">PN</div>
                    <div class="right">
                        <h2>{{ project.name || "Project Name" }}</h2>
                        <p>{{ project.phase }}</p>
                    </div>
                </header>

                <div class="description">
                    <p>
                        {{
                            project.description ||
                            "This is a description is a description is a description is a description is"
                        }}
                    </p>
                </div>

                <div class="status">
                    <div class="top">
                        <div class="actions">{{ $Actions.getPendingByProjectId(project.id).length }} action</div>
                        <div class="percentage">{{ $Projects.getCompletionPercentage(project.phase) }}%</div>
                    </div>
                    <div
                        class="status-bar"
                        :style="{ '--filled-width': `${$Projects.getCompletionPercentage(project.phase)}%` }"
                    ></div>
                </div>

                <div class="bottom">
                    <div class="people-icons">
                        <div class="icon"></div>
                    </div>

                    <div class="est-delivery">10 March</div>
                </div>
            </nuxt-link>
        </div>
    </section>
</template>

<style lang="scss" scoped>
header {
    margin-bottom: 25px;

    h1 {
        font-size: 2rem;
        font-weight: 600;
    }
}

.cards {
    display: flex;
    align-items: start;
    gap: 50px;
    flex-wrap: wrap;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 25px;
    background: var(--background);
    padding: 25px;
    border-radius: 5px;
    border: 1px solid var(--text2);
    min-width: 300px;
    max-width: 400px;

    header {
        display: flex;
        gap: 20px;
        margin-bottom: 0;

        .box {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text1a);
            font-weight: bold;
            font-size: 1.2rem;
            height: 60px;
            border-radius: 7px;
            width: 60px;
        }
    }

    .status {
        .top {
            display: flex;
            justify-content: space-between;
        }

        .status-bar {
            position: relative;
            background: var(--text2);
            height: 10px;
            width: 100%;
            border-radius: 25px;

            &::after {
                content: "";
                position: absolute;
                left: 0;
                background: var(--primary);
                height: 10px;
                width: var(--filled-width);
                border-radius: 25px;
                transition: width 0.25s;
            }
        }
    }
}
</style>
