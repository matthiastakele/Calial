import mongoose from 'mongoose';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import FreetModel from '../freet/model';

/**
 * This files contains a class that has the functionality to explore comments
 * stored in MongoDB, including adding, finding, updating, and deleting comments.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in Circle. https://mongoosejs.com/docs/typescript.html
 */
class CommentCollection {
  /**
   * Add a comment to a freet
   *
   * @param {string} freetId - The id of a freet
   * @return {Promise<HydratedDocument<Comment>>} - The newly created Comment
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const comment = new CommentModel({
      userId,
      freetId,
      content
    });

    await comment.save(); // Saves comment to MongoDB
    return comment.populate('userId');
  }

  /**
   * Delete a comment from a freet
   *
   * @param {string} freetId - The id of a freet
   * @return {Promise<Boolean>} - true if the Comment has been deleted, false otherwise
   */
   static async deleteOne(commentId: Types.ObjectId | string): Promise<Boolean> {
    const comment = await CommentModel.findOneAndDelete({_id: commentId});
    return comment !== null;
  }

/**
   * Get Comments by userId
   *
   * @param {string} userId - The id of the user to find
   * @return {Promise<HydratedDocument<Comment>>} - The Comments with the given userId, if any
   */
 static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
  return CommentModel.find({userId: userId});
}

/**
   * Get Comments by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Comment>>} - The Comments with the given freetId, if any
   */
 static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
  return CommentModel.find({freetId: freetId});
}

/**
   * Check if user commented a freet
   *
   * @param {string} userId - The id of the user to find
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Comment>>} - The Comment with the given freetId, if any
   */
 static async findIfUserCommentedFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Boolean> {
  const comment = await CommentModel.findOne({userId: userId, freetId: freetId});
  return comment != null;
}
}

export default CommentCollection;

