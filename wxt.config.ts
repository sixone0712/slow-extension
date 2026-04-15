import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  runner: {
    chromiumArgs: ["--remote-debugging-port=9222"],
  },
  manifest: {
    name: "Slow",
    description:
      "Flow 웹(flow.team)의 레이아웃을 채팅/알림 중심으로 재구성하는 크롬 익스텐션",
    version: "0.1.2",
    permissions: ["storage", "scripting", "activeTab"],
    host_permissions: ["*://flow.team/*"],
    icons: {
      16: "/icon/16.png",
      48: "/icon/48.png",
      128: "/icon/128.png",
    },
    content_scripts: [
      {
        matches: ["*://flow.team/*"],
        js: ["/inject.js"],
        run_at: "document_start",
        world: "MAIN",
      },
    ],
  },
});
