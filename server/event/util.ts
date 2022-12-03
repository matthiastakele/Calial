import type {HydratedDocument} from 'mongoose';
import type {Event, PopulatedEvent} from '../event/model';

type EventResponse = {
  _id: string;
  author: string;
  start: string;
  end: string;
  title: string;
  content: string;
  class: string;
};

/**
 * Transform a raw Event object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Event>} event - A event
 * @returns {EventResponse} - The event object formatted for the frontend
 */
const constructEventResponse = (event: HydratedDocument<Event>): EventResponse => {
  const eventCopy: PopulatedEvent = {
    ...event.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = eventCopy.authorId;
  delete eventCopy.authorId;
  return {
    ...eventCopy,
    _id: eventCopy._id.toString(),
    author: username,
    start: event.start,
    end: event.end,
    title: event.title,
    content: event.content,
    class: event.class
  };
};

export {
  constructEventResponse
};
