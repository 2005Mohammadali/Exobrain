import {Request, Response} from 'express';
import ItemModel from '../models/Item';

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
        res.status(500).json({ error: error.message })
    }
}

export async function addLinkItem(req: Request, res: Response) {
    try {
        const url = new URL(req.body.url);
        const placeholderItem = {
            userId: req.body.userId,
            title: "Processing link...",
            url: url.toString(),
            content: "Extracting content for your AI brain...",
            category: url.hostname.includes("youtube.com") || url.hostname === "youtu.be" 
                ? ("video" as const) : ("bookmark" as const),
            chunks: [],
            isArchived: false
        }

        const createdDoc = await ItemModel.create(placeholderItem);

        res.status(201).send({
            msg: "Placeholder-item added successfully",
            itemId: createdDoc._id
        })

        //scraper and updating database logic here
        
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}