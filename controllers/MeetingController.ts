import ActivityLogService from "~~/services/ActivityLogService"
import MeetingService from "~~/services/MeetingService"
import ActionController from "./ActionsController"

export default class MeetingController {
    static async onMeetingScheduled(event: any) {
        if (!$Projects.state.selectedProjectId) {
            console.log($Projects.state.selectedProjectId)
            throw new Error("Global state not correct")
        }

        const meetingUrl = event.payload.event.uri
        const clientUrl = event.payload.invitee.uri

        await ActionController.onBookCall($Projects.state.selectedProjectId)
        const meeting = await MeetingService.setMeeting($Projects.state.selectedProjectId, meetingUrl, clientUrl)

        if (!meeting) throw new Error("An error occured getting the meeting details")

        await ActivityLogService.addMeetingActivityItem($Projects.state.selectedProjectId, meeting.id)
    }
}
