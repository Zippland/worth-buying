import Head from 'next/head'
import PurchaseDecisionCalculator from '../page'

export default function Home() {
  return (
    <div>
      <Head>
        <title>大型开支决策计算器 - 理性决策，明智消费</title>
        <meta name="description" content="科学的购买决策工具，通过8个维度评估，帮助您做出理性的消费决策。支持个性化评分，避免冲动消费。" />
        <meta name="keywords" content="购买决策,消费决策,理性消费,评分计算器,冲动消费,理财工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="七卡瓦" />
        <meta property="og:title" content="大型开支决策计算器" />
        <meta property="og:description" content="科学的购买决策工具，帮助您做出理性的消费决策" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://worthbuying.zippland.com" />
        <link rel="canonical" href="http://worthbuying.zippland.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PurchaseDecisionCalculator />
      </main>
    </div>
  )
} 