import { useState } from "react";

export function processStatus() {
  const [state, setState] = useState(null);

  return {
    state,
    setState,
  };
}
