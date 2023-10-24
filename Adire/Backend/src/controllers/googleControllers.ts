import { Request, Response } from 'express';

export const getHome = (req: Request, res: Response) => {
  res.render('home');
};

export const getLogin = (req: Request, res: Response) => {
  res.render('login');
};

export const getProfile = (req: Request, res: Response) => {
  res.render('profile', { user: req.user });
};
