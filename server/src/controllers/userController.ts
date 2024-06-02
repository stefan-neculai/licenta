import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mongoose from 'mongoose';

const jwtSecret = 'your_jwt_secret';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).send('User already exists with the given email'); // 409 Conflict
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture : "",
      bio : ""
    });
    await newUser.save();
    res.status(201).send('Sign up successful');
  } catch (err: any) {
    res.status(500).send('Error signing up: ' + err.message);
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send('User not found'); // Use 404 if no user found
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send('Invalid credentials'); // Use a more general message
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email, username : user.username, profilePicture : user.profilePicture }, jwtSecret, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).send('Error logging in: ' + err.message);
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).json(user);
  }
  catch (err: any) {
    res.status(500).send('Error getting user: ' + err.message);
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email, password, profilePicture, bio } = req.body;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    if(username)
      user.username = username;
    if(email)
      user.email = email;
    if(password)
      user.password = password;
    if(profilePicture)
      user.profilePicture = profilePicture;
    if(bio)
      user.bio = bio;
    await user.save();
    res.status(200).send('User updated successfully');
  }
  catch (err: any) {
    res.status(500).send('Error updating user: ' + err.message);
  }
}

export const addGameToFavorites = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { gameId } = req.body;
  try {
    const user = await User.findOne({ _id : id });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.favoriteGames.push(new mongoose.Types.ObjectId(gameId));
    await user.save();
    res.status(200).send('Game added to favorites');
  }
  catch (err: any) {
    res.status(500).send('Error adding game to favorites: ' + err.message);
  }
}


