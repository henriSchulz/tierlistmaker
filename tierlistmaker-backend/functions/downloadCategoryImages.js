const {CATEGORIES} = require("./lib/Categories.js");
const {scrapeImages} = require("./lib/scraper.js");
const fs = require('fs');
const axios = require('axios');

const dist = "../../tierlistmaker-frontend/src/assets/categories/images/";
const dist2 = "../../tierlistmaker-frontend/src/assets/categories/"

if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, {recursive: true});
}

function getMimeTypeFromArrayBuffer(arrayBuffer) {
    const uint8arr = new Uint8Array(arrayBuffer)

    const len = 4
    if (uint8arr.length >= len) {
        let signatureArr = new Array(len)
        for (let i = 0; i < len; i++)
            signatureArr[i] = (new Uint8Array(arrayBuffer))[i].toString(16)
        const signature = signatureArr.join('').toUpperCase()

        switch (signature) {
            case '89504E47':
                return 'png'
            case '47494638':
                return 'gif'
            case 'FFD8FFDB':
            case 'FFD8FFE0':
                return 'jpeg'
            default:
                return null
        }
    }
    return null
}




const downloadCategoryImages = async () => {
    const dir = fs.readdirSync(dist)

    const REPLACEMENTS = {
        "CELEBRITIES": "Walk of Fame",
        "CULTURE": "Theatre",
        "MEMES": "Drake Meme",
        "POLITICS": "White House",
        "FASHION": "t-shirt",
        "Music": "Steinway Grand Piano",
    }


    if (dir.length === CATEGORIES.length) {
        console.log("[INFO]: All categories already exist. Skipping...");
        return;
    }

    for (const category of CATEGORIES) {

        if (dir.find(file => file.startsWith(category + "."))) {
            // console.log("[INFO]: " + category + " already exists. Skipping...");
            continue;
        }


        let q = ""
        if (REPLACEMENTS[category]) {
            q = REPLACEMENTS[category];
        } else {
            q = category
        }

        const images = await scrapeImages(q);


        if (images.length === 0) {
            console.log("[ERROR]: No images found for: " + q);
            continue;
        }

        // random between 0 and 10

        const random = Math.floor(Math.random() * 5);

        const image = images[random]; // {src, title}


        const response = await axios.get(image.src, {responseType: 'arraybuffer'});

        const buffer = Buffer.from(response.data, 'binary');
        const mimeType = getMimeTypeFromArrayBuffer(buffer);


        fs.writeFileSync(dist + category + "." + mimeType, buffer);


        console.log("[SUCCESS]: Downloaded: " + category + "." + mimeType);


    }
}

const generateImportMap = () => {
    const rootPath = "@/assets/categories/images/";
    const files = fs.readdirSync(dist);


    let map = files.map(file => `import ${file.split(".")[0]} from "${rootPath + file}";`).join("\n");

    map += "\n\nexport default {\n" + files.map(file => `    ${file.split(".")[0]},`).join("\n") + "\n};";

    fs.writeFileSync(dist2 +"categoryImages.ts", map)
}

downloadCategoryImages().then(() => {
    generateImportMap();
})
