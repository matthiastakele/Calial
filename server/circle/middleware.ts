import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CircleCollection from '../circle/collection';

/**
 * Checks if a username in req.body exists
 */
 const doesUsernameExist = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.body.username);
    if(user && (user?._id.toString() !== req.session.userId)){
      next();
      return;
    }
  
    if((user?._id.toString() === req.session.userId)){
      res.status(409).json({
        error: {
          username: 'Can not add yourself to a circle'
        }
      });
    }
    else{
      res.status(409).json({
        error: {
          username: 'Username does not exist'
        }
      });
    }
  };


const doesCircleNameExist = async (req: Request, res: Response, next: NextFunction) => {
    const circle = await CircleCollection.findByName(req.body.circleName);
    if(circle == null){
        next();
        return;
    }
    res.status(409).json({
    error: {
            cirleName: 'circle name already exists'
        }
    });
};

export {
    doesUsernameExist,
    doesCircleNameExist
};
