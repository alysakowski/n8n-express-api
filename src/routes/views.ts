import { desc } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import { processRun } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const runs = await db
      .select()
      .from(processRun)
      .orderBy(desc(processRun.createdAt));
    res.render("index", { processRuns: runs });
  } catch (error) {
    console.error("Error fetching process runs:", error);
    res.status(500).render("index", {
      processRuns: [],
      error: "Failed to load process runs",
    });
  }
});

export default router;
