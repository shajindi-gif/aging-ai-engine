"use client";

export function PolicyDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`yc-disclaimer ${className}`}>
      <strong>政策免责声明：</strong>政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。
    </div>
  );
}

export function MedicalDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`yc-disclaimer yc-disclaimer-medical ${className}`}>
      <strong>医疗边界声明：</strong>本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。
    </div>
  );
}

export function DemoBadge({ className = "" }: { className?: string }) {
  return <span className={`yc-badge yc-badge-gold ${className}`}>Demo 数据</span>;
}
