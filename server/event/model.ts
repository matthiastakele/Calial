import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Event
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Event on the backend. Note: background, deletable, resizable, draggable 
export type Event = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  start: string;
  end: string;
  title: string;
  content: string;
  class: string;
  background: boolean;
  deletable: boolean;
  resizable: boolean;
  draggable: boolean;
};

export type PopulatedEvent = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  start: string;
  end: string;
  title: string;
  content: string;
  class: string;
  background: boolean;
  deletable: boolean;
  resizable: boolean;
  draggable: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Events stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EventSchema = new Schema<Event>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The start time of the event
  start: {
    type: String,
    required: true
  },
  // The end time of the event
  end: {
    type: String,
    required: true
  },
  // The event title
  title: {
    type: String,
  },
  // accepts free HTML
  content: {
    type: String,
  },
  // The event class
  class: {
    type: String,
  },
  // background
  background: {
    type: Boolean,
  },
  // force undeletable when events are editable
  deletable: {
    type: Boolean,
  },
  // force resizable when events are editable
  resizable: {
    type: Boolean,
  },
  // force undeletable when events are editable
  draggable: {
    type: Boolean,
  }
});

const EventModel = model<Event>('Event', EventSchema);
export default EventModel;
