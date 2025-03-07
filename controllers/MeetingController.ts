import ActionService from "~~/services/ActionService"
import ActivityLogService from "~~/services/ActivityLogService"
import MeetingService from "~~/services/MeetingService"

export default class MeetingController {
    static async onMeetingScheduled(event: any) {
        if (!$Actions.state.selectedActionId || !$Projects.state.selectedProjectId) {
            console.log($Actions.state.selectedActionId, $Projects.state.selectedProjectId)
            throw new Error("Global state not correct")
        }

        const meetingUrl = event.payload.event.uri
        const clientUrl = event.payload.invitee.uri

        await ActionService.markActionAsComplete($Projects.state.selectedProjectId, $Actions.state.selectedActionId)
        const meeting = await MeetingService.setMeeting($Projects.state.selectedProjectId, meetingUrl, clientUrl)

        if (!meeting) throw new Error("An error occured getting the meeting details")

        await ActivityLogService.addMeetingActivityItem($Projects.state.selectedProjectId, meeting.id)
    }
}
