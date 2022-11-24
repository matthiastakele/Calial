import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: Types.ObjectId;
  followee: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: User;
  followee: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  follower: {
    type: Schema.Types.ObjectId,
    required: true, 
    ref: "User"
  },
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
