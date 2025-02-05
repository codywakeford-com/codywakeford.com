import { collection, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";

export const useMeetingStore = defineStore("meetings", {
    state: () => ({
        meetings: [] as Meeting[],
    }),

    getters: {
        get(state) {
            return state.meetings;
        },

        getById:
            (state) =>
                (meetingId: Meeting["id"]): Meeting | undefined => {
                    return state.meetings.find((m) => {
                        return m.id === meetingId;
                    });
                },

        getByProjectId:
            (state) =>
                (projectId: Project["id"]): Meeting[] => {
                    const meetings = state.meetings.filter((m) => {
                        return m.projectId === projectId;
                    });

                    return meetings;
                },

        getLengthByProjectId: (state) => (projectId: Project["id"]) => {
            const meetings = state.meetings.filter((m) => {
                return m.projectId === projectId;
            });

            if (!meetings) throw new Error("No project found");

            return meetings.length;
        },
    },

    actions: {
        async init() {
            const ids = $Projects.getProjects.map((p) => {
                return p.id;
            });

            for (let id of ids) {
                const colRef = collection(useDb(), `/projects/${id}/meetings`);

                onSnapshot(colRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        const meetingData = change.doc.data();

                        const meeting = {
                            id: change.doc.id,
                            ...meetingData,
                        } as Meeting;

                        if (change.type === "added") {
                            const index = this.meetings.findIndex((m) => m.id === meeting.id);
                            if (index === -1) {
                                this.meetings.push(meeting);
                            }
                            return;
                        }

                        if (change.type === "modified") {
                            const index = this.meetings.findIndex((m) => m.id === meeting.id);

                            if (index === -1) {
                                return;
                            }

                            this.meetings[index] = meeting;

                            return;
                        }

                        if (change.type === "removed") {
                            // Remove deleted projects from the state
                            this.meetings = this.meetings.filter(
                                (m) => m.id !== change.doc.id,
                            );
                        }
                    });
                });
            }
        },
    },
});
