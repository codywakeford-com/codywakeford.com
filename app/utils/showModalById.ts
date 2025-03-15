export function showModalById(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null

    if (!modal) {
        console.log(`Modal with id '${id}' not found.`)
        return
    }

    modal.showModal()
}

export function closeModalById(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null

    if (!modal) {
        console.log(`Modal with id '${id}' not found.`)
        return
    }

    modal.close()
}

export function toggleModalById(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null

    if (!modal) {
        console.log(`Modal with id '${id}' not found.`)
        return
    }

    if (modal.open) {
        modal.close()
    } else {
        modal.showModal()
    }
}
