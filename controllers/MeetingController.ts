import ActionService from "~/services/ActionService"
import ActivityLogService from "~/services/ActivityLogService"
import MeetingService from "~/services/MeetingService"

export default class MeetingController {
    static async onMeetingScheduled(event) {
        console.log(event)

        if (!$Actions.state.selectedActionId || !$Projects.state.selectedProjectId) {
            console.log($Actions.state.selectedActionId, $Projects.state.selectedProjectId)
            throw new Error("Global state not correct")
        }

        await ActionService.markActionAsComplete($Projects.state.selectedProjectId, $Actions.state.selectedActionId)
        // const meeting = await MeetingService.setMeeting($Projects.state.selectedProjectId,)

        // ActivityLogService.addMeetingActivityItem(projectId, meeting.id)
    }
}
