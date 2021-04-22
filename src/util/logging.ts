let logger = "wikichan";

export const setLogger = (name: string): void => {
    logger = name;
};

const timestamp = (): string => new Date().toISOString();

const prefix = (level: "error" | "warn" | "info" | "debug"): [string, string, string] => {
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

export const error = (...messages: unknown[]): void =>
    console.error(...prefix("error"), ...messages);
export const warn = (...messages: unknown[]): void =>
    console.warn(...prefix("warn"), ...messages);
export const info = (...messages: unknown[]): void =>
    console.info(...prefix("info"), ...messages);
export const debug = (...messages: unknown[]): void =>
    console.debug(...prefix("debug"), ...messages);
