const body = document.querySelector("body");
const preview = document.getElementById("preview");
let db = {};
let currentLayout = [];
let cssContent = "";
let jqueryContent = "";
let cssPreviewContent = "";
let cssNormalizeContent = "";

async function init() {
  try {
    //抓取元件資料庫
    const resJson = await fetch("components.json");
    db = await resJson.json();
    //抓取css樣式
    const resCss = await fetch("css/components.css");
    cssContent = await resCss.text();
    const resNormalizeCss = await fetch("css/normalize.css");
    cssNormalizeContent = await resNormalizeCss.text();
    const resPreviewCss = await fetch("css/preview.css");
    cssPreviewContent = await resPreviewCss.text();
    //抓取jQuery
    const resJquery = await fetch("js/jquery-3.7.1.min.js");
    jqueryContent = await resJquery.text();

    //把每個 section 的 JS 內容預先抓取下來
    const fetchJsPromises = db.sections.map(async (item) => {
      if (item.js !== "") {
        try {
          const res = await fetch(item.js);
          item.jsCode = await res.text(); // 存入自定義屬性 jsCode
        } catch (err) {
          console.error(`無法載入 ${item.js}`, err);
          item.jsCode = "";
        }
      } else {
        item.jsCode = "";
      }
    });
    await Promise.all(fetchJsPromises);

    console.log("資料庫與 CSS 及 JS載入成功");
    renderOptions();
  } catch (err) {
    console.error("載入失敗:", err);
  }
}
//切換上方選項區
function switchTabs(type) {
  //切換選項按鈕
  const tabs = document.getElementById("tabs-wrap");
  tabs.addEventListener("click", (e) => {
    //先移除掉所有的active，只在點擊的這顆按鈕上添加active
    const btns = tabs.querySelectorAll(".tab-btn");
    btns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
  });
  //切換選項渲染區
  const category = document.querySelectorAll(".category-content");
  category.forEach((category) => {
    if (category.id === `${type}-options`) {
      category.classList.add("active");
      //重新渲染iframe
      reCalIframeHeight();
    } else {
      category.classList.remove("active");
    }
  });
}
//重新計算渲染iframe的高度
function reCalIframeHeight() {
  const categories = document.querySelectorAll(".category-content");
  categories.forEach((category) => {
    const iframes = category.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow && iframe.contentWindow.document.body) {
        const height =
          iframe.contentWindow.document.documentElement.scrollHeight;
        iframe.style.height = height + "px";
      }
    });
  });
}
//視窗寬度變更時，重新計算iframe高度
window.addEventListener("resize", reCalIframeHeight);
//把json檔中的資料渲染在上方選擇區
function renderOptions() {
  db.sections.forEach(async (item) => {
    //找出要渲染的類別
    const container = document.getElementById(`${item.type}-options`);
    if (!container) return;

    //每個資料都會渲染出一個div，裡面包著一個iframe跟一個按鈕
    const newDiv = document.createElement("div");
    newDiv.className = "choose-item";

    const newIframe = document.createElement("iframe");
    newIframe.id = `${item.id}`;

    const newButton = document.createElement("button");
    newButton.className = "add-item";
    newButton.innerText = `新增 ${item.name}`;
    newButton.id = `button-${item.id}`;

    newDiv.appendChild(newIframe);
    newDiv.appendChild(newButton);
    container.appendChild(newDiv);

    //把每個iframe中的內容渲染出來
    const content = `
      <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
          <style>
            :root{overflow:hidden;}
            .header {
              position: relative !important;
              top: auto !important;
              left: auto !important;
            }
            .header *{
              pointer-events: none;
            }
            ${cssNormalizeContent}
            ${cssContent}
          </style>
        </head>
        <body>
          ${item.html}
          <!-- JQuery -->
          <script>${jqueryContent}</script>
          <!-- Swiper JS -->
          <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
          <script>${item.jsCode}</script>
        </body>
      </html>`;

    newIframe.srcdoc = content;

    //計算iframe高度
    newIframe.onload = () => {
      const height = newIframe.contentWindow.document.body.scrollHeight;
      newIframe.style.height = height + "px";
    };
  });
}
function addItem() {
  const addBtnWrap = document.getElementById("add-btn-wrap");
  //在新增按鈕父層綁定點擊事件
  addBtnWrap.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
      //取得要新增的iframe的id
      const chooseItem = e.target.parentNode;
      const chooseIframe = chooseItem.getElementsByTagName("iframe")[0];
      const componentId = chooseIframe.getAttribute("id");
      //存入currentLayout中並渲染出大iframe中的內容
      currentLayout.push(componentId);
      renderToIframe();
      alert(`${componentId} 已加入到側邊即時預覽區`);
    }
  });
}
//切換顯示側邊渲染區
function showPreview() {
  preview.style.display = "flex";
  body.classList.add("body-mask");

  //如果第一次點進側邊預覽區，則顯示導引
  if (!localStorage.getItem("previewGuide_seen")) {
    startPreviewGuide();
    localStorage.setItem("previewGuide_seen", "true");
  }
}
function closePreview() {
  preview.style.display = "none";
  body.classList.remove("body-mask");
}
function renderToIframe() {
  //找到側邊大渲染區
  const iframe = document.getElementById("preview-iframe");
  //把資料庫中的html內容組裝起來，每段結尾加上換行
  const finalHtmlChunks = currentLayout
    .map((id, index) => {
      const section = db.sections.find((item) => item.id === id);
      if (!section) return "";
      return `
          <div class="component-wrapper" data-index="${index}">
            ${section.html}
            <button class="del-item" onClick="window.parent.delItem(${index})">刪除</button>
          </div>
        `;
    })
    .join("\n");

  const finalJsChunks = currentLayout
    .map((id) => {
      const section = db.sections.find((item) => item.id === id);
      return section ? section.jsCode : "";
    })
    .join("\n");

  //將最後內容渲染進大iframe中
  const fullContent = `
    <html lang="zh-TW">
        <head>
        <meta charset="UTF-8" />
          <!-- Swiper css -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
          <style>
            .header {
              position: relative !important;
              top: auto !important;
              left: auto !important;
              pointer-events: none;
            }
            ${cssNormalizeContent}
            ${cssContent}
            ${cssPreviewContent}
          </style>
        </head>
        <body>
          ${finalHtmlChunks}
          <!-- JQuery -->
          <script>${jqueryContent}</script>
          <!-- Swiper -->
          <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
          <!-- main JS -->
          <script>
            try {
              ${finalJsChunks}
            } catch(err) {
              console.error("預覽區 JS 執行錯誤:", err);
            }
          </script>
        </body>
      </html>`;
  iframe.srcdoc = fullContent;
}
function delItem(index) {
  //利用傳進的index找到currentLayout中的刪除目標，然後重新渲染下方預覽區，即時更新
  currentLayout.splice(index, 1);
  renderToIframe();
}
//切換預覽區寬度
function changeView(device) {
  //切換選項按鈕
  const toolbar = document.getElementById("toolbar");
  toolbar.addEventListener("click", (e) => {
    //先移除掉所有的active，只在點擊的這顆按鈕上添加active
    const btns = toolbar.querySelectorAll(".tab-btn");
    btns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
  });
  const iframe = document.getElementById("preview-iframe");
  if (device === "mobile") {
    iframe.style.maxWidth = "375px";
  } else if (device === "tablet") {
    iframe.style.maxWidth = "768px";
  } else {
    iframe.style.maxWidth = "100%";
  }
}

//生成實際程式碼
async function exportCode() {
  if (currentLayout.length === 0) {
    alert("預覽區是空的，請先選取模版！");
    return;
  }

  const zip = new JSZip();

  //建立資料夾
  const cssFolder = zip.folder("css");
  const jsFolder = zip.folder("js");
  const assetsFolder = zip.folder("assets");

  cssFolder.file("style.css", cssContent);
  cssFolder.file("normalize.css", cssNormalizeContent);
  jsFolder.file("jquery-3.7.1.min.js", jqueryContent);

  //選取到需要的js路徑
  const selectedItems = currentLayout
    .map((id) => db.sections.find((item) => item.id === id))
    .filter(Boolean);

  const scripts = new Set();
  selectedItems.forEach((item) => {
    if (item.js) {
      scripts.add(item.js);
    }
  });

  const scriptTags = Array.from(scripts)
    .map((path) => {
      const fileName = path.split("/").pop();
      return `<script src="js/${fileName}"></script>`;
    })
    .join("\n");

  //下載並打包需要的js檔案
  const jsArray = Array.from(scripts);
  const jsPromises = jsArray.map(async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("找不到檔案");
      const code = await response.text();
      const fileName = path.split("/").pop();
      jsFolder.file(fileName, code);
    } catch (error) {
      console.error(`JS下載失敗： ${path}, error`);
    }
  });
  //將選取的模板html用換行符號串接成完整字串
  const cleanHtml = currentLayout
    .map((id) => {
      const layoutItem = db.sections.find((item) => item.id === id);
      return layoutItem ? layoutItem.html : "";
    })
    .join("\n");

  //解析html內容並提取所有img元素
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, "text/html");
  const imgElements = doc.querySelectorAll("img");
  //確保不會抓到同一張圖
  const imgPaths = new Set();
  imgElements.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("assets/")) {
      imgPaths.add(src);
    }
  });
  //下載檔案並放進新建的assets資料夾中
  const imgArray = Array.from(imgPaths);
  const imgPromises = imgArray.map(async (path) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const fileName = path.split("/").pop();
      assetsFolder.file(fileName, blob);
    } catch (error) {
      console.error(`圖片下載失敗:${path}, err`);
    }
  });

  //等待所有JS及圖片下載完成
  await Promise.all([...jsPromises, ...imgPromises]);

  //套上完整html模板字串
  const finalTemplate = `
    <!DOCTYPE html>
    <html lang="zh-TW">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>網頁模版</title>
          <link rel="stylesheet" href="css/normalize.css">
          <!-- Swiper css -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
          <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
          ${cleanHtml}
          <!-- jquery -->
          <script src="js/jquery-3.7.1.min.js"></script>
          <!-- Swiper -->
          <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
          <!-- js -->
          ${scriptTags}
      </body>
    </html>`;

  zip.file("index.html", finalTemplate);

  const content = await zip.generateAsync({ type: "blob" });
  const downloadUrl = URL.createObjectURL(content);

  //建立暫時下載連結
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "my_project.zip";

  document.body.appendChild(link);
  link.click();

  //清理暫時下載連結
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  //重置預覽區
  clearPreview();
}
//重置預覽區
function clearPreview() {
  currentLayout = [];
  renderToIframe();
  closePreview();
}
//使用者導覽
function startUserGuide() {
  const driver = window.driver.js.driver;
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#tabs-wrap",
        popover: {
          title: "選擇類別",
          description: "在這裡切換不同的網頁區塊模板。",
        },
      },
      {
        element: ".choose-item",
        popover: {
          title: "新增組件",
          description: "點擊新增按鈕，組件就會即時出現在右側預覽區。",
        },
      },
      {
        element: "#show-preview-btn",
        popover: {
          title: "預覽組合",
          description: "組合好的組件可在這邊預覽",
        },
      },
    ],
  });

  driverObj.drive();
}

//預覽區導覽
function startPreviewGuide() {
  const driver = window.driver.js.driver;
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#toolbar",
        popover: {
          title: "裝置切換",
          description: "模擬手機或平板視角，確保網頁完美適配。",
        },
      },
      {
        element: "#render",
        popover: {
          title: "打包下載",
          description: "一鍵下載完整的 HTML 專案壓縮檔！",
        },
      },
    ],
  });

  driverObj.drive();
}

//按下幫助按鈕後顯示引導
function help() {
  const helpBtn = document.getElementById("help-btn");
  helpBtn.addEventListener("click", () => {
    if (preview.style.display === "flex") {
      startPreviewGuide();
    } else {
      startUserGuide();
    }
  });
}

$(document).ready(function () {
  init();

  //若使用者第一次進入網頁則顯示引導
  if (!localStorage.getItem("guide_seen")) {
    setTimeout(() => {
      startUserGuide();
    }, 500);
    localStorage.setItem("guide_seen", "true");
  }
  help();

  addItem();
  delItem();
  //將html轉譯成json
  const transferHtml = ``;
  console.log(JSON.stringify(transferHtml));
});
