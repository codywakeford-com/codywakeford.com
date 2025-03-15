import {
    collection,
    CollectionReference,
    doc,
    Firestore,
    onSnapshot,
    Query,
    query,
    QueryConstraint,
    type DocumentData,
} from "firebase/firestore"

export default class DbService {
    static async createObject<T>(path: string, data: T): Promise<string> {
        try {
            const id = await $fetch<string>("/api/firestore/object/create", {
                method: "POST",
                body: { path, data },
            })

            return id
        } catch (error) {
            console.error(error)

            return ""
        }
    }

    static async deleteObject(path: string) {
        try {
            await $fetch("/api/firestore/object/delete", {
                method: "POST",
                body: { path },
            })
        } catch (error) {
            console.error(error)
        }
    }

    static async readObject<T>(path: string): Promise<T | null> {
        try {
            const object = await $fetch<T>("/api/firestore/object/read", {
                method: "POST",
                body: { path },
            })

            return object
        } catch (error) {
            console.error(error)

            return null
        }
    }

    static async updateObject<T>(path: string, data: Partial<T>) {
        try {
            await $fetch("/api/firestore/object/update", {
                method: "post",
                body: {
                    path,
                    data,
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    // arrays

    static async readArray<T>(path: string): Promise<T[]> {
        try {
            const array = await $fetch<T[]>("/api/firestore/array/read", {
                method: "POST",
                body: { path },
            })

            return array
        } catch (error) {
            console.error(error)

            return []
        }
    }

    static initCollectionListener(path: string, state: any, queryConstraint?: QueryConstraint) {
        const db = useNuxtApp().$db as Firestore
        let colRef: CollectionReference<DocumentData> | Query<DocumentData> = collection(db, path)

        if (queryConstraint) colRef = query(colRef, queryConstraint)

        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const keepIds: string[] = []
            snapshot.docChanges().forEach((change) => {
                const docData = { id: change.doc.id, ...change.doc.data() } as any

                if (change.type === "added") {
                    const index = state.findIndex((i) => {
                        return i.id === docData.id
                    })

                    if (index === -1) {
                        keepIds.push(docData.id)
                        state.push(docData)
                    }

                    return
                }

                if (change.type === "modified") {
                    const itemIndex = state.findIndex((i) => {
                        return i.id === docData.id
                    })

                    state[itemIndex] = docData

                    return
                }

                if (change.type === "removed") {
                    const itemIndex = state.findIndex((i) => {
                        return i.id !== docData.id
                    })

                    if (itemIndex === -1) return

                    state.splice(itemIndex, 1)

                    return
                }
            })

            // remove items no longer in firebase
            // state.splice(0, state.length, ...state.filter((i) => keepIds.includes(i.id)))
        })

        return unsubscribe
    }

    // Pass an object reference to be updated when changes occur
    static initDocumentListener(path: string, state: any) {
        const db = useNuxtApp().$db as Firestore
        const docRef = doc(db, path)

        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const docData = { id: docSnapshot.id, ...docSnapshot.data() } as any

                Object.assign(state, docData)
                return
            } else {
                console.log("Document does not exist.")
            }
        })

        return unsubscribe
    }
}
