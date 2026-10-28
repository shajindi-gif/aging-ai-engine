// 老人健康资料的对象级授权（P0：家庭成员关系 ≠ 自动授权）
// 规则：平台角色（ADMIN/OPERATOR）全量；其余仅「档案归属人 userId」或「同机构 organizationId」。
import prisma from "@/lib/db";

export type SessionLite = {
  user?: { id?: string; role?: string } | null;
};

const PLATFORM_ROLES = new Set(["ADMIN", "OPERATOR"]);

export function isPlatformStaff(session: SessionLite): boolean {
  return PLATFORM_ROLES.has(String(session?.user?.role || ""));
}

/** 供列表查询用的 Prisma where 片段：非平台角色只能看自己创建或本机构的档案 */
export async function elderScopeWhere(session: SessionLite): Promise<Record<string, unknown>> {
  const uid = session?.user?.id;
  if (!uid) return { id: "__none__" }; // 不可枚举
  if (isPlatformStaff(session)) return {};
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { organizationId: true } });
  const or: Record<string, unknown>[] = [{ userId: uid }];
  if (me?.organizationId) or.push({ organizationId: me.organizationId });
  return or.length > 1 ? { OR: or } : or[0];
}

/** 单个老人档案的访问判定；elder 不存在与无权均返回 false（调用方给 404 防枚举） */
export async function canAccessElder(session: SessionLite, elderlyId: string): Promise<boolean> {
  const uid = session?.user?.id;
  if (!uid || !elderlyId) return false;
  const elder = await prisma.elderlyProfile.findUnique({
    where: { id: elderlyId },
    select: { userId: true, organizationId: true },
  });
  if (!elder) return false;
  if (isPlatformStaff(session)) return true;
  if (elder.userId && elder.userId === uid) return true;
  if (elder.organizationId) {
    const me = await prisma.user.findUnique({ where: { id: uid }, select: { organizationId: true } });
    if (me?.organizationId && me.organizationId === elder.organizationId) return true;
  }
  return false;
}
