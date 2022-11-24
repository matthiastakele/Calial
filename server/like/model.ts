import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model'

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  freetId: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true, 
    ref: "User"
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet"
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
