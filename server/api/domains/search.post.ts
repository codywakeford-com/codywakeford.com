export default eventHandler(async (event) => {
    const { search } = await readBody(event)

    const response = await $fetch(`https://api.dev.name.com/v4/domains:search`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(useRuntimeConfig().NAME_AUTH_DEV)}`,
            "Content-Type": "application/json",
        },
        body: {
            keyword: search,
        },
    })

    return response
})
