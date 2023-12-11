import { Response } from "express";

export const BadRequest400 = (res: Response, data?: any) =>
  res.status(400).json({
    message: "Malformed request",
    ...data,
  });

export const InternalServerError500 = (res: Response, data?: any) =>
  res.status(500).json({
    message: "Internal Server Error",
    ...data,
  });

export const NotFound404 = (res: Response, data?: any) =>
  res.status(404).json({
    message: "Resource not found",
    ...data,
  });
