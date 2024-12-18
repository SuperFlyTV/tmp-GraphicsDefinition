export function pathJoin(...paths) {
    return paths.join('/').replace(/\/+/g, '/');
}
