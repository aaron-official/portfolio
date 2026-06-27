"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Island(props: any) {
  const group = useRef(null);
  // Using public URL for the model
  const { nodes, materials } = useGLTF("/models/island.glb") as any;

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.polySurface944_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface945_tree1_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface946_tree2_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface947_tree1_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface948_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface949_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.pCube11_rocks1_0.geometry} material={materials.PaletteMaterial001} />
    </group>
  );
}

useGLTF.preload("/models/island.glb");
