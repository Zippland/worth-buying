import React, { useState, useMemo } from 'react';
import { Calculator, ShoppingCart, TrendingUp, Shield, Clock, Heart, AlertTriangle, Settings } from 'lucide-react';

const PurchaseDecisionCalculator = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productType, setProductType] = useState('digital'); // digital, appliance, fitness, luxury, other
  const [personalityType, setPersonalityType] = useState('standard'); // standard, conservative, efficiency, quality
  
  // 评分状态
  const [scores, setScores] = useState({
    A1: 0, A2: 0, A3: 0,
    B1: 0, B2: 0, B3: 0, B4: 0,
    C1: 0, C2: 0, C3: 0,
    D1: 0, D2: 0,
    E1: 0, E2: 0, E3: 0,
    F1: 0, F2: 0, F3: 0,
    G1: 0, G2: 0,
    H1: 0, H2: 0, H3: 0
  });

  // 特殊调整
  const [adjustments, setAdjustments] = useState({
    urgent: false,      // 紧急需求 +1
    discount: false,    // 限时优惠 +1
    brand: false,       // 品牌信仰 +1
    gift: false,        // 送礼需求 +5
    investment: false   // 投资属性 +1
  });

  // 基础权重
  const baseWeights = {
    A1: 2, A2: 2, A3: 0.6,
    B1: 2, B2: 2, B3: 0.4, B4: 0.2,
    C1: 2, C2: 0.8, C3: 0.8,
    D1: 1, D2: 0.8,
    E1: 1, E2: 0.8, E3: 0.4,
    F1: 0.4, F2: 0.8, F3: 0.8,
    G1: 0.6, G2: 0.6,
    H1: 0.4, H2: 0.4, H3: 0.2
  };

  // 个性化权重调整
  const personalityWeights = {
    conservative: {
      A1: 2.5, A2: 2.5, A3: 0.8,
      B1: 2.5, B2: 2.5, B3: 0.6, B4: 0.4,
      C1: 2.5, C2: 1.0, C3: 1.0,
      D1: 0.5, D2: 0.4,
      E1: 0.5, E2: 0.4, E3: 0.2,
      F1: 0.6, F2: 1.0, F3: 1.0,
      G1: 0.4, G2: 0.4,
      H1: 0.2, H2: 0.2, H3: 0.1
    },
    efficiency: {
      A1: 1.5, A2: 1.5, A3: 0.4,
      B1: 1.5, B2: 1.5, B3: 0.3, B4: 0.1,
      C1: 1.5, C2: 0.6, C3: 0.6,
      D1: 2.0, D2: 1.6,
      E1: 1.5, E2: 1.2, E3: 0.6,
      F1: 0.4, F2: 0.8, F3: 0.8,
      G1: 0.8, G2: 0.8,
      H1: 0.4, H2: 0.4, H3: 0.2
    },
    quality: {
      A1: 1.8, A2: 1.8, A3: 0.5,
      B1: 1.5, B2: 1.5, B3: 0.3, B4: 0.1,
      C1: 2.5, C2: 1.0, C3: 1.0,
      D1: 1.0, D2: 0.8,
      E1: 1.5, E2: 1.2, E3: 0.6,
      F1: 0.2, F2: 0.6, F3: 0.6,
      G1: 0.5, G2: 0.5,
      H1: 0.3, H2: 0.3, H3: 0.1
    }
  };

  // 获取当前权重
  const getCurrentWeights = () => {
    if (personalityType === 'standard') return baseWeights;
    return personalityWeights[personalityType];
  };

  // 计算总分
  const calculateScore = useMemo(() => {
    const weights = getCurrentWeights();
    let baseScore = 0;

    // 基础分数计算
    Object.keys(weights).forEach(key => {
      if (key === 'H3' && productType !== 'digital') {
        // 非数码产品H3默认满分
        baseScore += 5 * weights[key];
      } else {
        baseScore += scores[key] * weights[key];
      }
    });

    // 特殊调整
    let adjustmentScore = 0;
    if (adjustments.urgent) adjustmentScore += 2; // A1 +1分
    if (adjustments.discount) adjustmentScore += 2; // B1 +1分
    if (adjustments.brand) adjustmentScore += 0.8; // E2 +1分
    if (adjustments.gift) adjustmentScore += 5; // E维度权重临时提升
    if (adjustments.investment) adjustmentScore += 0.8; // C2 +1分

    return Math.min(100, baseScore + adjustmentScore);
  }, [scores, adjustments, productType, personalityType]);

  // 获取决策建议
  const getDecisionAdvice = (score) => {
    if (score >= 85) return { level: 'excellent', text: '🟢 闭眼入手', desc: '无需犹豫，遇到好价格立即下单', color: 'bg-green-500' };
    if (score >= 75) return { level: 'good', text: '🟢 放心购买', desc: '可安心购买，适当比价即可', color: 'bg-green-400' };
    if (score >= 65) return { level: 'caution', text: '🟡 择机购买', desc: '等待促销、货比三家、考虑替代', color: 'bg-yellow-400' };
    if (score >= 50) return { level: 'wait', text: '🟠 谨慎观望', desc: '继续研究、延期3个月、寻找替代', color: 'bg-orange-400' };
    return { level: 'avoid', text: '🔴 建议放弃', desc: '暂缓购买，重新评估真实需求', color: 'bg-red-500' };
  };

  const handleScoreChange = (dimension, value) => {
    setScores(prev => ({ ...prev, [dimension]: parseInt(value) || 0 }));
  };

  const handleAdjustmentChange = (type) => {
    setAdjustments(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const resetScores = () => {
    setScores(Object.fromEntries(Object.keys(scores).map(key => [key, 0])) as typeof scores);
    setAdjustments({
      urgent: false, discount: false, brand: false, gift: false, investment: false
    });
  };

  const advice = getDecisionAdvice(calculateScore);

  // 评分选项定义
  const scoreOptions = {
    A1: [
      { value: 0, label: "纯想要" },
      { value: 1, label: "锦上添花" },
      { value: 2, label: "有点用处" },
      { value: 3, label: "较实用" },
      { value: 4, label: "很有用" },
      { value: 5, label: "强刚需" }
    ],
    A2: [
      { value: 0, label: "几乎不用" },
      { value: 1, label: "偶尔使用(月1-2次)" },
      { value: 2, label: "一般使用(周1-2次)" },
      { value: 3, label: "较频繁(隔天使用)" },
      { value: 4, label: "高频使用(每天)" },
      { value: 5, label: "多次使用/天" }
    ],
    A3: [
      { value: 0, label: "多种免费替代" },
      { value: 1, label: "有便宜替代" },
      { value: 2, label: "替代品一般" },
      { value: 3, label: "替代品较差" },
      { value: 4, label: "少量替代" },
      { value: 5, label: "无可替代" }
    ],
    B1: [
      { value: 0, label: "明显超贵" },
      { value: 1, label: "偏贵" },
      { value: 2, label: "价格一般" },
      { value: 3, label: "性价比可以" },
      { value: 4, label: "性价比不错" },
      { value: 5, label: "性价比极高" }
    ],
    B2: [
      { value: 0, label: ">年收入20%" },
      { value: 1, label: "年收入15-20%" },
      { value: 2, label: "年收入10-15%" },
      { value: 3, label: "年收入6-10%" },
      { value: 4, label: "年收入3-6%" },
      { value: 5, label: "<年收入3%" }
    ],
    B3: [
      { value: 0, label: "影响生活质量" },
      { value: 1, label: "占用应急资金" },
      { value: 2, label: "需要分期付款" },
      { value: 3, label: "稍有压力" },
      { value: 4, label: "小有富余" },
      { value: 5, label: "完全无压力" }
    ],
    B4: [
      { value: 0, label: "错失高收益投资" },
      { value: 1, label: "影响定期投资" },
      { value: 2, label: "延迟理财计划" },
      { value: 3, label: "机会成本一般" },
      { value: 4, label: "机会成本很小" },
      { value: 5, label: "无机会成本" }
    ],
    C1: [
      { value: 0, label: "不到1年" },
      { value: 1, label: "1-2年" },
      { value: 2, label: "2-3年" },
      { value: 3, label: "3-5年" },
      { value: 4, label: "5-8年" },
      { value: 5, label: "8年以上" }
    ],
    C2: [
      { value: 0, label: "保值率<10%" },
      { value: 1, label: "保值率10-20%" },
      { value: 2, label: "保值率20-30%" },
      { value: 3, label: "保值率30-50%" },
      { value: 4, label: "保值率50-70%" },
      { value: 5, label: "保值率>70%" }
    ],
    C3: [
      { value: 0, label: "半年一代新品" },
      { value: 1, label: "年度更新换代" },
      { value: 2, label: "2年一代" },
      { value: 3, label: "技术相对成熟" },
      { value: 4, label: "迭代速度缓慢" },
      { value: 5, label: "技术非常稳定" }
    ],
    D1: [
      { value: 0, label: "无效率提升" },
      { value: 1, label: "微小提升" },
      { value: 2, label: "小幅提升" },
      { value: 3, label: "明显提升" },
      { value: 4, label: "大幅提升" },
      { value: 5, label: "显著提升" }
    ],
    D2: [
      { value: 0, label: "无收益" },
      { value: 1, label: "小幅改善" },
      { value: 2, label: "改善健康" },
      { value: 3, label: "提升技能" },
      { value: 4, label: "节省成本" },
      { value: 5, label: "带来收入" }
    ],
    E1: [
      { value: 0, label: "无感觉" },
      { value: 1, label: "略有愉悦" },
      { value: 2, label: "比较开心" },
      { value: 3, label: "很开心" },
      { value: 4, label: "非常满足" },
      { value: 5, label: "极大快乐" }
    ],
    E2: [
      { value: 0, label: "负面影响" },
      { value: 1, label: "无影响" },
      { value: 2, label: "略有帮助" },
      { value: 3, label: "有一定帮助" },
      { value: 4, label: "较好提升" },
      { value: 5, label: "显著提升" }
    ],
    E3: [
      { value: 0, label: "强烈反对" },
      { value: 1, label: "不太支持" },
      { value: 2, label: "中性态度" },
      { value: 3, label: "比较支持" },
      { value: 4, label: "很支持" },
      { value: 5, label: "非常支持" }
    ],
    F1: [
      { value: 0, label: ">月收入150%" },
      { value: 1, label: "月收入120-150%" },
      { value: 2, label: "月收入80-120%" },
      { value: 3, label: "月收入50-80%" },
      { value: 4, label: "月收入30-50%" },
      { value: 5, label: "<月收入30%" }
    ],
    F2: [
      { value: 0, label: "故障率高且维修贵" },
      { value: 1, label: "维护成本较高" },
      { value: 2, label: "维护成本一般" },
      { value: 3, label: "维护成本便宜" },
      { value: 4, label: "很少需要维护" },
      { value: 5, label: "几乎免维护" }
    ],
    F3: [
      { value: 0, label: "近期必大跌价" },
      { value: 1, label: "可能跌价20%+" },
      { value: 2, label: "小幅波动" },
      { value: 3, label: "价格稳定" },
      { value: 4, label: "持续涨价" },
      { value: 5, label: "限量稀缺品" }
    ],
    G1: [
      { value: 0, label: "时机很差" },
      { value: 1, label: "时机不佳" },
      { value: 2, label: "时机一般" },
      { value: 3, label: "时机较好" },
      { value: 4, label: "时机很好" },
      { value: 5, label: "最佳时机" }
    ],
    G2: [
      { value: 0, label: "完全不匹配" },
      { value: 1, label: "勉强够用" },
      { value: 2, label: "基本适合" },
      { value: 3, label: "比较合适" },
      { value: 4, label: "很合适" },
      { value: 5, label: "完美匹配" }
    ],
    H1: [
      { value: 0, label: "很难学会" },
      { value: 1, label: "需要专门培训" },
      { value: 2, label: "需要学习研究" },
      { value: 3, label: "较容易上手" },
      { value: 4, label: "很容易使用" },
      { value: 5, label: "零学习成本" }
    ],
    H2: [
      { value: 0, label: "明显有害健康" },
      { value: 1, label: "可能有害" },
      { value: 2, label: "健康中性" },
      { value: 3, label: "略有益健康" },
      { value: 4, label: "较有益健康" },
      { value: 5, label: "明显有益健康" }
    ],
    H3: [
      { value: 0, label: "隐私高风险" },
      { value: 1, label: "隐私中等风险" },
      { value: 2, label: "隐私低风险" },
      { value: 3, label: "相对安全" },
      { value: 4, label: "很安全" },
      { value: 5, label: "完全安全" }
    ]
  };

  const ScoreInput = ({ dimension, label, description }) => {
    const options = scoreOptions[dimension] || [];
    
    return (
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="mb-2">
          <label className="font-medium text-gray-700 block mb-2">{dimension}. {label}</label>
          <select 
            value={scores[dimension]} 
            onChange={(e) => handleScoreChange(dimension, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">请选择...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Calculator className="text-blue-600" />
          大型开支决策计算器 V2.1
        </h1>
        <p className="text-gray-600">理性决策，明智消费</p>
      </div>

      {/* 产品信息 */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="text-blue-600" />
          产品信息
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">产品名称</label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="如：戴森V15吸尘器"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">价格 (¥)</label>
            <input 
              type="number" 
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="4999"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">产品类型</label>
            <select 
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="digital">数码3C</option>
              <option value="appliance">家电产品</option>
              <option value="fitness">健身器材</option>
              <option value="luxury">奢侈品/轻奢</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>
      </div>

      {/* 个性化设置 */}
      <div className="bg-purple-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="text-purple-600" />
          个性化设置
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">消费风格</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'standard', label: '标准型', desc: '均衡考虑各项因素' },
              { value: 'conservative', label: '保守型', desc: '重视必要性和经济性' },
              { value: 'efficiency', label: '效率型', desc: '愿意为效率付费' },
              { value: 'quality', label: '品质型', desc: '追求长期价值' }
            ].map(type => (
              <label key={type.value} className="cursor-pointer">
                <input 
                  type="radio" 
                  name="personality" 
                  value={type.value}
                  checked={personalityType === type.value}
                  onChange={(e) => setPersonalityType(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  personalityType === type.value 
                    ? 'border-purple-500 bg-purple-100' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">特殊情况调整</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { key: 'urgent', label: '紧急需求', desc: '+2分' },
              { key: 'discount', label: '限时优惠', desc: '+2分' },
              { key: 'brand', label: '品牌信仰', desc: '+0.8分' },
              { key: 'gift', label: '送礼需求', desc: '+5分' },
              { key: 'investment', label: '投资属性', desc: '+0.8分' }
            ].map(adj => (
              <label key={adj.key} className="cursor-pointer">
                <input 
                  type="checkbox"
                  checked={adjustments[adj.key]}
                  onChange={() => handleAdjustmentChange(adj.key)}
                  className="sr-only"
                />
                <div className={`p-2 border-2 rounded-lg text-center transition-colors ${
                  adjustments[adj.key]
                    ? 'border-purple-500 bg-purple-100' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <div className="text-sm font-medium">{adj.label}</div>
                  <div className="text-xs text-gray-600">{adj.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 评分区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. 功能必要性 */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-700">A. 功能必要性 (23分)</h3>
            <ScoreInput 
              dimension="A1" 
              label="基础需求匹配"
              description=""
            />
            <ScoreInput 
              dimension="A2" 
              label="使用频率预测"
              description=""
            />
            <ScoreInput 
              dimension="A3" 
              label="可替代性"
              description=""
            />
          </div>

          {/* B. 经济合理性 */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-700">B. 经济合理性 (23分)</h3>
            <ScoreInput 
              dimension="B1" 
              label="性价比"
              description=""
            />
            <ScoreInput 
              dimension="B2" 
              label="全生命周期成本"
              description=""
            />
            <ScoreInput 
              dimension="B3" 
              label="现金流占用"
              description=""
            />
            <ScoreInput 
              dimension="B4" 
              label="投资机会成本"
              description=""
            />
          </div>

          {/* C. 生命周期收益 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">C. 生命周期收益 (18分)</h3>
            <ScoreInput 
              dimension="C1" 
              label="使用寿命与折旧"
              description=""
            />
            <ScoreInput 
              dimension="C2" 
              label="二手保值率"
              description=""
            />
            <ScoreInput 
              dimension="C3" 
              label="技术迭代风险"
              description=""
            />
          </div>

          {/* D. 效率与时间价值 */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-700">D. 效率与时间价值 (9分)</h3>
            <ScoreInput 
              dimension="D1" 
              label="直接效率提升"
              description=""
            />
            <ScoreInput 
              dimension="D2" 
              label="间接收益"
              description=""
            />
          </div>

          {/* E. 心理与生活质量 */}
          <div className="bg-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-pink-700">E. 心理与生活质量 (11分)</h3>
            <ScoreInput 
              dimension="E1" 
              label="情绪价值"
              description=""
            />
            <ScoreInput 
              dimension="E2" 
              label="社交/形象价值"
              description=""
            />
            <ScoreInput 
              dimension="E3" 
              label="家庭/伴侣接受度"
              description=""
            />
          </div>

          {/* F. 风险与压力 */}
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">F. 风险与压力 (10分)</h3>
            <ScoreInput 
              dimension="F1" 
              label="一次性资金压力"
              description=""
            />
            <ScoreInput 
              dimension="F2" 
              label="维护风险"
              description=""
            />
            <ScoreInput 
              dimension="F3" 
              label="价格波动风险"
              description=""
            />
          </div>

          {/* G. 时机与环境适配 */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">G. 时机与环境适配 (6分)</h3>
            <ScoreInput 
              dimension="G1" 
              label="购买时机"
              description=""
            />
            <ScoreInput 
              dimension="G2" 
              label="空间环境匹配"
              description=""
            />
          </div>

          {/* H. 学习与健康成本 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">H. 学习与健康成本 (5分)</h3>
            <ScoreInput 
              dimension="H1" 
              label="学习适应成本"
              description=""
            />
            <ScoreInput 
              dimension="H2" 
              label="健康安全影响"
              description=""
            />
            {productType === 'digital' && (
              <ScoreInput 
                dimension="H3" 
                label="隐私数据风险"
                description=""
              />
            )}
            {productType !== 'digital' && (
              <div className="mb-4 p-3 bg-green-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">H3. 隐私数据风险</span>
                  <span className="px-2 py-1 bg-green-200 rounded text-sm">自动满分</span>
                </div>
                <p className="text-sm text-gray-600">非数码产品无隐私风险</p>
              </div>
            )}
          </div>
        </div>

        {/* 结果面板 */}
        <div className="space-y-6">

          {/* 冷静期检查 */}
          {productPrice && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={18} />
                冷静期检查
              </h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {parseInt(productPrice) > 5000 && (
                  <div>• 大额支出 → 建议等待24小时</div>
                )}
                {adjustments.discount && (
                  <div>• 限时促销 → 验证真实性和退换政策</div>
                )}
                {calculateScore >= 75 && calculateScore < 85 && (
                  <div>• 高分但未到闭眼入手 → 找朋友独立评分</div>
                )}
              </div>
            </div>
          )}

          {/* 理性检查清单 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">理性检查清单</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div>□ 不买的话现有的能坚持多久？</div>
              <div>□ 这笔钱理财一年后能有多少？</div>
              <div>□ 家人知道价格会怎么说？</div>
              <div>□ 买了还有钱应对意外吗？</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button 
              onClick={resetScores}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              重置所有评分
            </button>
            
            {productName && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <strong>{productName}</strong>
                {productPrice && <span> - ¥{productPrice}</span>}
                <br />
                总分: {calculateScore.toFixed(1)} | {advice.text}
              </div>
            )}
          </div>

          {/* 总分显示 */}
          <div className={`${advice.color} rounded-lg p-6 text-white`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{calculateScore.toFixed(1)}</div>
              <div className="text-xl font-semibold mb-1">{advice.text}</div>
              <div className="text-sm opacity-90">{advice.desc}</div>
            </div>
          </div>

          {/* 维度雷达图简化显示 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">维度得分概览</h4>
            <div className="space-y-2 text-sm">
              {[
                { name: 'A-必要性', score: (scores.A1*2 + scores.A2*2 + scores.A3*0.6), max: 23 },
                { name: 'B-经济性', score: (scores.B1*2 + scores.B2*2 + scores.B3*0.4 + scores.B4*0.2), max: 23 },
                { name: 'C-周期收益', score: (scores.C1*2 + scores.C2*0.8 + scores.C3*0.8), max: 18 },
                { name: 'D-效率价值', score: (scores.D1*1 + scores.D2*0.8), max: 9 },
                { name: 'E-生活质量', score: (scores.E1*1 + scores.E2*0.8 + scores.E3*0.4), max: 11 },
                { name: 'F-风险压力', score: (scores.F1*0.4 + scores.F2*0.8 + scores.F3*0.8), max: 10 }
              ].map(dim => (
                <div key={dim.name} className="flex items-center gap-2">
                  <span className="w-16 text-xs">{dim.name}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (dim.score / dim.max) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs w-12">{dim.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDecisionCalculator;