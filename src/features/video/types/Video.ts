export interface Video {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export type VideoCreateInput = Omit<Video, 'id' | 'createdAt' | 'updatedAt'>;
export type VideoUpdateInput = Partial<VideoCreateInput>;

export interface VideoSearchParams {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
}