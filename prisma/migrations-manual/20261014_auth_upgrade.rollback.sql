-- 回滚：仅删除本轮新增结构（不影响既有数据）
DROP TABLE IF EXISTS "AuthAuditLog";
DROP TABLE IF EXISTS "AuthVerificationCode";
DROP TABLE IF EXISTS "UserIdentity";
ALTER TABLE "User" DROP COLUMN IF EXISTS "authVersion";
ALTER TABLE "User" DROP COLUMN IF EXISTS "avatarUrl";
ALTER TABLE "User" DROP COLUMN IF EXISTS "lastLoginAt";
ALTER TABLE "User" DROP COLUMN IF EXISTS "nickname";
