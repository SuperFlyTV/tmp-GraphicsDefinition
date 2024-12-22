export function pathJoin(...paths) {
    return paths.join('/').replace(/\/+/g, '/');
}
export function graphicResourcePath(...paths) {
    // This URL prefix causes the service-worker to intercept the requests and serve the file from the local file system:
    return pathJoin("http://LOCAL/", ...paths);
}
