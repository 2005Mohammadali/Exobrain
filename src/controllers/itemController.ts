import {Request, Response} from 'express';
import ItemModel from '../models/Item';
import { chunkText, extractBlogContent, extractYoutubeTranscript, titleScrapper } from '../utils/scrapper.js';

const handleControllerError = (res: Response, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message });
};

export async function addQuickItem(req: Request, res: Response) {
    try {
        const item = {
            userId: req.body.userId,
            title: req.body.title || "Quick Note",
            content: req.body.content,
            deadline: req.body.deadline || null,
            category: 'dump' as const,
            chunks: [],                     
            isArchived: false
        }
        
        await ItemModel.create(item);

        res.status(200).send({
            msg: "Item added successfully"
        })
        
    } catch (error:any) {
        handleControllerError(res, error);
    }
}

export async function addLinkItem(req: Request, res: Response) {
    try {
        const url = new URL(req.body.url);
        const urlStr = url.toString();

        const isYoutube = url.hostname.includes("youtube.com") || url.hostname === "youtu.be";  
        const category = isYoutube ? ("video" as const) : ("bookmark" as const);
        const placeholderItem = {
            userId: req.body.userId,
            title: "Processing link...",
            url: urlStr,    
            content: "Extracting content for your AI brain...",
            category,
            chunks: [],
            isArchived: false
        }

        const createdDoc = await ItemModel.create(placeholderItem);

        res.status(201).send({
            msg: "Placeholder-item added successfully",
            itemId: createdDoc._id
        });

        //scraper and updating database logic here
        (async () => {
            try {
                const [realTitle, realContent] = await Promise.all([
                    titleScrapper(urlStr),
                    category === "bookmark" ? await extractBlogContent(urlStr) : await extractYoutubeTranscript(urlStr)
                ])

                const rawChunks = chunkText(realContent);
                const formattedChunks = rawChunks.map(chunkStr => ({
                    textChunk: chunkStr,
                    embedding: [0, 0, 0]
                }));

                ItemModel.findByIdAndUpdate(createdDoc._id, {
                    title: realTitle,
                    content: realContent,
                    chunks: formattedChunks
                }).exec();
                console.log(`Successfully completed background processing for item: ${createdDoc._id}`);
            } catch (error) {
                console.log("Error scraping the content from URL");
                console.error(error);                
            }
        })();
        
        
    } catch (error:any) {
        if (!res.headersSent) {
            handleControllerError(res, error);
        }
    }
}

export async function getItems(req: Request, res: Response) {
    try {
        const id = req.query.userId;
        if(!id || typeof id !== 'string'){
            return res.status(400).json({
                msg: "Invalid userId"
            })
        }
        const items = await ItemModel.find({
            userId: id,
            isArchived: true
        })
        .sort({createdAt: -1})
        .exec();

        res.status(200).json({
            items
        })
    } catch (error) {
        handleControllerError(res, error);
    }
}