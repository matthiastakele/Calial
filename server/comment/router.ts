import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
// import * as util from './util';

const router = express.Router();

/**
 * Comment a freet.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The id of a freet
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    await CommentCollection.addOne(userId, req.body.freetId, req.body.content);
    res.status(200).json({
      message: 'You commented the freet successfully.',
    });
  }
);

/**
 * Uncomment from a freet.
 *
 * @name DELETE /api/likes
 *
 * @param {string} commentId - The id of a comment
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'You deleted the comment from the freet successfully.',
    });
  }
);

/**
 * Get comments for a freet.
 *
 * @name GET /api/comments/freets/:freetId
 *
 * @param {string} freetId - The id of a freet
 * @return {Array<Comment>} - comments
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 *
 */
 router.get(
  '/freets/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const comments = await CommentCollection.findAllByFreetId(req.params.freetId);
    // const count = likes.length;
    res.status(200).json({
      comments
    });
    
  }
);

/**
 * Get all comments for a user
 *
 * @name GET /api/comments/users/:userId
 *
 * @return {Array<Comment>} - comments
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 *
 */
 router.get(
  '/users/:userId?',
  [
  ],
  async (req: Request, res: Response) => {
    const comments = await CommentCollection.findAllByUserId(req.params.userId);
    //const count = likes.length;
    res.status(200).json({
      comments
    });
    
  }
);

export {router as commentRouter};
