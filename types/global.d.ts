interface IUser {
  _id: string;
  __v: number;
  publicName: string;
  username: string;
  password: string;
  avatar?: string;
  description?: string;
  follows: string[];
  visited: string[];
  savedPosts: string[];
}

interface IPost {
  _id: string;
  __v: number;
  author: string;
  images: string[];
  text: string;
  likedBy: string[];
  timestamp: string;
}

interface IComment {
  _id: string;
  __v: number;
  author: IUser;
  post: string;
  text: string;
  likedBy: string[];
  timestamp: string;
}
