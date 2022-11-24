import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model'

/**
 * This file defines the properties stored in a Comment
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Commenton the backend
export type Comment= {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
  content: string;
};

export type PopulatedComment= {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  freetId: Types.ObjectId;
  content: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Comments stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CommentSchema = new Schema<Comment>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true, 
    ref: "User"
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet"
  },
  content: {
    type: String,
    required: true
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
