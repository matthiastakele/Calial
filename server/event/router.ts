import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import EventModel from './model';
import EventCollection from './collection';
import * as userValidator from '../user/middleware';
import * as eventValidator from '../event/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the events
 *
 * @name GET /api/events
 *
 * @return {EventResponse[]} - A list of all the events sorted in descending
 *                      order by date modified
 */
/**
 * Get events by author.
 *
 * @name GET /api/events?author=username
 *
 * @return {EventResponse[]} - An array of events created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    console.log("hi")
    const allEvents = await EventCollection.findAll();
    const response = allEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    console.log('Looking for Events of a specific user');
    const authorEvents = await EventCollection.findAllByUsername(req.query.author as string);
    console.log('authorEvents: ');
    console.log(authorEvents);
    const response = authorEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new event.
 *
 * @name POST /api/events
 *
 * @param {string} content - The content of the event
 * @return {EventResponse} - The created event
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the event content is empty or a stream of empty spaces
 * @throws {413} - If the event content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isValidEventContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const events = await EventCollection.findAllByUserId(userId as string);
    let taken = false;
    for(const e of events){
      if(e.start == req.body.start && e.end == req.body.end){
        taken = true;
      }
    }
    if(!taken){
      const event = await EventCollection.addOne(userId, req.body.title, req.body.start, req.body.end, req.body.content);

      res.status(201).json({
        message: 'Your event was created successfully.',
        event: util.constructEventResponse(event)
      });
    }
  }
);

/**
 * Delete a event
 *
 * @name DELETE /api/events/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the event
 * @throws {404} - If the eventId is not valid
 */
router.delete(
  '/:eventId?',
  [
    userValidator.isUserLoggedIn
    //eventValidator.isEventExists
    //eventValidator.isValidEventModifier
  ],
  async (req: Request, res: Response) => {
    // const userId = (req.session.userId as string) ?? ''; 
    // const event = await EventModel.findOne({authorId: userId, start: req.body.start, end: req.body.end});
    // const id = event._id;
    await EventCollection.deleteOne(req.params.eventId);
    res.status(200).json({
      message: 'Your event was deleted successfully.'
    });
  }
);

/**
 * Modify a event
 *
 * @name PATCH /api/events/:id
 *
 * @param {string} content - the new content for the event
 * @return {EventResponse} - the updated event
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the event
 * @throws {404} - If the eventId is not valid
 * @throws {400} - If the event content is empty or a stream of empty spaces
 * @throws {413} - If the event content is more than 140 characters long
 */
router.patch(
  '/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists
    // eventValidator.isValidEventModifier,
    // eventValidator.isValidEventContent
  ],
  async (req: Request, res: Response) => {
    const event = await EventCollection.updateOne(req.params.eventId, req.body.title, req.body.start, req.body.end, req.body.content);
    res.status(200).json({
      message: 'Your event was updated successfully.',
      event: util.constructEventResponse(event)
    });
  }
);

export {router as eventRouter};
