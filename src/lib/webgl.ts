// True when this browser can create a WebGL context at all (false with hardware acceleration off, some old phones and locked-down browsers).
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
