/**Generates a uuid */
export function uuid(): string {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)

    const base64 = btoa(String.fromCharCode(...array))
    const uuid = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").slice(0, 20)

    return uuid
}
