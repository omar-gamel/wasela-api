# Migration `20200303115614`

This migration has been generated by omar-gamel at 3/3/2020, 11:56:14 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200302163610..20200303115614
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
@@ -30,8 +30,9 @@
   orders                 Order[]
   purchases              Purchase[]
   userCourses            UserCourse[]
   userPaths              UserPath[]
+  userAssignments        UserAssignment[]
   reviews                Review[]
   events                 Event[]
   socialAccounts         SocialAccount[]
   notificationRecipients NotificationRecipient[]
```


