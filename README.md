# 財務碳健檢 Landing Page

經濟部中小及新創企業署「中小微企業財務碳健檢」單頁形象網站。
執行單位：財團法人商業發展研究院。

**線上版本：** https://green-kung.github.io/cdri-landing/

---

## 這是什麼樣的專案

一個**純靜態網站**。沒有框架、沒有套件、沒有建置流程（no npm / no build step）。
三個檔案就是全部：`index.html`、`style.css`、`main.js`。

意思是：用任何文字編輯器打開就能改，存檔就生效。不需要安裝 Node.js 或任何開發環境。

---

## 檔案結構

```
cdri-landing/
├── index.html          ← 所有文案、數據、連結都在這裡
├── style.css           ← 所有樣式（約 1,200 行，依區塊分段並有註解）
├── main.js             ← 捲動動畫、漢堡選單、Hero 輪播、YouTube 延遲載入
├── images/
│   ├── hero banner.jpg              ← Hero 第二張輪播圖（圖上已含文字）
│   ├── Two core services-1/2.jpg    ← 兩大核心服務的卡片背景
│   ├── Lecture and training resources-1/2/3.jpg  ← 講座資源縮圖
│   ├── logo.png                     ← 頁首與頁尾的署徽
│   └── original/                    ← 未壓縮的原始 PNG 備份（網站不會載入）
└── icon/
    └── *.svg           ← 各區塊的裝飾性圖示
```

`/logo.png`（根目錄那個 388KB 的）是舊版殘留，網站實際載入的是 `images/logo.png`。

---

## 本機預覽

因為有 `fetch` 以外的相對路徑資源，建議用簡易伺服器而不是直接雙擊開啟：

```bash
cd cdri-landing
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000
```

直接以 `file://` 開啟 `index.html` 大致也能看，但 YouTube 嵌入與部分行為可能不準。

---

## ⚠️ 改完一定要做的事：更新快取版號

`index.html` 底部與頂部各有一個查詢字串版號：

```html
<link rel="stylesheet" href="./style.css?v=40">   ← 第 8 行
<script src="./main.js?v=34"></script>             ← 第 301 行
```

**只要動到 `style.css` 就把 `v=40` 加一；只要動到 `main.js` 就把 `v=34` 加一。**

**換圖片但沿用相同檔名時同理**——要把該 `<img>` 的 `?v=` 加一（講座三張縮圖目前是 `?v=2`）。若是換成不同檔名則不需要，新檔名本身就會避開快取。

漏掉的話，回訪的使用者瀏覽器會繼續用快取裡的舊檔，你會看到「我明明改了怎麼沒變」——這是這個專案最容易踩的坑。

---

## 常見修改對照表

| 要改什麼 | 改哪裡 |
|---|---|
| 服務數據（18,547 / 4,250 / 200 / 60） | `index.html` 的 `.stat-num`，約 112、118、141、145 行 |
| Hero 影片 | `index.html` 第 39 行 `data-video-id="Y4R1sVv2_0U"` 換成新的 YouTube 影片 ID |
| 「前往申請」按鈕連結 | `index.html` 第 50 行 |
| 講座三則的標題／說明／連結 | `index.html` 第 163–209 行，每則是一個 `<a class="resource-row">` |
| 頁尾地址、電話、服務時間 | `index.html` 第 259–288 行 |
| 全站配色 | `style.css` 的 `:root`，變數集中在最上方 |
| 各區塊左右留白 | `style.css` 的 `--page-x`（**所有區塊共用，改一處全站對齊**） |
| 卡片標題字級 | `style.css` 的 `--card-title-fs` |
| 輪播每張停留秒數 | `main.js` 第 55 行 `DURATION = 6000`（毫秒） |

### 換圖片時的注意事項

圖檔名稱含有空格（例如 `hero banner.jpg`），在 HTML 裡必須寫成 `%20`：

```html
<img src="./images/hero%20banner.jpg">
```

沿用既有檔名最省事。若要換新檔名，建議直接用不含空格的命名。

---

## 部署

GitHub Pages，來源是 `main` 分支的根目錄。

**推上 `main` 就會自動重新部署**，約 1 分鐘後生效。沒有 CI／GitHub Actions，也不需要手動觸發。

```bash
git add .
git commit -m "更新說明"
git push
```

目前沒有設定自訂網域（CNAME）。

---

## 外部相依

網站會向以下外部服務發出請求，離線或封鎖時會降級但不會壞掉：

- **Google Fonts** — Noto Serif TC、Noto Sans TC（`index.html` 第 7 行）
- **YouTube** — Hero 影片縮圖 `img.youtube.com`；使用者點擊後才載入 `youtube-nocookie.com` 播放器

採用 facade 模式：頁面初次載入**不會**載入 YouTube 播放器，只放縮圖，點擊才注入 iframe。這是刻意的效能設計，改動時請保留。

---

## 無障礙與效能上的既有設計

改版時請留意，以下都是刻意為之，不是疏漏：

- 裝飾性圖片的 `alt` 一律留空，語意由鄰近的標題文字承擔
- 尊重 `prefers-reduced-motion`，開啟時停用輪播自動播放
- 分頁切到背景時暫停輪播計時器
- 導覽列高度由 JS 實測後寫回 `--nav-h`，錨點捲動才不會被固定頁首遮住
- `html` 用 `overflow-x: clip` 而非 `hidden`，後者會讓 `position: sticky` 失效

`style.css` 內有大量說明「為什麼這樣寫」的註解，動手前值得先讀該區塊的註解。

---

## 交接備註

- 此 repo 為 **Public**，任何人都能瀏覽與 clone，但**推送需要權限**
- 需要修改網站內容的人，必須由 repo 擁有者加入為 Collaborator
- 若要移交維護權，請 Transfer ownership；注意 **GitHub Pages 網址會隨擁有者改變，且舊網址不會自動轉址**
