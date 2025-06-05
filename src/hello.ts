export function installHello() {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).hello = () => {
        console.log("Hello, here's a few things you can try:")
        console.log(" - env()")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).env = () => {
        console.log("Environmental variables:")
        for (const variable in import.meta.env) {
            console.log(`  ${variable} = ${import.meta.env[variable]}`)
        }
    }
}
