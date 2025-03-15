import axios from "axios"
import DbService from "./DbService"

export default class MeetingService {
    static async setMeeting(projectId: Project["id"], meetingUrl: string, clientUrl: string) {
        try {
            const meeting = await this.getCalendlyMeetingDetails(projectId, meetingUrl, clientUrl)
            await DbService.createObject<Meeting>(`/projects/${projectId}/meetings`, meeting)
            return meeting
        } catch (error) {
            console.error(error)
        }
    }

    static async getCalendlyMeetingDetails(projectId: Project["id"], meetingUrl: string, clientUrl: string): Promise<Meeting> {
        const config = useRuntimeConfig()

        const meetingDetails = await axios.get(meetingUrl, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${config.public.CALENDLY_PAT}`,
            },
        })

        const clientDetailsResponse = await axios.get(clientUrl, {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${config.public.CALENDLY_PAT}`,
            },
        })

        const calendlyMeeting = meetingDetails.data
        const clientDetails = clientDetailsResponse.data

        const meeting: Meeting = Object.assign(
            {},
            {
                id: uuid(),
                projectId: projectId,
                timestamp: Date.now(),
                name: calendlyMeeting.resource.name as string,
                startTime: new Date(calendlyMeeting.resource.start_time).getTime(),
                meetingUrl: calendlyMeeting.resource.location.join_url as string,
                cancelUrl: clientDetails.resource.cancel_url as string,
                rescheduleUrl: clientDetails.resource.reschedule_url as string,
                status: "scheduled" as MeetingStatus,

                clients: [
                    {
                        name: clientDetails.resource.name as string,
                        email: clientDetails.resource.email as string,
                    },
                ],
            },
        )

        return meeting
    }
}
