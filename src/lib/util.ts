export function wait(ms: number, data?: any) {
    return new Promise((res) => {
        setTimeout(() => res(data), ms);
    });
}
