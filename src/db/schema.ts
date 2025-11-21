import { integer, jsonb, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const processStatusEnum = pgEnum('process_status', [
  'PENDING',
  'STARTED',
  'DATA_FETCH_FAILED',
  'VALIDATING',
  'RUNNING_CHECKS',
  'COMPLETED',
  'FAILED',
]);

export const fieldProcessStatusEnum = pgEnum('field_status', [
  'PENDING',
  'DATA_MISSING',
  'APPROVAL',
  'NON_COMPLIANCE',
]);

export const dataSnapshot = pgTable('data_snapshot', {
  id: serial('id').primaryKey(),
  fieldId: varchar('field_id', { length: 50 }).notNull(),
  farmerInputs: jsonb('farmer_inputs').notNull(),
  remoteSensing: jsonb('remote_sensing').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const processRun = pgTable('process_run', {
  id: serial('id').primaryKey(),
  fieldId: varchar('field_id', { length: 50 }).notNull(),
  dataSnapshotId: integer('data_snapshot_id').references(() => dataSnapshot.id),
  fieldProcessingStatusId: integer('field_processing_status_id').references(
    () => fieldProcessingStatus.id,
  ),
  status: processStatusEnum('status').notNull().default('PENDING'),
  workflowMetadata: jsonb('workflow_metadata').$type<{
    workflowId: string;
    executionId: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const fieldProcessingStatus = pgTable('field_processing_status', {
  id: serial('id').primaryKey(),
  fieldId: varchar('field_id', { length: 50 }).notNull(),
  status: fieldProcessStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
