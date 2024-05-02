import * as functions from "firebase-functions";
import {app} from "./app";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Tierlist from "./types/dbmodel/Tierlist";
import {stopWords} from "./stopwords";


dotenv.config()


app.initServer()
const api = functions.runWith({memory: "512MB"}).https.onRequest(app.app)


const getKeyWords = (tierlist: Tierlist): string => {
    const {name, description} = tierlist;

    const words: string[] = []

    const text = name + " " + description;

    const split = text.split(" ");

    split.forEach(word => {
        if (word.length > 2 && !stopWords.includes(word)) {
            words.push(word);
        }
    })

    return words.join(", ");
}


// @ts-ignore
const create = functions.https.onRequest(async (req, res) => {
    const splitPath = req.path.split("/");

    if (splitPath.length === 3 && splitPath[1] === "create") {
        const pathId = splitPath[2];

        if (!pathId.includes("-")) {
            console.log("Redirect: Invalid id")
            return res.redirect("/404")
        }

        const id = pathId.split("-").pop();

        if (!id) {
            console.log("Redirect: ID not found")
            return res.redirect("/404")
        }

        try {

            const [tierlist, error] = await app.stores.tierlists.get(id);

            if (error) {
                return res.send("Error:  Request failed: " + error);
            }

            if (!tierlist) {
                console.log("Redirect: Tierlist not found")
                return res.redirect("/404")
            }

            const {name, description} = tierlist;


            let data = fs.readFileSync(path.join(__dirname, "dynamic-meta-public", "index.html"), "utf8");

            data = data.replace(/__TITLE__/g, `Create a ${name} Tier List`);
            data = data.replace(/__DESCRIPTION__/g, description);
            data = data.replace(/__IMAGE__/g, `https://tierlistmaker.org/api/cover-image/${id}`);
            data = data.replace(/__URL__/g, `https://tierlistmaker.org/create/${pathId}`);
            data = data.replace(/__KEYWORDS__/g, getKeyWords(tierlist));

            //sendfile index.html with header text/html
            return res.setHeader('Content-Type', 'text/html').send(data);


        } catch (error) {
            return res.send("Error:  Request failed: " + error);
        }


    } else {
        console.log("Redirect: Invalid path structure")
        return res.redirect("/404")
    }
})

// @ts-ignore
const shared = functions.https.onRequest(async (req, res) => {
    const splitPath = req.path.split("/");

    if (splitPath.length === 3 && splitPath[1] === "shared") {
        const pathId = splitPath[2];

        if (!pathId.includes("-")) {
            console.log("Redirect: Invalid id")
            return res.redirect("/404")
        }

        const id = pathId.split("-").pop();

        if (!id) {
            console.log("Redirect: ID not found")
            return res.redirect("/404")
        }

        const createdBy = req.query["createdBy"] as string

        if (!createdBy) {
            console.log("Redirect: Created by not found")
            return res.redirect("/404")
        }
        const data = req.query["data"] as string

        if (!data) {
            console.log("Redirect: Data not found")
            return res.redirect("/404")
        }

        try {

            const [tierlist, error] = await app.stores.tierlists.get(id);

            if (error) {
                return res.send("Error:  Request failed: " + error);
            }

            if (!tierlist) {
                console.log("Redirect: Tierlist not found")
                return res.redirect("/404")
            }

            const {name} = tierlist;

            const user = await app.auth.getUser(createdBy)


            if (!user) {
                console.log("Redirect: User not found")
                return res.redirect("/404")
            }
            const userName = user.displayName?.split(" ")[0] ?? user.displayName ?? "User";


            let data = fs.readFileSync(path.join(__dirname, "dynamic-meta-public", "index.html"), "utf8");

            data = data.replace(/__TITLE__/g, `${userName}'s Ranking of ${name}`);
            data = data.replace(/__DESCRIPTION__/g, "This is a ranking of " + name + " created by " + userName);
            data = data.replace(/__IMAGE__/g, `https://tierlistmaker.org/api/cover-image/${id}`);
            data = data.replace(/__URL__/g, `https://tierlistmaker.org/shared/${pathId}?data=${data}&createdBy=${createdBy}`);
            data = data.replace(/__KEYWORDS__/g, getKeyWords(tierlist));

            //sendfile index.html with header text/html
            return res.setHeader('Content-Type', 'text/html').send(data);


        } catch (error) {
            return res.send("Error:  Request failed: " + error);
        }


    } else {
        console.log("Redirect: Invalid path structure")
        return res.redirect("/404")
    }
})


export {api, create, shared}