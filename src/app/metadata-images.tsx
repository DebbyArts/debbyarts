/* eslint-disable @next/next/no-img-element -- ImageResponse renders native image elements, not next/image. */
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

const logoData = await readFile(
  join(process.cwd(), "public/debby-art-prints-logo.png"),
  "base64"
)
const logoSrc = `data:image/png;base64,${logoData}`

function createBrandIcon(size: { height: number; width: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f5f0e6",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <img
          alt=""
          src={logoSrc}
          style={{ height: "72%", objectFit: "contain", width: "88%" }}
        />
      </div>
    ),
    size
  )
}

function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f0e6",
          color: "#1f1e1b",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          padding: "68px 76px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#269db8",
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            top: 0,
            width: 18,
          }}
        />
        <div
          style={{
            background: "#cf2e78",
            border: "3px solid #1f1e1b",
            borderRadius: 32,
            display: "flex",
            height: 330,
            position: "absolute",
            right: 72,
            top: 96,
            transform: "rotate(5deg)",
            width: 270,
          }}
        />
        <div
          style={{
            alignItems: "center",
            background: "#269db8",
            border: "3px solid #1f1e1b",
            borderRadius: 32,
            display: "flex",
            height: 330,
            justifyContent: "center",
            position: "absolute",
            right: 112,
            top: 132,
            transform: "rotate(-3deg)",
            width: 270,
          }}
        >
          <img
            alt=""
            src={logoSrc}
            style={{ height: 190, objectFit: "contain", width: 240 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 710,
          }}
        >
          <div
            style={{
              background: "#f2c84b",
              border: "2px solid #1f1e1b",
              borderRadius: 999,
              display: "flex",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 2,
              padding: "12px 22px",
              textTransform: "uppercase",
            }}
          >
            Art · Print · Brand · Personalise
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 0.92,
              marginTop: 44,
              textTransform: "uppercase",
            }}
          >
            <span>Make it</span>
            <span>personal.</span>
          </div>
          <div
            style={{
              color: "#5f5b53",
              display: "flex",
              fontSize: 26,
              lineHeight: 1.35,
              marginTop: 36,
              maxWidth: 650,
            }}
          >
            Original artwork, printing, branding and personalised creative work
            across Lagos and nationwide.
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

export { createBrandIcon, createSocialImage }
