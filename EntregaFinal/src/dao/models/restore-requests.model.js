import { Schema, model } from "mongoose";

const collection = "RestoreRequests";

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 3600000
  },  // Expire after 1 hour
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const restoreRequestsModel = model(collection, schema);
export default restoreRequestsModel;
