import { Router } from 'express';
import validate from 'express-validation';

import * as postController from './post.controller';
import { authJwt } from '../../services/auth.services';
import postValidation from './post.validation';

const routes = new Router();

// Create new post.
routes.post(
  '/',
  authJwt,
  validate(postValidation.createPost),
  postController.createPost
);

// Get a single post.
routes.get('/:id', postController.getPostById);

// Get all posts.
routes.get('/', postController.getPostsList);

// Patch a post.
routes.patch(
  '/:id',
  authJwt,
  validate(postValidation.updatePost),
  postController.updatePost
);

// Delete a post.
routes.delete('/:id', authJwt, postController.deletePost);

// Favorites
routes.post('/:id/favorite', authJwt, postController.favoritePost);

export default routes;
