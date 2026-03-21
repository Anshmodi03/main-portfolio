import { Router } from "express";
import { submitContact } from "../controllers/contactController";
import { contactValidation } from "../middleware/validation";
import { contactRateLimit } from "../middleware/rateLimit";

const router = Router();

router.post("/", contactRateLimit, contactValidation, submitContact);

export default router;
