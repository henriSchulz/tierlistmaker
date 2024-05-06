import OpenAI from "openai"
import puppeteer from "puppeteer"
import {generateModelId} from "./utils";
import {app} from "./app";
import axios from "axios";
import {scrapeImages} from "./scraper";
import TierlistItem from "./types/dbmodel/TierlistItem";
import TierlistRow from "./types/dbmodel/TierlistRow";
import Tierlist from "./types/dbmodel/Tierlist";
import sharp from "sharp";

function parseArgs() {
    const args = process.argv.slice(2)
    let command = args[0]
    let values = args.slice(1)
    return {command, args: values}
}

async function writeAITierlistDescription(openai: OpenAI, name: string) {
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: "You are writing short descriptions for a tierlist maker website for a specific topic. That topic is " + name + ". The description should be short and concise. The description should contain keywords for SEO  but be natural"
        }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content
}

async function scrapeTemplateImages(name: string, url: string): Promise<{ src: string, title: string }[]> {
    console.log("Scraping images for " + name + " from " + url)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(url);
    await page.waitForSelector('.draggable-filler');

    const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.draggable-filler')).map((img) => {
            return {
                src: (img as HTMLImageElement).src, //remove last 3 chars
                title: (img as HTMLImageElement).src!.split("/")!.pop()!
                    .replace("png", "")
                    .replace("jpg", "")
                    .replace("jpeg", "")
                    .replace(".jpeg", "")
                    .replace(".png", "")
                    .replace(".jpg", "")
                    .replace(/_/g, " ")
                    .replace(/-/g, " ")
            }
        })
    });

    await browser.close();

    return images
}


export async function adminScripts() {

    const {command, args} = parseArgs()

    if (!command) {
        console.log("No command provided")
        return
    }


    const openai = new OpenAI({
        apiKey: "sk-proj-Sug2RAZJ9n1eUXiK8lOxT3BlbkFJMYLhfFI0ktcXXtdyukcl"
    });

    if (command === "scrape") {

        if (args.length < 4) {
            console.log("Missing arguments")
            return
        }

        const [url, categoryId, imageNames, ...nameParts] = args

        const name = nameParts.join(" ")
        const images = await scrapeTemplateImages(name, url)

        const showImageNames = imageNames === "true"

        const TIERS = ["S", "A", "B", "C", "D"]

        const description = await writeAITierlistDescription(openai, name)

        const tierlist: Tierlist = {
            id: generateModelId(),
            name,
            description: description ?? "",
            public: true,
            showImageNames,
            categoryId,
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
            clientId: "zqipBEEnHOhsL7ytfzYA9QZJF4Z2"
        }

        await app.db.collection("tierlists").doc(tierlist.id).set(tierlist)

        console.log("Added tierlistwith id " + tierlist.id + " to database...")


        let i = 0
        for (const tier of TIERS) {
            const rowId = generateModelId()
            const row: TierlistRow = {
                id: rowId,
                tierlistId: tierlist.id,
                name: tier,
                clientId: "zqipBEEnHOhsL7ytfzYA9QZJF4Z2",
                rowNumber: i
            }

            await app.db.collection("tierlistRows").doc(row.id).set(row)
            console.log("Added " + tier + " to " + name + "...")
            i++;
        }

        let x = 1
        for (const img of images) {
            const itemId = generateModelId()

            const item: TierlistItem = {
                id: itemId,
                name: img.title,
                tierlistId: tierlist.id,
                clientId: "zqipBEEnHOhsL7ytfzYA9QZJF4Z2",
            }

            const response = await axios({
                url: img.src,
                method: 'GET',
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0'
                }
            })

            const buffer = await sharp(Buffer.from(response.data, 'binary')).toFormat("png").resize(100, 100).toBuffer()

            app.bucket.file(`${tierlist.id}/items/${itemId}.png`).save(buffer, {
                contentType: 'image/png'
            })


            await app.db.collection("tierlistItems").doc(item.id).set(item)
            console.log(`Added ${img.title} to ${name}... (${((x / images.length) * 100).toFixed(2)}%)`)

            x++;


        }


        const coverImages = await scrapeImages(name);


        if (coverImages.length === 0) {
            console.log("[ERROR]: No cover images found for: " + name);

        }

        const random = Math.floor(Math.random() * 5);

        const image = coverImages[random]; // {src, title}


        const response = await axios.get(image.src, {responseType: 'arraybuffer'});

        const buffer = await sharp(Buffer.from(response.data, 'binary')).toFormat("png").toBuffer()

        await app.bucket.file(`${tierlist.id}/cover.png`).save(buffer, {
            contentType: 'image/png'
        })

        console.log("Added cover image to " + name + "...")


    }


}