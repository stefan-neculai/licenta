export interface User {
  _id: string
  id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  follows: string[];
  followers: string[];
  // Add other user-related fields as needed
}