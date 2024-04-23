type UserAvatarTye = {
  name: string;
  image?: string;
};

type AuthStateType = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  password_confirmation?: string;
};

type AuthErrorType = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
};

type PostErrorType = {
  content?: string;
  image?: string;
};

// * Post type
type User = {
  id: string;
  name: string;
  username: string;
  email?: string;
  image?: string;
};

type PostType = {
  id: string;
  user_id: number;
  content: string;
  image?: string;
  comment_count: number;
  like_count: number;
  created_at: string;
  user: User;
  Comments: Array<CommentType>;
  Likes: Array<PostLikeType> | [];
};

type CommentType = {
  map(arg0: (comment: any, index: any) => React.JSX.Element | null): React.ReactNode;
  length: number;
  id: string;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
  user: User;
};

type AlbumType = {
	id: string;
	user_id: string; // btw ini kenapa yg lain user_id nya number dah?
	name: string;
	description: string;
	// tanpa yg gak perlu
	posts: { id: PostType['id']; image: string; }[];
};

type NotificationType = {
  id: string;
  user_id: number;
  toUser_id: string;
  content: string;
  created_at: string;
  user: User;
};

type ShowUserType = {
  name: string;
  id: string;
  email: string;
  username: string;
  image: string;
  Post: Array<PostType> | [];
  Comment: Array<CommentType> | [];
  Album: Array<AlbumType> | [];
};

type LikeType = {
  post_id: string;
  toUserId: string;
  status: string;
};

type PostLikeType = {
  id: string;
  post_id: number;
  user_id: number;
};
