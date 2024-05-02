import express from 'express';
import {scrapeImages} from "../scraper";

// import puppeteer from 'puppeteer';


export async function getGoogleImages(req: express.Request, res: express.Response) {
    const q = req.query.q as string;
    if (!q) {
        return res.status(400).send(
            'Please provide a search query');
    }

    const images = await scrapeImages(q);
    if (images.length === 0) {
        return res.status(404).send('No images found');
    }
    return res.json(images);


}