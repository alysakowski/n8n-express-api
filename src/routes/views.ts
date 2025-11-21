import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import { fieldProcessingStatus, processRun } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const runs = await db
      .select({
        id: processRun.id,
        fieldId: processRun.fieldId,
        status: processRun.status,
        dataSnapshotId: processRun.dataSnapshotId,
        fieldProcessingStatusId: processRun.fieldProcessingStatusId,
        workflowMetadata: processRun.workflowMetadata,
        createdAt: processRun.createdAt,
        updatedAt: processRun.updatedAt,
        fieldStatus: fieldProcessingStatus.status,
      })
      .from(processRun)
      .leftJoin(
        fieldProcessingStatus,
        eq(processRun.fieldProcessingStatusId, fieldProcessingStatus.id)
      )
      .orderBy(desc(processRun.createdAt));

    const n8nBaseUrl = process.env.N8N_BASE_URL || "http://localhost:5678"

    res.render("index", { processRuns: runs, n8nBaseUrl });
  } catch (error) {
    console.error("Error fetching process runs:", error);
    res.status(500).render("index", {
      processRuns: [],
      error: "Failed to load process runs",
    });
  }
});

export default router;
