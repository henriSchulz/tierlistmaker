const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const OpenAI = require('openai');
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getStorage} = require("firebase-admin/storage");
const {scrapeImages} = require("./lib/scraper.js");


const ID_PROPERTIES = {
    length: 16, characters: 'abcdefghijklmnopqrstuvwxyz0123456789'
}

function generateModelId(length = ID_PROPERTIES.length) {
    const characters = ID_PROPERTIES.characters
    let id = '';

    for (let i = 0; i < length; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}

const serviceAccount = require("./src/keys/sandbox-655bf-firebase-adminsdk-8ijzk-d11014687d.json");

const app = initializeApp({
    credential: cert(serviceAccount), storageBucket: "tierlistmaker-2e01f.appspot.com"
});

const bucket = getStorage(app).bucket();

const db = getFirestore(app)

function parseArgs() {
    const args = process.argv.slice(2)
    let command = args[0]
    let values = args.slice(1)
    return {command, args: values}
}

const openai = new OpenAI({
    apiKey: "sk-proj-Sug2RAZJ9n1eUXiK8lOxT3BlbkFJMYLhfFI0ktcXXtdyukcl"
});

async function writeAITierlistDescription(name) {
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: "You are writing short descriptions for a tierlist maker website for a specific topic. That topic is " + name + ". The description should be short and concise. The description should contain keywords for SEO  but be natural"
        }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content
}

async function scrapeTemplateImages(name, url) {
    console.log("Scraping images for " + name + " from " + url)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(url);
    await page.waitForSelector('.draggable-filler');

    const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.draggable-filler')).map(img => {
            return {
                src: img.src, //remove last 3 chars
                title: img.src.split("/").pop().slice(0, -3)
            }
        })
    });

    await browser.close();

    return images
}


async function main() {

    const {command, args} = parseArgs()

    const getDist = (name) => {
        const dist = "../../scraped-images/" + name

        if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist, {recursive: true});
        }

        return dist
    }

    if (command === "scrape") {

        if (args.length < 3) {
            console.log("Missing arguments")
            return
        }

        const [url, categoryId, ...nameParts] = args

        const name = nameParts.join(" ")
        const images = await scrapeTemplateImages(name, url)

        const TIERS = ["S", "A", "B", "C", "D"]

        const description = await writeAITierlistDescription(name)

        const tierlist = {
            id: generateModelId(),
            name,
            description,
            public: true,
            showImageNames: false,
            categoryId,
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
            clientId: "zqipBEEnHOhsL7ytfzYA9QZJF4Z2"
        }

        await db.collection("tierlists").doc(tierlist.id).set(tierlist)

        console.log("Added tierlistwith id " + tierlist.id + " to database...")


        let i = 0
        for (const tier of TIERS) {
            const rowId = generateModelId()
            const row = {
                id: rowId,
                tierlistId: tierlist.id,
                name: tier,
                clientId: "zqipBEEnHOhsL7ytfzYA9QZJF4Z2",
                rowNumber: i
            }

            await db.collection("tierlistRows").doc(row.id).set(row)
            console.log("Added " + tier + " to " + name + "...")
            i++;
        }


        for (const img of images) {
            const writeStream = fs.createWriteStream(getDist(name) + "/" + img.title + ".png")

            const response = await axios({
                url: img.src,
                method: 'GET',
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0'
                }
            })

            response.data.pipe(writeStream)


            writeStream.on('finish', () => {
                console.log("Added " + img.title + " to " + name + "...")
            })


        }


        const coverImages = await scrapeImages(name);


        if (coverImages.length === 0) {
            console.log("[ERROR]: No cover images found for: " + name);

        }

        const random = Math.floor(Math.random() * 5);

        const image = coverImages[random]; // {src, title}


        const response = await axios.get(image.src, {responseType: 'stream'});

        const writeStream = fs.createWriteStream(getDist(name) + "/cover.png")

        response.data.pipe(writeStream)

        writeStream.on('finish', () => {
            console.log("Added cover image to " + name + "...")
        })


    }

    if (command === "rm") {
        if (args.length < 1) {
            console.log("Missing arguments")
            return
        }

        const [id] = args

        db.collection("tierlists").doc(id).delete()

        db.collection("tierlistRows").where("tierlistId", "==", id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete()
            })
        })

        db.collection("tierlistItems").where("tierlistId", "==", id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete()
            })
        })

    }

    if(command === "repair") {
        const [id] = args

        const items = await db.collection("tierlistRows").where("tierlistId", "==", id).get()

        let i = 0
        for(const item of items.docs) {
            item.ref.update({rowNumber: i})
            i++
        }

        console.log("Repaired " + i + " items")
    }


}


// main()

// main()