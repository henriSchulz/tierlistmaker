import express from "express";
import {generateModelId} from "../utils";
import {logger} from "../logger";
import sharp from "sharp";
import TierlistItem from "../types/dbmodel/TierlistItem";
import TierlistRow from "../types/dbmodel/TierlistRow";
import {app} from "../app";
import Vote from "../types/dbmodel/Vote";
import {CATEGORIES} from "../Categories";
import FileUpload from "../types/FileUpload";


export async function getTemplateCover(req: express.Request, res: express.Response) {
    const {tierlistId} = req.params as { tierlistId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    const file = app.bucket.file(`${tierlistId}/cover.png`)

    const [exists] = await file.exists()
    if (!exists) return res.status(404).json({error: "Template image not found"})

    const [buffer] = await file.download()

    res.setHeader('Content-Type', `image/png`);
    return res.send(buffer);
}

export async function getTemplateItem(req: express.Request, res: express.Response) {

    const {tierlistId, itemId} = req.params as { tierlistId: string, itemId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})
    if (!itemId) return res.status(422).json({error: "No itemId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }
    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})
    try {
        let isGif = itemId.startsWith("g_");
        let file;

        if (isGif) {
            file = app.bucket.file(`${tierlistId}/items/${itemId}.gif`)
        } else {
            file = app.bucket.file(`${tierlistId}/items/${itemId}.png`)
        }

        const [exists] = await file.exists()
        if (!exists) return res.status(404).json({error: "Template image not found"})
        const [buffer] = await file.download()
        res.setHeader('Content-Type', `image/${isGif ? "gif" : "png"}`);
        return res.send(buffer);
    } catch (e) {
        logger.error("Failed to get template image: " + e)
        return res.status(500).json({error: "Failed to get template image"})
    }
}

export async function getTierlistTemplate(req: express.Request, res: express.Response) {
    const client = req.client!

    const {tierlistId} = req.params as { tierlistId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)


    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})


    if (!tierlist.public && client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})


    const [tierlistRows, error__] = await app.stores.tierlistRows.getAllBy("tierlistId", tierlistId)

    if (error__) {
        logger.error("Failed to get tierlist rows: " + error__.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }
    const [tierlistItems, error_] = await app.stores.tierlistItems.getAllBy("tierlistId", tierlistId)

    if (error_) {
        logger.error("Failed to get tierlist items: " + error_.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    const [voteCount, error___] = await app.stores.votes.countBy("tierlistId", tierlistId)

    if (error___) {
        logger.error("Failed to get vote count: " + error___.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    return res.json({tierlist, tierlistRows, tierlistItems, votes: voteCount})

}

export async function createTierlistTemplate(req: express.Request, res: express.Response) {
    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    if (!req.files) return res.status(422).json({error: "No files uploaded"})


    const body = req.body as {
        name: string
        description: string
        categoryId: string
        "rowNames": string
        publicTemplate: number
        showImageNames: number
    }


    if (!body.name) return res.status(422).json({error: "No name provided"})
    if (!body.description) return res.status(422).json({error: "No description provided"})
    if (!body.categoryId) return res.status(422).json({error: "No categoryId provided"})

    let rowNames = body["rowNames"]
    if (!rowNames) return res.status(422).json({error: "No rowNames provided"})
    try {
        rowNames = JSON.parse(rowNames)
    } catch (e) {
        return res.status(422).json({error: "Invalid rowNames provided"})
    }

    if (!Array.isArray(rowNames)) return res.status(422).json({error: "rowNames must be an array"})
    if (rowNames.length < 3) return res.status(422).json({error: "Not enough row names provided"})
    if (rowNames.length > 8) return res.status(422).json({error: "Too many row names provided"})
    if (rowNames.some(name => name.length > 34)) return res.status(422).json({error: "Row names too long"})
    if (rowNames.some(name => name.length < 1)) return res.status(422).json({error: "Row names too short"})

    if (body.name.trim().length < 3) return res.status(422).json({error: "Name too short"})
    if (body.name.trim().length > 100) return res.status(422).json({error: "Name too long"})
    if (body.description.trim().length < 10) return res.status(422).json({error: "Description too short"})
    if (body.description.trim().length > 500) return res.status(422).json({error: "Description too long"})
    if (body.categoryId.trim().length === 0) return res.status(422).json({error: "No category selected"})
    if (!CATEGORIES.includes(body.categoryId)) return res.status(422).json({error: "Invalid category selected"})
    if (!body.publicTemplate) return res.status(422).json({error: "No publicTemplate provided"})
    if (!body.showImageNames) return res.status(422).json({error: "No showImageNames provided"})


    // @ts-ignore
    const coverImg = Object.values<FileUpload>(req.files).find((file: FileUpload) => file.fieldname === "coverImg")

    // @ts-ignore
    const templateImgs = Object.values<FileUpload>(req.files).filter((file: FileUpload) => file.fieldname === "templateImgs[]")


    if (!coverImg) return res.status(422).json({error: "No cover image uploaded"})
    if (!templateImgs) return res.status(422).json({error: "No template images uploaded"})


    if (templateImgs.length < 4) return res.status(422).json({error: "Not enough template images uploaded"})

    if (templateImgs.length > 50) return res.status(422).json({error: "Too many template images uploaded"})

    const coverImgSize = Buffer.byteLength(coverImg.buffer)
    if (coverImgSize > 10 * 1024 * 1024) return res.status(422).json({error: "Cover image too large"})

    for (const img of templateImgs) {
        const size = Buffer.byteLength(img.buffer)
        if (size > 10 * 1024 * 1024) return res.status(422).json({error: "Template image too large: " + img.originalname})
        // if (img.originalname.split(".")[0].length > 34) return res.status(422).json({error: "Template image name too long: " + img.originalname})
    }

    const sizeSum = templateImgs.reduce((acc, img) => acc + Buffer.byteLength(img.buffer), 0)

    if (sizeSum > 50 * 1024 * 1024) return res.status(422).json({error: "Template images too large"})

    const tierlistId = generateModelId()

    // save cover image file to tierlist folder

    try {
        const fileType = coverImg.originalname.split(".").pop()

        if (!fileType) return res.status(422).json({error: "Invalid cover image format"})
        // const allowedFileTypes = ["png", "jpg", "jpeg", "heic"]
        // if (!allowedFileTypes.includes(fileType.toLowerCase())) return res.status(422).json({error: "Invalid cover image format"})

        let buffer: Buffer = await sharp(coverImg.buffer).toFormat("png").resize(250, 250).png({
            compressionLevel: 3,
            force: true
        }).toBuffer()

        await app.bucket.file(`${tierlistId}/cover.png`).save(buffer, {contentType: `image/png`})
    } catch (e: any) {
        logger.error("Failed to save cover image: " + e.message)
        return res.status(500).json({error: "Failed to creat tierlist"})
    }


    const tierListItems: TierlistItem[] = []

    for (const img of templateImgs) {
        let itemId = generateModelId()
        try {
            const fileType = img.originalname.split(".").pop()

            if (!fileType) return res.status(422).json({error: "Invalid cover image format"})
            // const allowedFileTypes = ["png", "jpg", "jpeg", "gif", "heic"]
            // if (!allowedFileTypes.includes(fileType.toLowerCase())) return res.status(422).json({error: "Invalid cover image format"})


            let buffer: Buffer;
            let contentType: string;
            let path: string;

            if (fileType.toLowerCase() === "gif") {
                //remove first two characters
                itemId = "g_" + itemId.slice(2)
                buffer = img.buffer
                contentType = `image/gif`
                path = `${tierlistId}/items/${itemId}.gif`
            } else {
                buffer = await sharp(img.buffer).toFormat("png").resize(100, 100).png({
                    compressionLevel: 5,
                    force: true
                }).toBuffer()
                contentType = `image/png`
                path = `${tierlistId}/items/${itemId}.png`
            }

            await app.bucket.file(path).save(buffer, {contentType})


            let fileName = Buffer.from(img.originalname, 'latin1').toString('utf8');
            const fileExtension = fileName.split(".").pop()
            fileName = fileName.replace(`.${fileExtension}`, "")
            if (fileName.length > 34) fileName = fileName.slice(0, 34)

            const item: TierlistItem = {
                id: itemId,
                tierlistId,
                clientId: client.id,
                name: fileName,
            }
            tierListItems.push(item)
        } catch (e: any) {
            logger.error("Failed to save template image: " + e)
            return res.status(500).json({error: "Failed to creat tierlist"})
        }
    }

    const tierlistRows: TierlistRow[] = rowNames.map((name, index) => {
        return {
            id: generateModelId(),
            name,
            rowNumber: index,
            clientId: client.id,
            tierlistId
        }
    })


    const tierlist = {
        id: tierlistId,
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        clientId: client.id,
        public: Boolean(body.publicTemplate),
        showImageNames: Boolean(body.showImageNames),
        createdAt: Date.now(),
        lastModifiedAt: Date.now()
    }

    const error = await app.stores.tierlists.add(tierlist)
    if (error) {
        logger.error("Failed to create tierlist: " + error)
        return res.status(500).json({error: "Failed to creat tierlist"})
    }

    for (const row of tierlistRows) {
        const error = await app.stores.tierlistRows.add(row)
        if (error) {
            const error_ = await app.stores.tierlists.delete(tierlistId)
            if (error_) logger.error("Significant database error: Failed to delete tierlist after failed row creation:", error_.message)
            logger.error("Failed to create tierlist row: " + error.message)
            return res.status(500).json({error: "Failed to creat tierlist"})
        }
    }

    for (const item of tierListItems) {
        const error = await app.stores.tierlistItems.add(item)
        if (error) {
            const error_ = await app.stores.tierlists.delete(tierlistId)
            if (error_) logger.error("Significant database error: Failed to delete tierlist after failed item creation:", error_.message)
            logger.error("Failed to create tierlist item: " + error.message)
            return res.status(500).json({error: "Failed to creat tierlist"})
        }
    }

    logger.info(`Client(${client.email}) created tierlist(${tierlist.name})`)
    return res.status(200).json({tierlistId})
}

export async function isTierlistVoted(req: express.Request, res: express.Response) {
    const client = req.client!
    const {tierlistId} = req.params as { tierlistId: string }
    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})
    const [voted, error] = await app.stores.votes.isTierlistVoted(client.id, tierlistId)

    if (error) {
        logger.error("Failed to get vote: " + error.message)
        return res.status(500).json({error: "Failed to get vote"})
    }
    return res.json({voted: voted})
}

export async function voteTierlist(req: express.Request, res: express.Response) {
    const client = req.client!
    const {tierlistId} = req.body as { tierlistId: string }
    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [isAlreadyVoted, _error] = await app.stores.votes.isTierlistVoted(client.id, tierlistId)

    if (_error) {
        logger.error("Failed to get vote: " + _error.message)
        return res.status(500).json({error: "Failed to get vote"})
    }

    if (isAlreadyVoted) return res.status(422).json({error: "Tierlist already voted"})


    const vote: Vote = {
        id: generateModelId(),
        clientId: client.id,
        tierlistId,
    }
    const error = await app.stores.votes.add(vote)
    if (error) {
        logger.error("Failed to vote: " + error.message)
        return res.status(500).json({error: "Failed to vote"})
    }


    logger.info(`Client(${client.email}) voted tierlist(${tierlistId})`)
    return res.status(200).json({success: true})
}

export async function unvoteTierlist(req: express.Request, res: express.Response) {
    const client = req.client!
    const {tierlistId} = req.params as { tierlistId: string }
    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})
    const [isAlreadyVoted, _error] = await app.stores.votes.isTierlistVoted(client.id, tierlistId)

    if (_error) {
        logger.error("Failed to get vote: " + _error.message)
        return res.status(500).json({error: "Failed to get vote"})
    }

    if (!isAlreadyVoted) return res.status(422).json({error: "Tierlist not voted"})

    const error = await app.stores.votes.deleteBy("tierlistId", tierlistId, {clientId: client.id})
    if (error) {
        logger.error("Failed to unvote: " + error.message)
        return res.status(500).json({error: "Failed to unvote"})
    }
    logger.info(`Client(${client.email}) unvoted tierlist(${tierlistId})`)
    return res.status(200).json({success: true})
}

export async function getSearchTierlists(req: express.Request, res: express.Response) {

    const [tierlists, error] = await app.stores.tierlists.getAllBy("public", true)

    if (error) {
        logger.error("Failed to get tierlists: " + error.message)
        return res.status(500).json({error: "Failed to get tierlists"})
    }

    const tierlistNamesAndIds = tierlists.map(tierlist => {
        return {name: tierlist.name, id: tierlist.id}
    })

    return res.json({tierlists: tierlistNamesAndIds})
}


export async function getMostVotedTemplatesByCategory(req: express.Request, res: express.Response) {

    const {id: categoryId} = req.params as { id: string }

    if (!categoryId) return res.status(422).json({error: "No categoryId provided"})

    if (!CATEGORIES.includes(categoryId)) return res.status(422).json({error: "Invalid category"})

    const [_tl, error] = await app.stores.tierlists.getAllBy("categoryId", categoryId)

    const tierlists = _tl.filter(tierlist => tierlist.public)


    if (error) {
        logger.error("Failed to get tierlists: " + error.message)
        return res.status(500).json({error: "Failed to get tierlists"})
    }


    const tierlistVotes: Record<string, number> = {}

    for (const tierlist of tierlists) {
        const [votes, error] = await app.stores.votes.getAllBy("tierlistId", tierlist.id)
        if (error) {
            logger.error("Failed to get votes: " + error.message)
            return res.status(500).json({error: "Failed to get votes"})
        }
        tierlistVotes[tierlist.id] = votes.length
    }


    let sortedTierlistVotes = Object.entries(tierlistVotes).sort((a, b) => b[1] - a[1])

    const liteTierlists: { name: string, id: string }[] = []

    if (sortedTierlistVotes.length > 5) {
        sortedTierlistVotes = sortedTierlistVotes.slice(0, 5)
    }

    for (const [tierlistId] of sortedTierlistVotes) {
        const tierlist = tierlists.find(tierlist => tierlist.id === tierlistId)
        if (!tierlist) return res.status(500).json({error: "Failed to get tierlists"})
        liteTierlists.push({name: tierlist.name, id: tierlist.id})
    }

    return res.json({tierlists: liteTierlists})


}

export async function getMostVotedTierlists(req: express.Request, res: express.Response) {
    const [votes, error] = await app.stores.votes.getAll()
    if (error) {
        logger.error("Failed to get votes: " + error.message)
        return res.status(500).json({error: "Failed to get votes"})
    }

    if (votes.length === 0) return res.json({tierlists: []})


    const [tierlists, error_] = await app.stores.tierlists.getAllBy("public", true)

    if (error_) {
        logger.error("Failed to get tierlists: " + error_.message)
        return res.status(500).json({error: "Failed to get tierlists"})
    }

    const tierlistVotes: Record<string, number> = {}

    for (const tierlist of tierlists) {
        const votesForTierlist = votes.filter(vote => vote.tierlistId === tierlist.id)
        tierlistVotes[tierlist.id] = votesForTierlist.length
    }

    let sortedTierlistVotes = Object.entries(tierlistVotes).sort((a, b) => b[1] - a[1])

    const liteTierlists: { name: string, id: string }[] = []
    if (sortedTierlistVotes.length > 5) {
        sortedTierlistVotes = sortedTierlistVotes.slice(0, 5)
    }


    for (const [tierlistId] of sortedTierlistVotes) {
        const tierlist = tierlists.find(tierlist => tierlist.id === tierlistId)
        if (!tierlist) return res.status(500).json({error: "Failed to get tierlists"})
        liteTierlists.push({name: tierlist.name, id: tierlist.id})
    }

    return res.json({tierlists: liteTierlists})
}

export async function updateTemplateInformation(req: express.Request, res: express.Response) {
    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    const {
        tierlistId,
        name,
        description,
        publicTemplate
    } = req.body as { tierlistId: string, name?: string, description?: string, publicTemplate: boolean | string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})

    if (!name && !description && publicTemplate === undefined) return res.status(422).json({error: "No information provided to update"})


    let updateObject = {...tierlist, lastModifiedAt: Date.now()}

    if (name) {
        if (name.trim().length < 3) return res.status(422).json({error: "Name too short"})
        if (name.trim().length > 100) return res.status(422).json({error: "Name too long"})

        updateObject.name = name
    }

    if (description) {
        if (description.trim().length < 10) return res.status(422).json({error: "Description too short"})
        if (description.trim().length > 500) return res.status(422).json({error: "Description too long"})

        updateObject.description = description
    }

    if (publicTemplate !== undefined) {
        updateObject.public = Boolean(publicTemplate)
    }


    const error_ = await app.stores.tierlists.update(updateObject)

    if (error_) {
        logger.error("Failed to update tierlist: " + error_.message)
        return res.status(500).json({error: "Failed to update tierlist"})
    }
    //mention when change is made. name, description, public
    logger.info(`Client(${client.email}) updated tierlist(${tierlistId}) information: ${name ? "name" : ""} ${description ? "description" : ""} ${publicTemplate !== undefined ? "public" : ""}`)

    return res.status(200).json({success: true})


}

export async function addTemplateImages(req: express.Request, res: express.Response) {

    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    const {tierlistId} = req.body as { tierlistId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})

    if (!req.files) return res.status(422).json({error: "No files uploaded"})

    // @ts-ignore
    let templateImages = Object.values<FileUpload>(req.files).filter((file: FileUpload) => file.fieldname === "templateImgs[]")

    if (!templateImages) return res.status(422).json({error: "No template images uploaded"})

    if (!Array.isArray(templateImages)) templateImages = [templateImages]

    if (templateImages.length < 1) return res.status(422).json({error: "No template images uploaded"})

    if (templateImages.length > 50) return res.status(422).json({error: "Too many template images uploaded"})

    const [templateImagesCount, _error] = await app.stores.tierlistItems.countBy("tierlistId", tierlistId)

    if (_error) {
        logger.error("Failed to get tierlist item count: " + _error.message)
        return res.status(500).json({error: "Failed to get tierlist item count"})
    }

    if (templateImagesCount + templateImages.length > 200) return res.status(422).json({error: "Too many template images. Max 200 in a tierlist"})

    for (const img of templateImages) {
        let itemId = generateModelId()
        try {
            const fileType = img.originalname.split(".").pop()

            if (!fileType) return res.status(422).json({error: "Invalid cover image format"})
            // const allowedFileTypes = ["png", "jpg", "jpeg", "gif"]
            // if (!allowedFileTypes.includes(fileType.toLowerCase())) return res.status(422).json({error: "Invalid cover image format"})


            let buffer: Buffer;
            let contentType: string;
            let path: string;

            if (fileType.toLowerCase() === "gif") {
                itemId = "g_" + itemId.slice(2)
                buffer = img.buffer
                contentType = `image/gif`
                path = `${tierlistId}/items/${itemId}.gif`
            } else {
                buffer = await sharp(img.buffer).toFormat("png").resize(100, 100).png({
                    compressionLevel: 5,
                    force: true
                }).toBuffer()
                contentType = `image/png`
                path = `${tierlistId}/items/${itemId}.png`
            }


            await app.bucket.file(path).save(buffer, {contentType})

            let fileName = Buffer.from(img.originalname, 'latin1').toString('utf8');
            const fileExtension = fileName.split(".").pop()
            fileName = fileName.replace(`.${fileExtension}`, "")
            if (fileName.length > 34) fileName = fileName.slice(0, 34)

            const item: TierlistItem = {
                id: itemId,
                tierlistId,
                clientId: client.id,
                name: fileName,
            }

            const error = await app.stores.tierlistItems.add(item)
            if (error) {
                logger.error("Failed to save template image: " + error.message)
                return res.status(500).json({error: "Failed to save template image"})
            }
        } catch (e: any) {
            logger.error("Failed to save template image: " + e.message)
            return res.status(500).json({error: "Failed to save template image"})
        }
    }

    const error_ = await app.stores.tierlists.update({...tierlist, lastModifiedAt: Date.now()})

    if (error_) {
        logger.error("Failed to update tierlist: " + error_.message)
        return res.status(500).json({error: "Failed to update tierlist"})
    }

    logger.info(`Client(${client.email}) added template images to tierlist(${tierlistId})`)

    return res.status(200).json({success: true})

}

export async function deleteTemplateImages(req: express.Request, res: express.Response) {

    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    const {tierlistId, templateItemIds} = req.body as { tierlistId: string, templateItemIds: string[] }


    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})
    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})
    if (!templateItemIds) return res.status(422).json({error: "No templateItemIds provided"})
    if (!Array.isArray(templateItemIds)) return res.status(422).json({error: "templateItemIds must be an array"})

    for (const id of templateItemIds) {
        try {
            if (id.startsWith("g_")) {
                const file = app.bucket.file(`${tierlistId}/items/${id}.gif`)
                await file.delete()
            } else {
                const file = app.bucket.file(`${tierlistId}/items/${id}.png`)
                await file.delete()
            }


            const error = await app.stores.tierlistItems.delete(id, {clientId: client.id})
            if (error) {
                logger.error("Failed to delete template image: " + error.message)
                return res.status(500).json({error: "Failed to delete template image"})
            }
        } catch (e: any) {
            logger.error("Failed to delete template image: " + e.message)
            return res.status(500).json({error: "Failed to delete template image"})
        }
    }


    const error_ = await app.stores.tierlists.update({...tierlist, lastModifiedAt: Date.now()})
    if (error_) {
        logger.error("Failed to update tierlist: " + error_.message)
        return res.status(500).json({error: "Failed to update tierlist"})
    }


    logger.info(`Client(${client.email}) deleted template images from tierlist(${tierlistId})`)
    return res.status(200).json({success: true})

}

export async function updateTemplateCover(req: express.Request, res: express.Response) {
    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    const {tierlistId} = req.body as { tierlistId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})

    if (!req.files) return res.status(422).json({error: "No files uploaded"})

    // @ts-ignore
    const coverImg = Object.values<FileUpload>(req.files).find((file: FileUpload) => file.fieldname === "coverImg")

    if (!coverImg) return res.status(422).json({error: "No cover image uploaded"})

    if (Buffer.byteLength(coverImg.buffer) > 10 * 1024 * 1024) return res.status(422).json({error: "Cover image too large"})


    try {
        const file = app.bucket.file(`${tierlistId}/cover.png`)
        const [exists] = await file.exists()
        if (exists) await file.delete()
        else return res.status(404).json({error: "Cover image not found"})

    } catch (e: any) {
        logger.error("Failed to get tierlist files: " + e.message)
        return res.status(500).json({error: "Failed to update cover image"})
    }


    try {
        const fileType = coverImg.originalname.split(".").pop()

        if (!fileType) return res.status(422).json({error: "Invalid cover image format"})
        // const allowedFileTypes = ["png", "jpg", "jpeg"]
        // if (!allowedFileTypes.includes(fileType.toLowerCase())) return res.status(422).json({error: "Invalid cover image format"})

        let buffer: Buffer = await sharp(coverImg.buffer).toFormat("png").resize(250, 250).png({
            compressionLevel: 3,
            force: true
        }).toBuffer()

        await app.bucket.file(`${tierlistId}/cover.png`).save(buffer, {contentType: `image/png`})

        logger.info(`Client(${client.email}) updated cover image of tierlist(${tierlistId})`)
        return res.status(200).json({success: true})
    } catch (e: any) {
        logger.error("Failed to save cover image: " + e.message)
        return res.status(500).json({error: "Failed to save cover image"})
    }


}

export async function updateTemplateRows(req: express.Request, res: express.Response) {
    const client = req.client!

    if (!req.body) return res.status(422).json({error: "No body provided"})

    const {tierlistId} = req.body as {
        tierlistId: string,
        "updateRows": { id: string, name: string },
        "deleteRows": { id: string }[],
        "addRows": { name: string }[]
    }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    let updateRows: { id: string, name: string }[] | undefined
    let deleteRows: { id: string }[] | undefined
    let addRows: { name: string }[] | undefined

    try {
        updateRows = JSON.parse(req.body["updateRows"])
        deleteRows = JSON.parse(req.body["deleteRows"])
        addRows = JSON.parse(req.body["addRows"])
    } catch (e) {
        return res.status(422).json({error: "Invalid body"})
    }


    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})

    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})

    if (!updateRows && !deleteRows && !addRows) return res.sendStatus(200)

    const [rows, error_] = await app.stores.tierlistRows.getAllBy("tierlistId", tierlistId)

    if (error_) {
        logger.error("Failed to get tierlist rows: " + error_.message)
        return res.status(500).json({error: "Failed to get tierlist rows"})
    }

    if (updateRows && Array.isArray(updateRows)) {
        for (const updateRow of updateRows) {
            if (updateRow.name.length > 34) return res.status(422).json({error: "Row name too long"})
            const row: TierlistRow | undefined = rows.find(row => row.id === updateRow.id)
            if (!row) return res.status(404).json({error: "Row not found"})

            const error = await app.stores.tierlistRows.update({
                ...row,
                name: updateRow.name
            }, {clientId: client.id})

            if (error) {
                logger.error("Failed to update row: " + error.message)
                return res.status(500).json({error: "Failed to update row"})
            }
        }
    }


    if (deleteRows && Array.isArray(deleteRows)) {
        for (const deleteRow of deleteRows) {
            const row: TierlistRow | undefined = rows.find(row => row.id === deleteRow.id)
            if (!row) return res.status(404).json({error: "Row not found"})

            const error = await app.stores.tierlistRows.delete(deleteRow.id, {clientId: client.id})
            if (error) {
                logger.error("Failed to delete row: " + error.message)
                return res.status(500).json({error: "Failed to delete row"})
            }
        }
    }

    if (addRows && Array.isArray(addRows)) {
        let i = rows.length
        for (const addRow of addRows) {
            if (addRow.name.length > 34) return res.status(422).json({error: "Row name too long"})
            const row: TierlistRow | undefined = rows.find(row => row.name === addRow.name)
            if (row) return res.status(422).json({error: "Row name already exists"})

            const error = await app.stores.tierlistRows.add({
                id: generateModelId(),
                name: addRow.name,
                rowNumber: i,
                clientId: client.id,
                tierlistId
            })
            if (error) {
                logger.error("Failed to add row: " + error.message)
                return res.status(500).json({error: "Failed to add row"})
            }
            i++;
        }
    }

    const error__ = await app.stores.tierlists.update({...tierlist, lastModifiedAt: Date.now()})

    if (error__) {
        logger.error("Failed to update tierlist: " + error__.message)
        return res.status(500).json({error: "Failed to update tierlist"})
    }

    logger.info(`Client(${client.email}) updated rows of tierlist(${tierlistId})`)
    return res.status(200).json({success: true})
}

export async function getClientTemplates(req: express.Request, res: express.Response) {
    const client = req.client!

    const [tierlists, error] = await app.stores.tierlists.getAll({clientId: client.id})

    if (error) {
        logger.error("Failed to get tierlists: " + error.message)
        return res.status(500).json({error: "Failed to get tierlists"})
    }

    const liteTierlists = tierlists.map(tierlist => {
        return {name: tierlist.name, id: tierlist.id}
    })

    return res.json({tierlists: liteTierlists})
}

export async function deleteTemplate(req: express.Request, res: express.Response) {
    const client = req.client!

    const {tierlistId} = req.params as { tierlistId: string }

    if (!tierlistId) return res.status(422).json({error: "No tierlistId provided"})

    const [tierlist, error] = await app.stores.tierlists.get(tierlistId)

    if (error) {
        logger.error("Failed to get tierlist: " + error.message)
        return res.status(500).json({error: "Failed to get tierlist"})
    }

    if (!tierlist) return res.status(404).json({error: "Tierlist not found"})


    if (client.id !== tierlist.clientId) return res.status(403).json({error: "Unauthorized"})


    const error_ = await app.stores.tierlists.delete(tierlistId)
    if (error_) {
        logger.error("Failed to delete tierlist: " + error_.message)
        return res.status(500).json({error: "Failed to delete tierlist"})
    }


    // try {
    //     await app.bucket.file(`${tierlistId}.png`).delete()
    // } catch (e) {
    //     logger.error("Failed to delete tierlist cover image: " + e)
    //     return res.status(500).json({error: "Failed to delete tierlist"})
    // }

    try {
        await app.bucket.deleteFiles({
            prefix: `${tierlistId}/`
        })
    } catch (e) {
        logger.error("Failed to delete tierlist files: " + e)
        return res.status(500).json({error: "Failed to delete tierlist"})
    }

    const error___ = await app.stores.tierlistItems.deleteBy("tierlistId", tierlistId)

    if (error___) {
        logger.error("Failed to delete tierlist items: " + error___.message)
        return res.status(500).json({error: "Failed to delete tierlist"})
    }

    const error____ = await app.stores.tierlistRows.deleteBy("tierlistId", tierlistId)

    if (error____) {
        logger.error("Failed to delete tierlist rows: " + error____.message)
        return res.status(500).json({error: "Failed to delete tierlist"})
    }


    logger.info(`Client(${client.email}) deleted tierlist(${tierlistId})`)
    return res.status(200).json({success: true})
}
