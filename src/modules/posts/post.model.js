import mongoose, { Schema } from 'mongoose';
import slug from 'slug';
import uniqueValidator from 'mongoose-unique-validator';

const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'title is required!'],
    minLength: [3, 'title must be at least 3 characters'],
    unique: true,
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'text is required!'],
    minLength: [10, 'text must be at least 10 characters!'],
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

PostSchema.plugin(uniqueValidator, {
  message: '{VALUE} is already taken!',
});

PostSchema.pre('save', function (next) {
  this._slugify();
  next();
});

PostSchema.methods = {
  _slugify() {
    this.slug = slug(this.title);
  },
  toJSON() {
    return {
      _id: this._id,
      title: this.title,
      text: this.text,
      createdAt: this.createdAt,
      slug: this.slug,
      user: this.user,
      favoriteCount: this.favoriteCount,
    };
  },
};

PostSchema.statics = {
  createPost(args, user) {
    return this.create({
      ...args,
      user,
    });
  },
};

export default mongoose.model('Post', PostSchema);
