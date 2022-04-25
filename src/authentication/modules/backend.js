export function createAPIRoute(route) {
    return `${process.env.VUE_APP_BACKEND_BASE_URL}${route}`;
}
