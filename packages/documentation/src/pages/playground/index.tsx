import Layout from "@theme/Layout";
import React from "react";

export default function playground(): JSX.Element {
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
          src="./config.html"
        ></iframe>
      </div>
    </Layout>
  )
}
