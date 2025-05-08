import { FeatureConfig } from "./types";

export const featuresList: FeatureConfig[] = [
  {
    name: "video",
    components: ["VideoUploadForm", "VideoList", "VideoPlayer"],
    apiRoutes: ["upload", "process", "get", "delete"],
    serverActions: ["startProcessing", "notifyUser"],
    dbModel: ["Video"],
    zodSchemas: ["videoSchema", "videoInputSchema"],
    hooks: ["useUploadVideo", "useProcessStatus"],
    types: ["Video"],
    store: "useVideoStore",
    utils: ["formatDuration", "getThumbnail"],
    constants: ["videoStatus"],
    messages: ["ADD_SUCCESS", "ADD_ERROR", "REMOVE_SUCCESS"],
    pages: ["/video/[id]", "/video/upload", "/video/(analytics)"],
  },
];