-- Add berat (weight in kg) to PenjualanItem; price is calculated from weight, not piece count
ALTER TABLE "PenjualanItem" ADD COLUMN berat REAL NOT NULL DEFAULT 0;
