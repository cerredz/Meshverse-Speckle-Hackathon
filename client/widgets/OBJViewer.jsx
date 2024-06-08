"use client";
// components/OBJViewer.js
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  ambientLight,
  directionalLight,
  Box,
  Environment,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const OBJViewer = ({ fileUrl, scale, height }) => {
  const obj = useLoader(OBJLoader, fileUrl);

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
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <primitive
          object={obj}
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

export default OBJViewer;
