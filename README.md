# Sun Shadow Simulator

初始的 Next.js 專案，用於在地圖上模擬太陽方位與影子長度。

## 開發

1. 複製 `.env.example` 為 `.env.local` 並填入 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`。
2. 安裝相依套件：`npm install`。
3. 啟動開發伺服器：`npm run dev`。

## 功能概述

- 點擊地圖放置圖釘。
- 輸入日期時間與高度後計算太陽方位角、高度角與影長。
- 在地圖上繪製影子線段。
