function getRandomColor() {
    const r = Math.floor(Math.random() * 128) + 127 // Soft red range (127-255)
    const g = Math.floor(Math.random() * 128) + 127 // Soft green range (127-255)
    const b = Math.floor(Math.random() * 128) + 127 // Soft blue range (127-255)

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
