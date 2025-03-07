import DbService from "~~/services/DbService"
import ProjectService from "~~/services/ProjectService"

export default class InitController {
    static async initProjectListeners(email: string) {
        const projectIds = (await ProjectService.getProjectIdsForUser(email)) || []

        for (let id of projectIds) {
            DbService.initDocumentListener(`/projects/${id}`, $Projects.state.projects)
            DbService.initCollectionListener(`/projects/${id}/user-required-actions`, $Actions.state.actions)
            DbService.initCollectionListener(`/projects/${id}/activity-log`, $ActivityLogs.state.log)
            DbService.initCollectionListener(`/projects/${id}/messages`, $ActivityLogs.state.log)
            DbService.initCollectionListener(`/projects/${id}/meetings`, $Meetings.state.meetings)
        }
    }

    /** Here we listen to all the projects, if we get a project that matches the user we initialize all listeners */
    static async listenForNewProjects(email: string) {}
}
