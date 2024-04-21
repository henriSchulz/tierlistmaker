import express from "express";
import {app} from "../app";


export default async function (req: express.Request, res: express.Response) {
    const [tierlists, error] = await app.stores.tierlists.getAllBy("public", true)

    if (error) {
        res.status(500).send("Error fetching tierlists")
        return
    }


    const p = "https://tierlistmaker.org/create/:id"

    const getId = (name: string, id: string) => {
        return name.split(' ').join('-') + '-' + id
    }

    let siteMap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    for (let tierlist of tierlists) {
        const id = getId(tierlist.name, tierlist.id)
        const lastMod = new Date(tierlist.lastModifiedAt).toISOString()
        siteMap += `<url>
                        <loc>${p.replace(':id', id)}</loc>
                        <changefreq>daily</changefreq>
                        <lastmod>${lastMod}</lastmod>
                    </url>`
    }

    siteMap += `</urlset>`

    res.setHeader('Content-Type', 'application/xml');
    res.send(siteMap);

}