import { useState } from "react";

export function uploadVideo() {
  const [state, setState] = useState(null);

  return {
    state,
    setState,
  };
}
