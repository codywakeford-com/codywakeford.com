/**Generates a uuid */
export function uuid(): string {
    const chars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let id = ""

    for (let i = 0; i < 16; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }

    return id
}
