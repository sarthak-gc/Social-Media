export interface UserI {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  pfp: string;
}

export interface PostI {
  postId: string;
  title: string;
  createdAt: string;
  images: {
    imageId: string;
    url: string;
  }[];
  user: {
    firstName: string;
    lastName: string;
    pfp: string;
    middleName?: string;
  };
}

export interface SentFriendRequestI {
  requestId: string;
  receiverId: string;
  createdAt: Date;
  receiver: {
    firstName: string;
    middleName: string;
    lastName: string;
    pfp: string;
  };
}

export interface ReceivedFriendRequestI {
  requestId: string;
  senderId: string;
  createdAt: Date;
  sender: {
    firstName: string;
    middleName: string;
    lastName: string;
    pfp: string;
  };
}
export interface PfpPropI {
  pfp: string;
  name: string;
  editable: boolean;
}
