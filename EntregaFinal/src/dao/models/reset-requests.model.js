import { Schema, model } from "mongoose";

const collection = "ResetRequests";

const schema = new Schema({

  createdAt: { type: Schema.Types.Date, default: Date.now },
  expiresAt: { type: Schema.Types.Date, default: () => Date.now() + 3600000 },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const ResetRequestsModel = model(collection, schema);
export default ResetRequestsModel;
