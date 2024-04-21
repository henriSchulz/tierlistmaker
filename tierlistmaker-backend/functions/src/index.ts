import * as functions from "firebase-functions";
import {app} from "./app";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config()

app.initServer()
const api = functions.https.onRequest(app.app)
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
export {api, create}