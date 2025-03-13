interface GFlags {
    dashboard: boolean
}

const devFlags: GFlags = {
    dashboard: true,
}

const prodFlags: GFlags = {
    dashboard: false,
}

export default process.env.NODE_ENV === "production" ? prodFlags : devFlags
