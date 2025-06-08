// 冷静期检查项目类型
export interface CooldownCheckItem {
  condition: boolean;
  message: string;
  type: 'warning' | 'info' | 'error';
}

// 理性检查清单项目类型
export interface RationalCheckItem {
  question: string;
  category: 'financial' | 'necessity' | 'social' | 'risk';
}

// 冷静期检查逻辑
export function getCooldownChecks(
  productPrice: string, 
  adjustments: { discount: boolean }, 
  score: number
): CooldownCheckItem[] {
  const checks: CooldownCheckItem[] = [];
  
  const price = parseInt(productPrice) || 0;
  
  // 如果没有输入价格，直接返回空数组
  if (!productPrice || price <= 0) {
    return checks;
  }
  
  // 大额支出检查
  if (price > 5000) {
    checks.push({
      condition: true,
      message: "大额支出 → 建议等待24小时",
      type: 'warning'
    });
  }
  
  // 限时促销检查
  if (adjustments.discount) {
    checks.push({
      condition: true,
      message: "限时促销 → 验证真实性和退换政策",
      type: 'warning'
    });
  }
  
  // 高分但未达到闭眼入手检查
  if (score >= 75 && score < 85) {
    checks.push({
      condition: true,
      message: "高分但未到闭眼入手 → 找朋友独立评分",
      type: 'info'
    });
  }
  
  // 超高价格警告
  if (price > 20000) {
    checks.push({
      condition: true,
      message: "超高价格 → 建议等待一周并咨询专业人士",
      type: 'error'
    });
  }
  
  return checks;
}

// 理性检查清单
export function getRationalChecklist(): RationalCheckItem[] {
  return [
    {
      question: "不买的话现有的能坚持多久？",
      category: 'necessity'
    },
    {
      question: "这笔钱理财一年后能有多少？",
      category: 'financial'
    },
    {
      question: "家人知道价格会怎么说？",
      category: 'social'
    },
    {
      question: "买了还有钱应对意外吗？",
      category: 'risk'
    },
    {
      question: "一个月后还会想要这个产品吗？",
      category: 'necessity'
    },
    {
      question: "有没有更便宜的替代方案？",
      category: 'financial'
    }
  ];
}

// 根据分数获取额外的理性提醒
export function getScoreBasedReminders(score: number): string[] {
  const reminders: string[] = [];
  
  if (score < 50) {
    reminders.push("分数较低，建议重新考虑是否真的需要");
  }
  
  if (score >= 50 && score < 65) {
    reminders.push("分数中等，建议等待更好的时机或价格");
  }
  
  if (score >= 85) {
    reminders.push("分数很高，但仍建议确认预算充足");
  }
  
  return reminders;
}

// 获取冷静期建议的等待时间
export function getRecommendedWaitTime(price: number, score: number): string {
  if (price > 50000) return "建议等待2周";
  if (price > 20000) return "建议等待1周";
  if (price > 10000) return "建议等待3天";
  if (price > 5000) return "建议等待24小时";
  if (score < 65) return "建议等待1天冷静思考";
  return "可以立即决策";
} 