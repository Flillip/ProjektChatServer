export function info(message: string) {
    console.log(`[info][${new Date().toLocaleTimeString("sv-SE")}] ${message}`)
}

export function error(message: string) {
    console.log(`[error][${new Date().toLocaleTimeString("sv-SE")}] ${message}`)
}
