# Migration `20200302103024`

This migration has been generated by omar-gamel at 3/2/2020, 10:30:24 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Playlist" ADD COLUMN "slug" text  NOT NULL DEFAULT '';

CREATE UNIQUE INDEX "Playlist.slug" ON "public"."Playlist"("slug")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200301191755..20200302103024
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgresql://postgres:root@localhost:5432/mydb?schema=public"
 }
 generator client {
   provider = "prisma-client-js"
@@ -472,8 +472,9 @@
 model Playlist {
   id          String         @id @default(cuid())
   name        String
+  slug        String         @unique
   description String
   image       String
   items       PlaylistItem[]
   isActive    Boolean        @default(true)
```

