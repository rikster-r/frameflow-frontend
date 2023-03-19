interface IUser {
  _id: string;
  __v: number;
  publicName: string;
  username: string;
  password: string;
  avatar?: string;
  description?: string;
  follows: (string | IUser)[];
  visited: string[];
  savedPosts: string[];
}

interface IPost {
  _id: string;
  __v: number;
  author: string | IUser;
  images: string[];
  text: string;
  likedBy: IUser[];
  createdAt: string;
}

interface IComment {
  _id: string;
  __v: number;
  author: string | IUser;
  post: string | IPost;
  text: string;
  likedBy: IUser[];
  createdAt: string;
}
