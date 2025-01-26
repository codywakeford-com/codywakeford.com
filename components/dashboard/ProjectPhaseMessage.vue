<template>
    <rflex>
        <cflex class="phase-description">
            <h5>Phase Description</h5>
            <pre v-if="props.phase === 'onboarding'">
                Welcome to your project! We're excited to start this journey with you. In this phase, we'll gather all necessary information to kick off the project.

                This is a place that makes it easy for you to interact with us, the development team. 

                Here you can schedule calls with us, talk with use through the chatroom. Throughout this process we may ask you to schedule particular calls with us to discuss the next stage of the project.

                You will see a "required action" that we ask kindly that you complete to keep the project on schedule.

                We will cover this in detail during our discovery meeting.

                Thanks for choosing Veloris Designs
            </pre>

            <pre v-if="props.phase === 'discovery'">
                #Discovery

                We're currently in the discovery phase, where we identify your requirements and goals. We work hard to understand your requirements from the start so we can offer the right solution. 

                Please schedule the discovery meeting with the design team at your convenience. 
                
                After this meeting we will draw up a project proposal. This will outline the plan for the project, mapping out all the features that you will need. This document summarises the project. From this proposal we can draw up a quote. Once you are happy with the proposal and make the payment then we can jump straight into the design phase.
            </pre>

            <pre v-if="props.phase === 'design'">
                #Design

                We have a good idea where were headed now. During the design phase we will work closely with you while creating the design template. This ensures we bring YOUR vision to life in all of it's glory.

                This stage will most likely consist of a few meetings. In each we will ask questions to understand the look and feel your going for. Each time we can iterate until your happy with the design.
            </pre>

            <pre v-if="props.phase === 'development'">
                #Development

                Now you can sit back while we work. During the development stage we build your website from the ground up exactly to the design we made in the last phase. Once were done with the first draft we will notify you.
            </pre>

            <pre v-if="props.phase === 'final-approval'">
                #Final Approval

                Were now done building the draft. This gives you the chance to see the website on a demo link and point out any minor changes you wish to make before we finalise the website.

                Once it's built to your spec we can move into the testing phase!
            </pre>

            <pre v-if="props.phase === 'testing'">
                #Testing

                During the testing phase we stress test every part of the website making sure that everything works as intended on any device. 

                Once were finished with the testing phase we will notify you.
            </pre>

            <pre v-if="props.phase === 'launch'">
                #Launch

                Congratulations! We're ready to launch your project. This is an exciting time as your project goes live! We ask that you book one last call so we can show you the live website link and walk you around the website, ensuring you and your team know exactly whats where and how to use it.
                
            </pre>
        </cflex>
    </rflex>
</template>

<script setup lang="ts">
interface Props {
    phase: ProjectPhase
}

const props = defineProps<Props>()
</script>

<style lang="sass" scoped></style>
