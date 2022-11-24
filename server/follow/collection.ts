import mongoose from 'mongoose';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import FreetModel from '../freet/model';

/**
 * This files contains a class that has the functionality to explore follow
 * stored in MongoDB, including adding, finding, updating, and deleting follows
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in Circle. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a new follow
   *
   * @param {string} followee - The id of a freet
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
  static async addOne(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      follower,
      followee,
    });
    const already_followed = await FollowCollection.findIfUserFollowed(follower, followee);
    if(!already_followed){
      await follow.save(); // Saves like to MongoDB
    }
    return follow.populate('follower');
  }

  /**
   * Delete a follow
   *
   * @param {string} followee - The id of a freet
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
   static async deleteOne(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<Boolean> {
    const follow = new FollowModel({
      follower,
      followee
    });
    const test = await FollowModel.findOneAndDelete({follower, followee});
    return test !== null;
  }

/**
   * Get all users following a given user
   *
   * @param {string} follower - The id of the user to find
   * @return {Promise<HydratedDocument<Follow>>} - The Follows with the given follower, if any
   */
 static async findAllFollowers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<User>>> {
  return FollowModel.find({followee: userId});
}

/**
   * Get all users a given user is following
   *
   * @param {string} followee - The id of the freet to find
   * @return {Promise<HydratedDocument<Follow>>} - The Follows with the given followee, if any
   */
 static async findAllFollowing(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<User>>> {
  return FollowModel.find({follower: userId});
}

/**
   * Check if user liked a freet
   *
   * @param {string} follower - The id of the user to find
   * @param {string} followee - The id of the freet to find
   * @return {Promise<HydratedDocument<Follow>>} - The Follow with the given followee, if any
   */
 static async findIfUserFollowed(follower: Types.ObjectId | string, followee: Types.ObjectId | string): Promise<Boolean> {
  const follow = await FollowModel.find({follower: follower, followee: followee});
  return follow.length != 0;
}
}

export default FollowCollection;

