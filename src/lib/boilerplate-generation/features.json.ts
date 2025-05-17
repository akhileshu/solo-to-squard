import { FeatureConfig } from "./types";

export const featuresList: FeatureConfig[] = [
  {
    name: "video",
    // components: ["VideoUploadForm", "VideoList", "VideoPlayer"],
    components: {
      rendering: [
        {
          name: "video",
          option: {
            generateTestFile: true,
            isEditableView: true,
            renderAsList: false,
          },
        },
        {
          name: "videoPlaylist",
          option: {
            isEditableView: true,
            generateTestFile: false,
            renderAsList: true,
          },
        },
      ],
      forms: {
        create: [
          {
            name: "video",
            option: {
              generateTestFile: true,
            },
          },
          {
            name: "videoPlaylist",
            option: {
              generateTestFile: false,
            },
          },
        ],
        edit: [
          {
            name: "video",
            option: {
              generateTestFile: true,
            },
          },
        ],
        delete: [
          {
            name: "videoPlaylist",
            option: {
              generateTestFile: false,
            },
          },
        ],
      },
      ui: {
        tables: [
          {
            name: "videoTable",
            option: {
              generateTestFile: true,
            },
          },
        ],
        modals: [
          {
            name: "confirmDeleteVideo",
            option: {
              generateTestFile: false,
            },
          },
        ],
      },
    },
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
    //
    services: ["videoService"], // e.g., for encapsulating business logic
    permissions: ["canUploadVideo", "canDeleteVideo"], // access control layer
    layouts: ["VideoLayout"], // for shared page layout (Next.js)
    providers: ["VideoProvider"], // context/provider (React Context API)
    tests: {
      components: ["VideoUploadForm.test.tsx"],
      api: ["upload.test.ts"],
      utils: ["formatDuration.test.ts"],
    },
    mockData: ["mockVideoData.ts"], // useful for testing/demo
    env: ["VIDEO_UPLOAD_URL", "MAX_VIDEO_SIZE_MB"], // env var template entries
    readme: true, // optionally generate a README.md per feature
  },
];
