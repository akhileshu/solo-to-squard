export const videoStatus = {
  EXAMPLE: "example_value",
};

export type VideoStatus = (typeof videoStatus)[keyof typeof videoStatus];