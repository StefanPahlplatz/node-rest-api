import HTTPStatus from 'http-status';

import Post from './post.model';
import User from '../users/user.model';

export async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_GATEWAY).json(e);
  }
}

export async function getPostById(req, res) {
  try {
    // Get the user and the post.
    const promise = await Promise.all([
      User.findById(req.user._id),
      Post.findById(req.params.id).populate('user'),
    ]);

    // Check if the post is in favorites.
    const favorite = promise[0]._favorites.isPostInFavorites(req.params.id);
    const post = promise[1];

    // Return the post with the favorite attribute.
    return res.status(HTTPStatus.OK).json({
      ...post.toJSON(),
      favorite,
    });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function getPostsList(req, res) {
  try {
    const limit = parseInt(req.query.limit, 0);
    const skip = parseInt(req.query.skip, 0);

    const promise = await Promise.all([
      User.findById(req.user._id),
      Post.list({ limit, skip }),
    ]);

    const posts = promise[1].reduce((prev, post) => {
      const favorite = promise[0]._favorites.isPostInFavorites(post._id);
      prev.push({
        ...post.toJSON(),
        favorite,
      });

      return prev;
    }, []);

    return res.status(HTTPStatus.OK).json(posts);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // If the user is not the author.
    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    // Patch the new values by looping over the supplied values.
    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    // Return OK and save the object.
    return res.status(HTTPStatus.OK).json(await post.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // If the user is not the author.
    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    post.remove();

    // Return OK and save the object.
    return res.sendStatus(HTTPStatus.NO_CONTENT);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function favoritePost(req, res) {
  try {
    const user = await User.findById(req.user._id);
    await user._favorites.posts(req.params.id);
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
