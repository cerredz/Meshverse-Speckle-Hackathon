"use client";
// components/GLBViewer.js
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  ambientLight,
  directionalLight,
  Box,
  Environment,
} from "@react-three/drei";

const GLBViewer = ({ fileUrl, scale, height }) => {
  const { scene } = useGLTF(fileUrl);

  return (
    <Canvas
      style={{
        height: height,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ambientLight intensity={1000} />
      <Suspense fallback={null}>
        <primitive
          object={scene}
          dispose={null}
          scale={scale}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Environment preset="sunset" />
      <OrbitControls />
    </Canvas>
  );
};

export default GLBViewer;
