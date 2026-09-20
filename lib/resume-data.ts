export type Metric = {
  value: string;
  label: string;
  note?: string;
};

export type Profile = {
  name: string;
  englishName: string;
  role: string;
  roleEn: string;
  statement: string;
  email: string;
  phone: string;
  resumeHref: string;
  lifePhoto: string;
  keywords: string[];
};

export type ImageAsset = {
  src: string;
  alt: string;
  caption: string;
};

export type Experience = {
  index: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  keywords: string[];
  metrics: Metric[];
  groups: {
    label: "ACTION" | "PROCESS" | "RESULT";
    title: string;
    points: string[];
  }[];
  clients?: string[];
  images?: ImageAsset[];
};

export type Project = {
  index: string;
  title: string;
  eyebrow: string;
  period: string;
  keywords: string[];
  resultSummary: string[];
  challenge: string;
  insight: string;
  approach: string[];
  execution: string[];
  result: string[];
  images: ImageAsset[];
};

export type Skill = {
  index: string;
  title: string;
  shortTitle: string;
  what: string[];
  how: string[];
  evidence: string[];
};

export type Education = {
  school: string;
  degree: string;
  direction: string;
  graduation: string;
  gpa: string;
  ranking: string;
  scholarship: string;
  portrait: string;
  portraitAlt: string;
  courses: string[];
};

export type OtherWorkGroup = {
  title: string;
  caption: string;
  images: ImageAsset[];
};

export type VisualStyle = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  gap?: number;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  aspectRatio?: number;
  lockAspect?: boolean;
  rotation?: number;
  zIndex?: number;
  opacity?: number;
  borderRadius?: number;
};

export type VisualStyles = Record<string, VisualStyle>;

export const profile: Profile = {
  name: "郭耀薇",
  englishName: "Aria",
  role: "TOB 大客户销售",
  roleEn: "TOB SALES / BUSINESS DEVELOPMENT",
  statement: "",
  email: "guoyaowei0@gmail.com",
  phone: "15890875910",
  resumeHref: "/aria-resume.pdf",
  lifePhoto: "/images/portrait-outdoor.jpg",
  keywords: [
    "大客户开发",
    "需求诊断",
    "商务谈判",
    "项目交付",
  ],
};

export const heroMetrics: Metric[] = [
  { value: "300万+", label: "在职期间累计销售额" },
  { value: "2,000+", label: "太平鸟首批订单" },
  { value: "10+", label: "国内外行业展会" },
  { value: "22%", label: "展会线索转化率" },
];

export const education: Education = {
  school: "郑州商学院",
  degree: "工商管理本科",
  direction: "市场营销方向",
  graduation: "2023.06",
  gpa: "3.88 / 4.0",
  ranking: "专业前 1%",
  scholarship: "连续两年获校级一等奖学金",
  portrait: "/images/portrait-id.jpg",
  portraitAlt: "郭耀薇证件照",
  courses: [
    "市场营销",
    "项目管理",
    "统计学",
    "企业管理",
    "消费者行为分析",
  ],
};

export const experiences: Experience[] = [
  {
    index: "01",
    company: "深圳市爱旋科技有限公司",
    role: "TOB大客户销售",
    period: "2025.06 — 2026.07",
    summary:
      "围绕目标行业与潜力客户开展市场调研、主动开发及展会获客，主导头部品牌从需求对接、方案输出、多轮测试、商务报价到订单交付的全流程。",
    keywords: [
      "大客户开发",
      "全周期销售",
      "项目推进",
      "客户关系",
    ],
    metrics: [
      { value: "300万+", label: "累计销售额" },
      { value: "10+", label: "目标品牌" },
      { value: "2,000+", label: "首批订单" },
      { value: "10+", label: "行业展会" },
    ],
    clients: ["太平鸟", "HOKA", "安踏", "必迈"],
    images: [
      {
        src: "/images/hero-sneaker.jpg",
        alt: "鞋类客户定制项目产品",
        caption: "鞋类客户项目 / 产品适配",
      },
      {
        src: "/images/easytech-booth.jpg",
        alt: "深圳市爱旋科技有限公司展会现场",
        caption: "展会现场 / 客户接待",
      },
      {
        src: "/images/cord-system.jpg",
        alt: "旋钮系带系统组成细节",
        caption: "旋钮系带系统 / 产品结构",
      },
      {
        src: "/images/anta-vitroedge.jpg",
        alt: "品牌定制产品展示",
        caption: "品牌定制 / 产品展示",
      },
      {
        src: "/images/experience-product-table-2.jpg",
        alt: "产品细节与结构展示",
        caption: "产品细节 / 结构展示",
      },
      {
        src: "/images/experience-sneaker-detail-2.jpg",
        alt: "鞋类产品旋钮细节",
        caption: "鞋类产品 / 旋钮细节",
      },
      {
        src: "/images/experience-sample-letter.png",
        alt: "客户项目资料页面",
        caption: "客户项目 / 资料页面",
      },
    ],
    groups: [
      {
        label: "ACTION",
        title: "大客户开发与全周期销售",
        points: [
          "开展目标行业市场调研与线索挖掘，通过线上主动开发、行业展会等渠道自主拓客。",
          "主导太平鸟、HOKA、安踏等头部品牌从需求对接、方案输出、多轮测试、商务报价到订单交付的全流程推进。",
          "针对项目技术壁垒协调技术团队解决并推动客户决策。",
          "推动太平鸟首批成交超2,000件（销售额10w+）并实现持续复购；累计销售额超300万。",
          "推动10+家腰部品牌进入核心客户候选池。",
        ],
      },
      {
        label: "PROCESS",
        title: "需求诊断、方案输出与项目推进",
        points: [
          "深入挖掘客户产品应用、材质、结构及定制需求，独立梳理需求并输出初步解决方案。",
          "通过PPT进行商务方案讲解与需求沟通；涉及技术问题时协调技术团队进行可行性验证。",
          "将技术输出重新整合为客户易理解的解决方案，持续推动测试、报价、商务谈判及项目落地。",
        ],
      },
      {
        label: "ACTION",
        title: "展会获客与销售转化",
        points: [
          "负责德国ISPO、广交会等10+场国内外大型行业展会的全周期获客，深度参与展位规划、布展、客户接待及线索跟进。",
          "设计“产品周边引流+社媒内容沉淀”的组合获客方式。",
          "持续将展会线索转化为后续打样、报价及项目机会。",
        ],
      },
      {
        label: "RESULT",
        title: "业务结果",
        points: [
          "展位人流量提升40%，单场平均筛选15+家意向客户，整体展会线索转化率达22%。",
          "累计推动2个定制化项目完成交付，成功激活5家沉默客户重新下单。",
          "通过客户分层、跟进频次、打样进度及预算等维度优化推进节奏。",
        ],
      },
      {
        label: "PROCESS",
        title: "销售流程与项目交付提效",
        points: [
          "持续复盘客户痛点、产品反馈及项目进展，协同技术、生产、研发推进产品优化及项目可行性验证。",
          "自主设计样品申请、审批及成本核算流程，推动样品流转效率提升50%。",
          "通过跨部门协调将平均样品交付周期缩短3-5天。",
          "参与新人销售培训及客户线索整理，提升团队前端销售与项目推进效率。",
        ],
      },
    ],
  },
  {
    index: "02",
    company: "固特科工业塑料件科技（深圳）有限公司",
    role: "TOB外贸销售助理",
    period: "2023.05 — 2025.05",
    summary:
      "负责订单全流程履约、对账与回款、工业客户维护及销售协同，作为业务部与生产、仓储、财务、采购之间的沟通桥梁。",
    keywords: [
      "销售支持",
      "订单管理",
      "客户维护",
      "跨部门协同",
      "国际业务",
    ],
    metrics: [
      { value: "10–20", label: "日均订单" },
      { value: "10–15", label: "工业客户" },
      { value: "98%", label: "老客户留存" },
      { value: "100%", label: "按期交付" },
    ],
    groups: [
      {
        label: "ACTION",
        title: "订单全流程履约与物流跟踪",
        points: [
          "日均处理订单约10-20单，通过用友U8系统完成订单录入、审核及发货跟踪。",
          "统筹协调PMC、财务、物流、仓库、采购等跨部门资源，实时跟进生产进度与备货情况。",
          "主动协调交期变更、物流延误等异常问题。",
        ],
      },
      {
        label: "ACTION",
        title: "应收账款与对账管理",
        points: [
          "月末月初主导对账工作，确保每月5号前完成对账并推动货款回收。",
          "回收准确率100%，实现零坏账。",
          "定期整理归档销售及对账资料，确保账目清晰有据可查。",
        ],
      },
      {
        label: "PROCESS",
        title: "客户关系与销售协同",
        points: [
          "管理10-15家工业客户（珠三角为主，覆盖部分欧美客户），负责日常咨询、投诉及需求受理与跟进。",
          "通过CRM数据库实施客户分类、行业标签及跟进记录管理，老客户留存率达98%。",
          "挖掘定制化需求，联动技术与生产部门推动多批次定制样品及后续订单落地。",
        ],
      },
      {
        label: "PROCESS",
        title: "单据、供应商与数据支持",
        points: [
          "独立制作英文报价单、PI、CI、PL等单证，实现0差错率。",
          "对接供应商确认库存、起订量与交期，主动邮件同步生产与出运进度。",
          "负责每周汇总销售数据、客户跟进情况及订单执行进度，编制销售周报表。",
          "归档整理销售合同及相关商务文件，确保信息传递准确、专业、高效。",
          "处理MOQ、Lead Time、供应商库存及月度对账等销售运营事项。",
        ],
      },
      {
        label: "RESULT",
        title: "效率结果",
        points: [
          "订单按期交付率100%，对账回收准确率100%。",
          "利用Excel VLOOKUP与数据透视表重构自动化对账流程。",
          "将原耗时一周的对账工作压缩至3天，对账效率提升30%，实现零坏账。",
        ],
      },
    ],
  },
];

export const projects: Project[] = [
  {
    index: "01",
    eyebrow: "HEAD BRAND / CUSTOMIZED ORDER",
    period: "",
    title: "头部品牌定制订单攻坚与全周期交付协同",
    keywords: [
      "客户需求",
      "多轮打样",
      "商务谈判",
      "订单交付",
    ],
    resultSummary: [
      "太平鸟首批订单 2,000+ 件",
      "持续复购",
      "3+ 家头部及腰部品牌进入批量订单交付阶段",
    ],
    challenge:
      "面向太平鸟、HOKA、安踏、必迈等头部及腰部品牌，开发服饰鞋类供应链并达成长期合作。客户对产品材质、结构、适配性及交付周期的差异化要求极高，需逐个突破进入供应商体系。",
    insight: "",
    approach: [
      "拆分客户关于材质、结构和适配性的核心需求。",
      "协调技术经理线上或现场解决适配问题。",
      "筛选供应商并推进多轮打样测试。",
      "根据打样反馈推动报价、选品与开模预算确认。",
      "完成商务谈判，并在交付计划中预留缓冲空间。",
    ],
    execution: [],
    result: [
      "成功进入太平鸟供应商体系。",
      "首批订单成交超2,000件，销售额10w+，并实现持续复购。",
      "同步推进3家以上头部及腰部品牌进入批量订单交付阶段。",
      "沉淀可复制的服饰类大客户合作流程与多客户并行推进方法。",
    ],
    images: [],
  },
  {
    index: "02",
    eyebrow: "CUSTOMIZED SAMPLING / MOLD BUDGET",
    period: "",
    title: "大客户定制化打样与开模预算统筹",
    keywords: [
      "技术开发",
      "多轮测试",
      "开模预算",
      "订单跟踪",
    ],
    resultSummary: [
      "累计交付 2 个定制化项目",
      "项目按期推进并支撑后续批量转化",
      "有效降低客户决策周期",
    ],
    challenge:
      "通过展会建联H*KA、安*、必*等头部及腰部鞋类品牌的定制化需求。部分品牌客户定制化需求涉及结构上的深度定制，需协同技术部与美工完成设计图纸输出，提交客户确认。客户决策链长，项目周期约6-12个月以上，涉及多部门协调与节点管控。",
    insight: "",
    approach: [
      "与客户技术开发部建立直接对接。",
      "完成供应商背调及资质录入，进入候选供应商池。",
      "协同技术部与美工完成设计图纸输出并提交客户确认。",
      "针对应用场景输出定制化适配方案。",
      "协商技术部提供开模预算并整理反馈客户。",
    ],
    execution: [],
    result: [
      "累计交付2个定制化项目。",
      "项目按期推进并支撑后续批量转化。",
      "通过设计图纸前置确认与开模预算透明化，有效降低客户决策周期。",
    ],
    images: [],
  },
  {
    index: "03",
    eyebrow: "OVERSEAS CREATOR MARKETING",
    period: "",
    title: "海外达人营销三方共赢合作",
    keywords: [
      "达人建联",
      "内容共创",
      "数据追踪",
    ],
    resultSummary: ["建立达人资源池", "内容共创 SOP", "提升海外曝光"],
    challenge:
      "借助海外社媒平台扩大品牌海外知名度，探索达人营销路径，为海外渠道拓展提供流量与信任背书。",
    insight: "",
    approach: [
      "自主挖掘并联络海外达人。",
      "协调品牌客户提供产品。",
      "推动达人拍摄测评视频并推荐公司系带系统。",
      "建立三方利益协同的合作机制。",
    ],
    execution: [],
    result: [
      "视频数据表现优异，有效提升客户品牌与公司品牌的海外知名度。",
      "积累海外达人资源库。",
      "形成建联、共创与数据追踪的全流程实操SOP。",
    ],
    images: [
      {
        src: "/images/project-overseas-marketing.png",
        alt: "海外达人营销项目内容",
        caption: "海外达人营销 / 项目内容",
      },
    ],
  },
  {
    index: "04",
    eyebrow: "PROCESS OPTIMIZATION / ERP",
    period: "",
    title: "样品申请审批流程优化项目",
    keywords: [
      "金蝶ERP",
      "线上审批",
      "库存确认",
      "部门SOP",
    ],
    resultSummary: ["样品流转效率 +50%", "交付周期缩短 3–5 天", "纳入部门 SOP"],
    challenge:
      "原有样品申请流程依赖口头及线上微信沟通，节点不透明、库存状态不可视，紧急需求时样品准备周期常达1周左右，影响客户响应速度。",
    insight: "",
    approach: [
      "线上销售通过金蝶ERP发起申请。",
      "销售总监审批后，由采购与生产确认库存。",
      "线下增加生产负责人签字确认。",
      "销售部备品仓登记，建立实物与系统数据的对应关系。",
    ],
    execution: [],
    result: [
      "实现样品申请全流程节点可追溯，备品库存状态清晰可视。",
      "样品流转效率提升50%。",
      "平均样品交付周期缩短3-5天。",
      "该流程经销售总监批准后正式纳入部门标准作业程序。",
    ],
    images: [],
  },
];

export const skills: Skill[] = [
  {
    index: "01",
    title: "办公套件",
    shortTitle: "OFFICE & ERP",
    what: [
      "精通Excel（数据透视表、VLOOKUP、复杂函数）",
      "用友U8 ERP",
      "金蝶ERP系统",
    ],
    how: [],
    evidence: [],
  },
  {
    index: "02",
    title: "数据与 AI",
    shortTitle: "DATA & AI",
    what: [
      "具备Python基础数据处理能力",
      "可独立完成多维度数据汇总与可视化分析",
      "熟练使用Codex等AI辅助工具进行业务效率提效",
    ],
    how: [],
    evidence: [],
  },
  {
    index: "03",
    title: "资质与语言",
    shortTitle: "QUALIFICATIONS & LANGUAGE",
    what: [
      "英语B2级（商务邮件沟通及基本口语）",
      "C1驾驶证",
      "连锁经营管理师（具备团队管理及标准化运营意识）",
    ],
    how: [],
    evidence: [],
  },
];

export const otherWorkGroups: OtherWorkGroup[] = [
  {
    title: "展会与客户沟通",
    caption: "从展位接待、产品讲解到客户需求跟进。",
    images: [
      {
        src: "/images/ispo-carnival.jpg",
        alt: "ISPO 展会现场",
        caption: "ISPO 展会现场",
      },
      {
        src: "/images/easytech-booth.jpg",
        alt: "爱旋科技展位现场",
        caption: "品牌展位与客户接待",
      },
      {
        src: "/images/client-meeting.jpg",
        alt: "展会客户沟通现场",
        caption: "现场沟通与需求讲解",
      },
      {
        src: "/images/exhibition-meeting.jpg",
        alt: "客户现场交流",
        caption: "客户交流 / 产品演示",
      },
    ],
  },
  {
    title: "产品内容与展示",
    caption: "通过产品细节、应用场景和内容表达建立客户理解。",
    images: [
      {
        src: "/images/product-table.jpg",
        alt: "产品展示桌面",
        caption: "产品陈列",
      },
      {
        src: "/images/product-display.jpg",
        alt: "产品细节展示",
        caption: "产品细节",
      },
      {
        src: "/images/breathable-pouch.jpg",
        alt: "产品材质与包装说明",
        caption: "材质与包装说明",
      },
      {
        src: "/images/tightening-system.jpg",
        alt: "旋钮系紧产品说明",
        caption: "产品功能说明",
      },
    ],
  },
  {
    title: "海外社媒内容",
    caption: "围绕达人内容、产品合作和社媒内容沉淀持续展示。",
    images: [
      {
        src: "/images/youtube-creator.jpg",
        alt: "海外 YouTube 达人内容",
        caption: "海外达人内容",
      },
      {
        src: "/images/evr-social.jpg",
        alt: "EVR 骑行包社媒内容",
        caption: "EVR 骑行包合作",
      },
      {
        src: "/images/evr-bike-bag.jpg",
        alt: "EVR 骑行包产品页面",
        caption: "产品内容沉淀",
      },
      {
        src: "/images/social-product-notes.jpg",
        alt: "产品社媒收藏界面",
        caption: "社媒产品展示",
      },
      {
        src: "/images/social-santic-collab.jpg",
        alt: "Santic 与 ETIE 联名骑行鞋内容",
        caption: "Santic × ETIE / 骑行鞋内容",
      },
    ],
  },
];

export const tools: string[] = [];

export type ResumeData = {
  profile: Profile;
  heroMetrics: Metric[];
  education: Education;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  tools: string[];
  otherWorkGroups: OtherWorkGroup[];
  visualStyles: VisualStyles;
};

export const defaultResumeData: ResumeData = {
  profile,
  heroMetrics,
  education,
  experiences,
  projects,
  skills,
  tools,
  otherWorkGroups,
  visualStyles: {},
};

export function getDefaultResumeData(): ResumeData {
  return JSON.parse(JSON.stringify(defaultResumeData)) as ResumeData;
}
