import express from "express";
import admin, {initializeApp, cert} from "firebase-admin/app";
import cors from "cors";
import {logger} from "./logger";
import {TierlistEntityStore} from "./stores/TierlistEntityStore";
import TierlistRowEntityStore from "./stores/TierlistRowEntityStore";
import TierlistItemEntityStore from "./stores/TierlistItemEntityStore";
import {Bucket} from "@google-cloud/storage"

const fileMiddleware = require('express-multipart-file-parser')

import {
    createTierlistTemplate,
    getMostVotedTemplatesByCategory,
    getMostVotedTierlists,
    getSearchTierlists,
    getTemplateCover,
    getTemplateItem,
    getTierlistTemplate,
    isTierlistVoted,
    unvoteTierlist,
    voteTierlist,
    addTemplateImages,
    deleteTemplateImages,
    updateTemplateInformation,
    updateTemplateCover, updateTemplateRows, getClientTemplates, deleteTemplate
} from "./routes/routes";
import VoteEntityStore from "./stores/VoteEntitxStore";
import {auth as authfn, authOptional, getUserProfile} from "./routes/auth";
import sitemap from "./routes/sitemap";
import {auth, firestore} from "firebase-admin";
import Auth = auth.Auth;
import Firestore = firestore.Firestore;
import {getAuth} from "firebase-admin/auth";
import {getStorage} from "firebase-admin/storage";
import {getFirestore} from "firebase-admin/firestore";
import {getGoogleImages} from "./routes/googleImages";


type Stores = {
    tierlists: TierlistEntityStore
    tierlistRows: TierlistRowEntityStore
    tierlistItems: TierlistItemEntityStore
    votes: VoteEntityStore
}

export default class Application {

    readonly app: express.Application;
    public readonly production: boolean;
    public readonly stores: Stores
    public admin: admin.App
    public auth: Auth
    public db: Firestore;
    public bucket: Bucket


    constructor(production: boolean, credentials: object) {
        this.app = express();
        this.stores = {} as Stores //initialize empty stores object to be filled later: initializeStores()
        this.production = production
        logger.info("Initializing Firebase...")
        this.admin = initializeApp({
            credential: cert(
                credentials
            ),
            storageBucket: "sandbox-655bf.appspot.com"
        })
        this.auth = getAuth(this.admin)
        this.db = getFirestore(this.admin)
        this.bucket = getStorage(this.admin).bucket()
    }

    private initializeStores() {
        logger.info("Initializing stores...")
        this.stores.tierlists = new TierlistEntityStore(this.db!)
        this.stores.tierlistRows = new TierlistRowEntityStore(this.db!)
        this.stores.tierlistItems = new TierlistItemEntityStore(this.db!)
        this.stores.votes = new VoteEntityStore(this.db!)

    }


    private initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(fileMiddleware);
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cors({origin: true}));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();

        });

    }

    private initializeRoutes() {
        logger.info("Initializing routes...")
        const router = express.Router()
        router.post("/create-template", authfn, createTierlistTemplate)
        router.get("/template/:tierlistId", authOptional, getTierlistTemplate)
        router.get("/cover-image/:tierlistId", getTemplateCover)
        router.get("/template-item-image/:tierlistId/:itemId", getTemplateItem)


        //vote routes
        router.get("/vote/:tierlistId", authfn, isTierlistVoted)
        router.post("/vote", authfn, voteTierlist)
        router.delete("/vote/:tierlistId", authfn, unvoteTierlist)

        //most viewed tierlists routes
        router.get("/tierlists", getSearchTierlists)
        router.get("/most-voted-tierlists", getMostVotedTierlists)
        router.get("/categories/most-voted/:id", getMostVotedTemplatesByCategory)


        //update routes

        router.post("/update-template-information", authfn, updateTemplateInformation)
        router.post("/add-template-images", authfn, addTemplateImages)
        router.post("/delete-template-images", authfn, deleteTemplateImages)
        router.post("/update-template-cover", authfn, updateTemplateCover)
        router.post("/update-template-rows", authfn, updateTemplateRows)


        router.get("/client-templates", authfn, getClientTemplates)

        router.delete("/delete-template/:tierlistId", authfn, deleteTemplate)

        router.get("/site-map.xml", sitemap)

        router.get("/profile/:id", getUserProfile)

        router.get("/image-search", getGoogleImages)

        this.app.use("/api", router)
    }

    initServer() {
        logger.info("Starting Tierlistmaker API...")
        this.initializeStores()
        this.initializeMiddleware()
        this.initializeRoutes()


    }
}

/*


Serialization of a tierlist create by a user:


/share/:tierlistId?data=rowId:itemId;itemId2;itemId3|rowId2:itemId4;itemId5;itemId6|rowId3:itemId7;itemId8;itemId9?

Example:






 */