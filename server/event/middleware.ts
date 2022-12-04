import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EventCollection from '../event/collection';

/**
 * Checks if a event with eventId is req.params exists
 */
const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.eventId);
  const event = validFormat ? await EventCollection.findOne(req.params.eventId) : '';
  if (!event) {
    res.status(404).json({
      error: `Event with event ID ${req.params.eventId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the event in req.body is valid, i.e a valid time.
 */
const isValidEventContent = (req: Request, res: Response, next: NextFunction) => {
  const {start} = req.body as {start: string};
  const {end} = req.body as {end: string};  
  if (!start.trim() || !end.trim()) {
    res.status(400).json({
      error: 'Event time is not specified.'
    });
    return;
  }
  next();
};

/**
 * Checks if the current user is the author of the event whose eventId is in req.params
 * I don't think this one will ever be used.
 */
const isValidEventModifier = async (req: Request, res: Response, next: NextFunction) => {
  const event = await EventCollection.findOne(req.params.eventId);
  const userId = event.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' events.'
    });
    return;
  }

  next();
};

export {
  isValidEventContent,
  isEventExists,
  isValidEventModifier
};
