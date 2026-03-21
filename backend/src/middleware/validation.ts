import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const contactValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required")
    .isLength({ min: 3, max: 200 }).withMessage("Subject must be 3-200 characters"),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 2000 }).withMessage("Message must be 10-2000 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.type === "field" ? (e as any).path : "unknown", message: e.msg })),
      });
    }
    next();
  },
];
