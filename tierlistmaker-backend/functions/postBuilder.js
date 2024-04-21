const fs = require("fs")
const path = require("path")

const FROM = "src"
const fromPath = path.join(__dirname, FROM)
const TO = "lib"
const toPath = path.join(__dirname, TO)

console.log("Starting post-build process...")

const FOLDERS_TO_COPY = [
    "dynamic-meta-public",
    "public",
    "keys",
    "logs",
]


for (const folder of FOLDERS_TO_COPY) {
    fs.cpSync(path.join(fromPath, folder), path.join(toPath, folder), {recursive: true, force: true})
    console.log(`Copied ${folder} to ${toPath}`)
}

const index = path.join(toPath, "public", "index.html")

const dynamicMetaPublicIndex = path.join(toPath, "dynamic-meta-public", "index.html")

let dynamicMetaPublicIndexContent = fs.readFileSync(index, "utf8").toString()

const TITLE_PLACEHOLDER = "__TITLE__";
const DESCRIPTION_PLACEHOLDER = "__DESCRIPTION__";
const IMAGE_PLACEHOLDER = "__IMAGE__";
const URL_PLACEHOLDER = "__URL__";

console.log("Replacing placeholders in dynamic-meta-public/index.html")
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<title>.*?<\/title>/i, `<title>${TITLE_PLACEHOLDER}</title>`);
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<meta\s+name="description"\s+content="([^"]*)">/,
    `<meta name="description" content="${DESCRIPTION_PLACEHOLDER}">`);
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<meta\s+property="og:image"\s+content="([^"]*)">/,
    `<meta property="og:image" content="${IMAGE_PLACEHOLDER}">`);
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<meta\s+property="og:url"\s+content="([^"]*)">/,
    `<meta property="og:url" content="${URL_PLACEHOLDER}">`);
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<meta\s+property="og:title"\s+content="([^"]*)">/,
    `<meta property="og:title" content="${TITLE_PLACEHOLDER}">`);
dynamicMetaPublicIndexContent = dynamicMetaPublicIndexContent.replace(/<meta\s+property="og:description"\s+content="([^"]*)">/,
    `<meta property="og:description" content="${DESCRIPTION_PLACEHOLDER}">`);

fs.writeFileSync(dynamicMetaPublicIndex, dynamicMetaPublicIndexContent, "utf8")

console.log("Finished post-build process")









