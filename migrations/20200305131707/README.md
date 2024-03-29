# Migration `20200305131707`

This migration has been generated by omar-gamel at 3/5/2020, 1:17:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "day" text   ;

ALTER TABLE "public"."User" ADD FOREIGN KEY ("day") REFERENCES "public"."Day"("id") ON DELETE SET NULL

DROP TABLE "public"."UserCourseDay";

DROP TABLE "public"."UserPathCourse";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200304174159..20200305131707
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
@@ -143,22 +143,23 @@
 // _______________________
 model Day {
-  id          String       @id @default(cuid())
-  rank        Int
-  title       String
-  slug        String       @unique
-  course      Course
-  description String
-  attachments String[]
-  lectures    Lecture[]
-  assignments Assignment[]
-  comments    Comment[]
-  reviews     DayReview[]
-  isActive    Boolean      @default(true)
-  createdAt   DateTime     @default(now())
-  updatedAt   DateTime     @updatedAt
+  id           String       @id @default(cuid())
+  rank         Int
+  title        String
+  slug         String       @unique
+  course       Course
+  description  String
+  attachments  String[]
+  lectures     Lecture[]
+  assignments  Assignment[]
+  comments     Comment[]
+  reviews      DayReview[]
+  isActive     Boolean      @default(true)
+  availableFor User[]
+  createdAt    DateTime     @default(now())
+  updatedAt    DateTime     @updatedAt
 }
 model Lecture {
   id        String   @id @default(cuid())
@@ -325,9 +326,9 @@
 }
 enum PaymentMethods {
   CREDIT_CARD BANK_ACCOUNT PAYPAL WESTERN_UNION AMAN VODAFONE_CASH MOBI_CASH
-} 
+}
 // _______________________
 model Purchase {
@@ -372,47 +373,29 @@
 // _______________________
 model UserCourse {
-  id              String          @id @default(cuid())
+  id              String    @id @default(cuid())
   user            User
   course          Course
-  days            UserCourseDay[]
   watchedLectures Lecture[]
-  progress        Int             @default(0)
-  createdAt       DateTime        @default(now())
-  updatedAt       DateTime        @updatedAt
+  progress        Int       @default(0)
+  createdAt       DateTime  @default(now())
+  updatedAt       DateTime  @updatedAt
 }
-model UserCourseDay {
-  id        String   @id @default(cuid())
-  day       Day
-  isActive  Boolean  @default(false)
-  createdAt DateTime @default(now())
-  updatedAt DateTime @updatedAt
-}
-
 // _______________________
 model UserPath {
-  id              String           @id @default(cuid())
+  id              String    @id @default(cuid())
   user            User
   path            Path
-  userPathCourses UserPathCourse[]
   watchedLectures Lecture[]
-  progress        Int              @default(0)
-  createdAt       DateTime         @default(now())
-  updatedAt       DateTime         @updatedAt
+  progress        Int       @default(0)
+  createdAt       DateTime  @default(now())
+  updatedAt       DateTime  @updatedAt
 }
-model UserPathCourse {
-  id        String          @id @default(cuid())
-  course    Course
-  days      UserCourseDay[]
-  createdAt DateTime        @default(now())
-  updatedAt DateTime        @updatedAt
-}
-
 // _______________________
 model SiteDetail {
   id                 String   @id @default(cuid())
@@ -529,9 +512,9 @@
 model NotificationModel {
   id        String   @id @default(cuid())
   name      String
-  slug      String   
+  slug      String
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
 }
```


