-- The initial migration already includes this column. Keep this migration
-- safe for databases where that initial migration has already been applied.
ALTER TABLE "Certification" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
