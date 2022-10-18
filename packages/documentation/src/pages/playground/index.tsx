import Layout from "@theme/Layout";
import React from "react";

export default function fastTrack(): JSX.Element {
  return (
    <Layout title="Playground">
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%"
        }}
      >
        <iframe
          style={{width: 'inherit', height: 'inherit'}}
          src="http://localhost:8000/packages/orchestrator/dist/playground/index.html"
        ></iframe>
      </div>
    </Layout>
  );
}
