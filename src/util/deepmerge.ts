/* 
eslint-disable
    @typescript-eslint/consistent-type-assertions,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-return
*/

interface IObject {
    [key: string]: any;
}

type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I,
) => void
    ? I
    : never;

// istanbul ignore next
const isObject = (obj: any): boolean => {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }

        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    return false;
};

export const deepmerge = <T extends IObject[]>(
    ...objects: T
): TUnionToIntersection<T[number]> =>
    objects.reduce((result, current) => {
        Object.keys(current).forEach((key) => {
            if (Array.isArray(result[key]) && Array.isArray(current[key])) {
                result[key] = Array.from(new Set(result[key].concat(current[key])));
            } else if (isObject(result[key]) && isObject(current[key])) {
                result[key] = deepmerge(result[key], current[key]);
            } else {
                result[key] = current[key];
            }
        });

        return result;
    }, {}) as any;
