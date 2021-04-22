let logger: string = "wikichan";

export const setLogger = (name: string) => {
    logger = name;
};

const timestamp = () => new Date().toISOString();

const prefix = (level: "error" | "warn" | "info" | "debug") => {
    let color;
    let padding = "";
    switch (level) {
        case "error":
            color = "red";
            padding = " ";
            break;
        case "warn":
            color = "yellow";
            break;
        case "info":
            color = "grey";
            padding = " ";
            break;
        case "debug":
            color = "steelblue";
            break;
    }

    return [
        `%c${timestamp()} [${logger}][${level}]%c` + padding,
        `color:${color}`,
        `color:grey`,
    ];
};

export const error = (...messages: unknown[]) =>
    console.error(...prefix("error"), ...messages);
export const warn = (...messages: unknown[]) =>
    console.warn(...prefix("warn"), ...messages);
export const info = (...messages: unknown[]) =>
    console.info(...prefix("info"), ...messages);
export const debug = (...messages: unknown[]) =>
    console.debug(...prefix("debug"), ...messages);
