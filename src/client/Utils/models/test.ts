import mongoose, { Document, Model, Schema } from 'mongoose';

interface Test {
    UserID: string;
    Status: string;
}

interface TestDocument extends Test, Document {}

const TestSchema: Schema = new Schema({
    UserID: { type: String, required: true },
    Status: { type: String, required: true }
});

const Testm: Model<TestDocument> = mongoose.model<TestDocument>('Test', TestSchema);

export default Testm;
