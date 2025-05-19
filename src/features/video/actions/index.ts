"use server";

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "./";

import { getTrendingPlaylists } from "./getTrendingPlaylists";
import { clonePlaylist } from "./clonePlaylist";

export const videoActions = {
  getAll: getVideos,
  getById: getVideoById,
  create: createVideo,
  update: updateVideo,
  delete: deleteVideo,
  getTrendingPlaylists: getTrendingPlaylists,
  clonePlaylist: clonePlaylist,
};
