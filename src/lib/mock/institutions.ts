import type { Institution } from "@/lib/types";

const prefixes = ["阳光","和睦","康乐","仁爱","幸福","颐和","温馨","福寿","安康","长青","松柏","银杏","夕阳","和顺","福康","寿星","德馨","慈爱","金秋","晚晴"];
const suffixes = ["养老院","护理院","康复中心","社区养老服务站","日间照料中心","陪诊服务公司","居家护理团队","适老化改造服务中心"];
const iTypes: Institution["institutionType"][] = ["nursing_home","nursing_facility","rehab_center","community_station","day_care","escort_company","home_care_team","renovation_vendor"];
const svcTags = [["日间照料","助餐","文娱"],["医疗护理","康复","长期照护"],["康复训练","理疗","运动康复"],["社区服务","助餐","活动"],["日托","午餐","社交"],["陪诊","代取药","就医协助"],["上门服务","生活照料","慢病管理"],["扶手安装","防滑处理","无障碍改造"]];
const regions = ["上海市浦东新区","上海市徐汇区","上海市静安区","上海市长宁区","上海市黄浦区","上海市区","北京市海淀区","北京市朝阳区","深圳市南山区","深圳市罗湖区","杭州市西湖区","杭州市上城区","苏州市姑苏区","广州市天河区","成都市锦江区","武汉市武昌区","南京市鼓楼区","重庆市渝北区","天津市和平区","西安市雁塔区"];

export const mockInstitutions: Institution[] = Array.from({ length: 80 }, (_, i) => {
  const idx = i % 20;
  const sIdx = i % 8;
  const beds = [200,150,80,0,30,0,0,0][sIdx] + (i % 5) * 20;
  const dm = 10 + ((i * 13 + 7) % 86);
  const pi = 10 + ((i * 17 + 11) % 81);
  return {
    id: `INS-${String(i + 1).padStart(3, "0")}`,
    name: `${prefixes[idx]}${suffixes[sIdx]}`,
    region: regions[i % regions.length],
    address: `${regions[i % regions.length]}某某路${200 + i * 5}号`,
    institutionType: iTypes[sIdx],
    bedCount: beds,
    serviceTags: svcTags[sIdx],
    operatorName: `${surnames(i)}有限公司`,
    contactName: `${["陈","王","李","赵","刘","张","周","吴","杨","黄"][i % 10]}${["经理","主任","院长","主管","总监"][i % 5]}`,
    contactPhone: `1${3 + (i % 7)}${String(40000000 + i * 3456789).slice(0, 8)}`,
    sourceUrl: `https://www.example.com/institution/${i + 1}`,
    digitalMaturityScore: dm,
    purchaseIntentScore: pi,
    createdAt: `2024-${String((i % 12) + 1).padStart(2, "0")}-01T08:00:00Z`,
    updatedAt: `2025-${String((i % 6) + 1).padStart(2, "0")}-15T10:00:00Z`,
  };
});

function surnames(i: number): string {
  return ["阳光养老","和睦健康","康乐服务","仁爱医养","幸福居家","颐和生活","温馨照护","福寿康养","安康医养","长青服务","松柏健康","银杏养老","夕阳红","和顺护理","福康居家","寿星服务","德馨医养","慈爱护理","金秋康养","晚晴服务"][i % 20];
}
