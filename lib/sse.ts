// This map will store active SSE connections for each lobby
export const sseConnections: Map<string, Array<ReadableStreamDefaultController>> = new Map();