import mongoose from 'mongoose';
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore circles
 * stored in MongoDB, including adding, finding, updating, and deleting circles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in Circle. https://mongoosejs.com/docs/typescript.html
 */
class CircleCollection {
  /**
   * Add an empty circle to the collection
   *
   * @param {string} userId - The id of the author of the circle
   * @param {string} name - The id of the name of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly created circle
   */
  static async addOne(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Circle>> {
    const circle = new CircleModel({
      userId: userId,
      name: name,
      users: new Array<Types.ObjectId>(),
      freets: new Array<Types.ObjectId>()
    });
    await circle.save(); // Saves circle to MongoDB
    return circle.populate('userId');
  }

  /**
   * Delete a circle with given circleId.
   *
   * @param {string} circleId - The circleId of circle to delete
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
   static async deleteOne(circleId: Types.ObjectId | string): Promise<boolean> {
    const circle = await CircleModel.deleteOne({_id: circleId});
    return circle !== null;
  }

  /**
   * Find a circle by circleId
   *
   * @param {string} circleId - The id of the circle to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The circle with the given circleId, if any
   */
  static async findOne(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({_id: circleId}).populate('userId');
  }
 /**
   * Find a circle by circleName
   *
   * @param {string} circleName - The id of the circle to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The circle with the given circleName, if any
   */
  static async findByName(circleName: string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({name: circleName}).populate('userId');
  }
  /**
   * Get all the circles in the database
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    // Retrieves circles
    return CircleModel.find({}).populate('userId');
  }

  /**
   * Get all the circles by given author
   *
   * @param {string} username - The username of author of the circles
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CircleModel.find({userId: author._id}).populate('userId');
  }

  static async findGroups(username: string): Promise<Array<HydratedDocument<Circle>>> {
    // const author = await UserCollection.findOneByUsername(username);
    return CircleModel.find({users: username}).populate('users');
  }

    /**
   * Get all the circles by given author
   *
   * @param {string} userId - The userId of author of the circles
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
     static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>> {
      return CircleModel.find({userId: userId}).populate('userId');
    }

  /**
   * Get all the users by circle id
   * @param {string} circleId - The id of the circle
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
     static async findAllUsersByCircleId(circleId: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>> {
      const circle = await CircleModel.findOne({circleId: circleId});
      return circle.users;
    }

    static async findAllUsersByCircleName(circleName: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>> {
      const circle = await CircleModel.findOne({name: circleName});
      return circle.users;
    }

  /**
   * Get all the freets by circle id
   * @param {string} circleId - The id of the circle
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
   static async findAllFreetsByCircleId(circleId: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>> {
    const circle = await CircleModel.findOne({circleId: circleId});
    return circle.freets;
  }
    

  /**
   * Delete all the circles by the given author
   *
   * @param {string} userId - The id of author of circle
   */
   static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await CircleModel.deleteMany({userId: userId});
  }

  /**
   * Add a new user to a circle
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} username - The username of the new user
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async addUser(circleId: Types.ObjectId | string, username: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    var mongoose = require('mongoose');
    const user = await UserCollection.findOneByUsername(username);
    circle.users.push(user._id);
    await circle.save();
    return circle.populate('userId');
  }

  /**
   * Delete a user from a circle
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} userId - The new content of the freet
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
   static async deleteUser(circleId: Types.ObjectId | string, username: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    var mongoose = require('mongoose');
    const user = await UserCollection.findOneByUsername(username);
    const index = circle.users.indexOf(user._id);
    if (index !== -1) {
      circle.users.splice(index, 1);
    }
    await circle.save();
    return circle.populate('userId');
  }

  /**
   * Add a new freet to a circle
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
   static async addFreet(circleId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    var mongoose = require('mongoose');
    circle.freets.push(mongoose.Types.ObjectId(freetId));
    await circle.save();
    return circle.populate('userId');
  }

  /**
   * Delete a freet from a circle
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} viewerId - The id of the freet
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
   static async deleteFreet(circleId: Types.ObjectId | string, freetId: string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    var mongoose = require('mongoose');
    const index = circle.users.indexOf(mongoose.Types.ObjectId(freetId));
    if (index !== -1) {
      circle.users.splice(index, 1);
    }
    await circle.save();
    return circle.populate('userId');
    
  }

}

export default CircleCollection;
