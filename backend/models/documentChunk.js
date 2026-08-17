import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true
        },

        pageNumber: {
            type: Number,
            default: 0
        },

        chunkIndex: {
            type: Number,
            required: true
        },

        embedding: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true
    }
);

documentChunkSchema.index({
    documentId: 1,
    chunkIndex: 1
});

const DocumentChunk = mongoose.model(
    'DocumentChunk',
    documentChunkSchema
);

export default DocumentChunk;