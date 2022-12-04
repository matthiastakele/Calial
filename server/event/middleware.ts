import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EventCollection from '../event/collection';

const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const event = validFormat ? await EventCollection.findOne(req.params.freetId) : '';
  if (!event) {
    res.status(404).json({
      error: `Event does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidEventContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Event content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Event content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

// /**
//  * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
// const isValidEventModifier = async (req: Request, res: Response, next: NextFunction) => {
//   const event = await EventCollection.findOne(req.params.eventId);
//   const userId = event.authorId._id;
//   if (req.session.userId !== userId.toString()) {
//     res.status(403).json({
//       error: 'Cannot modify other users events.'
//     });
//     return;
//   }

//   next();
// };

export {
  isValidEventContent,
  isEventExists
  //isValidEventModifier
};
