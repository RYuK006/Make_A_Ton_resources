import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRepository extends Document {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    ownerId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const RepositorySchema = new Schema<IRepository>({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    language: { type: String, default: "Unknown" },
    languageColor: { type: String, default: "#6366f1" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

const Repository: Model<IRepository> =
    mongoose.models.Repository ??
    mongoose.model<IRepository>("Repository", RepositorySchema);

export default Repository;
