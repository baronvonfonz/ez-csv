export const urlOrUndefined = (maybeUrl: string): URL | undefined => {
    let url;
    try {
        url = new URL(maybeUrl);
    } catch (e) {}

    return url;
}