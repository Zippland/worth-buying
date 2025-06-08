import React from 'react';
import { AlertTriangle, Clock, Brain } from 'lucide-react';
import { 
  getCooldownChecks, 
  getScoreBasedReminders, 
  getRecommendedWaitTime,
  CooldownCheckItem
} from '../utils/decisionChecks';

interface DecisionChecksProps {
  productPrice: string;
  adjustments: { discount: boolean };
  score: number;
}

const DecisionChecks: React.FC<DecisionChecksProps> = ({ 
  productPrice, 
  adjustments, 
  score 
}) => {
  const cooldownChecks = getCooldownChecks(productPrice, adjustments, score);
  const scoreReminders = getScoreBasedReminders(score);
  const waitTime = getRecommendedWaitTime(parseInt(productPrice) || 0, score);

  const getCheckIcon = (type: CooldownCheckItem['type']) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  const getCheckBgColor = (type: CooldownCheckItem['type']) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getCheckTextColor = (type: CooldownCheckItem['type']) => {
    switch (type) {
      case 'error': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };



  const shouldShowCooldownChecks = productPrice && (cooldownChecks.length > 0 || scoreReminders.length > 0);

  return (
    <div className="space-y-6">
      {/* 冷静期检查 */}
      {shouldShowCooldownChecks && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} />
            冷静期检查
          </h4>
          
          {(cooldownChecks.length > 0 || parseInt(productPrice) > 0) && (
            <div className="mb-3 p-2 bg-yellow-100 rounded text-sm text-yellow-700">
              <Clock size={16} className="inline mr-1" />
              <strong>{waitTime}</strong>
            </div>
          )}

          {cooldownChecks.length > 0 && (
            <div className="space-y-2 mb-3">
              {cooldownChecks.map((check, index) => (
                <div key={index} className={`p-2 border rounded text-sm ${getCheckBgColor(check.type)}`}>
                  <div className={`flex items-center gap-2 ${getCheckTextColor(check.type)}`}>
                    <span>{getCheckIcon(check.type)}</span>
                    <span>{check.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {scoreReminders.length > 0 && (
            <div className="pt-2 border-t border-yellow-300">
              {scoreReminders.map((reminder, index) => (
                <div key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                  <Brain size={14} />
                  {reminder}
                </div>
              ))}
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default DecisionChecks; 
 