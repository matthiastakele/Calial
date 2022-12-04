import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CircleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as circleValidator from '../circle/middleware';
import UserCollection from '../user/collection';
// import * as util from './util';

const router = express.Router();

/**
 * Create a new circle.
 *
 * @name POST /api/circles
 *
 * @param {string} circleName - The name of the circle
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.doesCircleNameExist
  ],
  async (req: Request, res: Response) => {
    console.log('wee');
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const circle = await CircleCollection.addOne(userId, req.body.circleName);

    res.status(201).json({
      message: 'Your circle was created successfully.',
      circle: circle
    });
  }
);

/**
 * Delete a circle
 *
 * @name DELETE /api/circles/:circleId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
router.delete(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteOne(req.params.circleId);
    res.status(200).json({
      message: 'Your circle was deleted successfully.'
    });
  }
);

/**
 * Add a user to a circle
 *
 * @name PUT /api/circles/:circleId?/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
 router.put(
  '/:circleId?/users',
  [
    userValidator.isUserLoggedIn,
    circleValidator.doesUsernameExist
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.addUser(req.params.circleId, req.body.username);
    res.status(200).json({
      message: `You added ${req.body.username} to the circle successfully.`
    });
  }
);

/**
 * Add self to circle
 *
 * @name PUT /api/circles/self
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
 router.put(
  '/self',
  [],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const circle = await CircleCollection.findByName(req.body.circleName);
    await CircleCollection.addUser(circle._id, user.username);
    res.status(200).json({
      message: `You added ${userId} to the circle successfully.`
    });
  }
);

/**
 * Delete a user to a circle
 *
 * @name DELETE /api/circles/:circleId/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
 router.delete(
  '/:circleId?/users/:username?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.doesUsernameExist
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteUser(req.params.circleId, req.params.username);
    res.status(200).json({
      message: `You deleted ${req.params.username} from the circle successfully.`
    });
  }
);

/**
 * Get all users for a circle
 *
 * @name GET /api/circles/:circleId/users
 *
 * @return {CircleResponse} - A dictionary of users and freets associated with circle
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:circleId?/users',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    //const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const users = await CircleCollection.findAllUsersByCircleId(req.params.circleId);
    res.status(200).json({
      users
    });
  }
);

/**
 * Add a freet to a circle
 *
 * @name PUT /api/circles/:circleId?/freets
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
 router.put(
  '/:circleId?/freets',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.addFreet(req.params.circleId, req.body.freetId);
    res.status(200).json({
      message: `You added freet to the circle successfully.`
    });
  }
);

/**
 * Delete a freet from a circle
 *
 * @name DELETE /api/circles/:circleId/freets/:freetId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the circleId is not valid
 */
 router.delete(
  '/:circleId?/freets/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteFreet(req.params.circleId, req.params.freetId);
    res.status(200).json({
      message: `You deleted freet from the circle successfully.`
    });
  }
);

/**
 * Get all freets for a circle
 *
 * @name GET /api/circles/:circleId/users
 *
 * @return {CircleResponse} - A dictionary of users and freets associated with circle
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/:circleId?/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const freets = await CircleCollection.findAllFreetsByCircleId(req.params.circleId);
    res.status(200).json({
      freets
    });
  }
);

/**
 * Get all circles of the user.
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse} - A dictionary of users and freets associated with circle
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const circles = await CircleCollection.findAllByUserId(userId);
    res.status(200).json(circles);
  }
);

export {router as circleRouter};
