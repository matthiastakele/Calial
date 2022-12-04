import type {HydratedDocument, Types} from 'mongoose';
import type {Event} from './model';
import EventModel from './model';
import UserCollection from '../user/collection';
import { NIL } from 'uuid';

/**
 * This files contains a class that has the functionality to explore events
 * stored in MongoDB, including adding, finding, updating, and deleting events.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Event> is the output of the EventModel() constructor,
 * and contains all the information in Event. https://mongoosejs.com/docs/typescript.html
 */
class EventCollection {
  /**
   * Add a event to the collection
   *
   * @param {string} authorId - The id of the author of the event
   * @param {string} content - The id of the content of the event
   * @return {Promise<HydratedDocument<Event>>} - The newly created event
   */
  static async addOne(authorId: Types.ObjectId | string, title: string, startdate: string, enddate: string, content: string): Promise<HydratedDocument<Event>> {
    const event = new EventModel({
      authorId: authorId,
      title: title,
      start: startdate,
      end: enddate,
      content: content
    });
    await event.save(); // Saves event to MongoDB
    return event.populate('authorId');

  }

  /**
   * Find a event by eventId
   *
   * @param {string} eventId - The id of the event to find
   * @return {Promise<HydratedDocument<Event>> | Promise<null> } - The event with the given eventId, if any
   */
  static async findOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    return EventModel.findOne({_id: eventId}).populate('authorId');
  }

  /**
   * Find a event by start and end time
   *
   * @param {string} startdate - The start date
   * @param {string} enddate - The start date
   * @return {Promise<HydratedDocument<Event>> | Promise<null> } - The event with the given startdate and enddate, if any
   */
   static async findIfTaken(startdate: string, enddate: string): Promise<Boolean> {
    return EventModel.findOne({start: startdate, end: enddate}).populate('authorId') != null;
  }
  /**
   * Get all the events in the database
   *
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    // Retrieves events and sorts them from most to least recent
    return EventModel.find({}).populate('authorId');
    // return EventModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the events in by given author
   *
   * @param {string} username - The username of author of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Event>>> {
    const author = await UserCollection.findOneByUsername(username);
    return EventModel.find({authorId: author._id}).populate('authorId');
  }

   /**
   * Get all the events in by given author
   *
   * @param {string} userId - The userId of author of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
    static async findAllByUserId(userId: string): Promise<Array<HydratedDocument<Event>>> {
      return EventModel.find({authorId: userId}).populate('authorId');
    }

    /**
   * Update a event with the new content. Every time *any* part of the event is changed, we can just call this.
   *
   * @param {string} eventId - The id of the event to be updated
   * @param {string} start - The new start of the event
   * @param {string} end - The new title of the event
   * @param {string} title - The new title of the event
   * @return {Promise<HydratedDocument<Event>>} - The newly updated event
   */
     static async updateOne(eventId: Types.ObjectId | string, title: string, start: string, end: string, content: string): Promise<HydratedDocument<Event>> {
      const event = await EventModel.findOne({_id: eventId});
      event.content = content;
      event.start = start;
      event.end = end;
      event.title = title;
      //event.dateModified = new Date();
      await event.save();
      return event.populate('authorId');
    }

  /**
   * Delete a event with given eventId.
   *
   * @param {string} eventId - The eventId of event to delete
   * @return {Promise<Boolean>} - true if the event has been deleted, false otherwise
   */
  static async deleteOne(eventId: Types.ObjectId | string): Promise<boolean> {
    const event = await EventModel.deleteOne({_id: eventId});
    return event !== null;
  }

  /**
   * Delete all the events by the given author
   *
   * @param {string} authorId - The id of author of events
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await EventModel.deleteMany({authorId});
  }
}

export default EventCollection;
