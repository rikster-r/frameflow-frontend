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
  createdAt: string;
  updatedAt: string;
}

interface IPost {
  _id: string;
  __v: number;
  author: string | IUser;
  images: string[];
  text: string;
  likedBy: IUser[];
  createdAt: string;
  updatedAt: string;
}

interface IComment {
  _id: string;
  __v: number;
  author: string | IUser;
  post: string | IPost;
  text: string;
  likedBy: IUser[];
  createdAt: string;
  updatedAt: string;
}

interface INotification {
  _id: string;
  __v: number;
  from: IUser;
  to: IUser;
  action: "Like" | "Follow";
  data?: {
    likedPost?: IPost;
  };
  createdAt: string;
  updatedAt: string;
}
