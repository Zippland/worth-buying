import Head from 'next/head'
import PurchaseDecisionCalculator from '../page'

export default function Home() {
  return (
    <div>
      <Head>
        <title>大型开支决策计算器</title>
        <meta name="description" content="理性决策，明智消费" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PurchaseDecisionCalculator />
      </main>
    </div>
  )
} 