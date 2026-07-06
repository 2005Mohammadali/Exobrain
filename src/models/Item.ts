import mongoose from 'mongoose';

interface IChunk{
    textChunk: string,
    embedding: number[]
}

interface IItem extends mongoose.Document{
    userId: string,
    title?: string,
    category: 'bookmark'| 'video'| 'dump',
    content: string,
    deadline?: Date,
    chunks: IChunk[],
    isArchived: boolean,
    createdAt: Date,
    updatedAt: Date
};

const itemSchema = new mongoose.Schema({
        userId: {type: String, required: true},
        title: {type: String},
        category: {
            type: String,
            enum: ['bookmark', 'video', 'dump'],
            default: 'dump'
        },
        content: {type: String, required: true},
        deadline: {type: Date},
        chunks: [{
            textChunk: {type: String, required: true},
            embedding: {type: [Number], required: true}
        }],
        isArchived: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

const ItemModel = mongoose.model<IItem>("Item", itemSchema);
export default ItemModel;