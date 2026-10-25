import { useGLTF } from "@react-three/drei";

// Serve the Draco decoder from this site; the default is gstatic.com, which some networks and ad-blockers block, leaving the island empty.
useGLTF.setDecoderPath("/draco/");
