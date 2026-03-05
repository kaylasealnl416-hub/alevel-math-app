// ============================================================
// SUBJECTS DATA - Multi-subject support
// Economics data. Mathematics data is in CURRICULUM (original file).
// ============================================================

export const SUBJECTS = {
  economics: {
    id: "economics",
    name: { zh: "经济学", en: "Economics" },
    nameFull: { zh: "爱德思IAL经济学", en: "Pearson Edexcel IAL Economics" },
    icon: "📊",
    color: "#1E88E5",
    bgColor: "#E3F2FD",
    level: "IAL (International A-Level) - 2018 Syllabus",
    books: {
      Unit1: {
        id: "Unit1",
        title: { zh: "市场运行", en: "Markets in action" },
        subtitle: { zh: "微观经济学基础", en: "Microeconomics Foundations" },
        color: "#1976D2",
        chapters: [
          {
            id: "e1c1", num: 1,
            title: { zh: "经济学本质与基本概念", en: "The Nature of Economics & Basic Concepts" },
            overview: { zh: "介绍经济学的本质，理解稀缺性、选择与机会成本的关系，学习正理经济学与规范经济学的区别。", en: "Introduces the nature of economics, understanding scarcity, choice, and opportunity cost, learning the difference between positive and normative economics." },
            keyPoints: [
              "Economics is the social science that studies how people, firms, governments and societies make choices about how to allocate scarce resources to satisfy unlimited wants",
              "Scarcity is the fundamental economic problem - resources are limited while human wants are unlimited",
              "Opportunity cost is the cost of the next best alternative foregone when making a choice",
              "Positive economics deals with facts, cause-and-effect relationships, and can be tested (e.g., 'Unemployment is rising')",
              "Normative economics involves value judgments, opinions, and what 'ought to be' (e.g., 'The government should reduce unemployment')",
              "Production Possibility Frontier (PPF) shows the maximum combinations of two goods that can be produced given available resources and technology",
              "Points ON the PPF: Efficient production (all resources fully utilized)",
              "Points INSIDE the PPF: Inefficient production (resources underutilized)",
              "Points OUTSIDE the PPF: Unattainable production (requires more resources than available)",
              "PPF shape: Concave (bowed outward) due to increasing opportunity cost - as we produce more of one good, we sacrifice increasing amounts of the other",
              "Specialisation occurs when individuals, firms or countries concentrate on producing a limited range of goods",
              "Exchange/markets allow specialisation and trade, enabling societies to consume beyond their PPF",
              "Comparative advantage: A country has comparative advantage in producing a good if it has a lower opportunity cost of production",
              "Absolute advantage: Being able to produce more output with the same inputs"
            ],
            formulas: [
              { name: "机会成本 (Opportunity Cost)", expr: "OC = Value of next best alternative foregone" },
              { name: "PPF斜率 (PPF Slope)", expr: "Opportunity Cost = Foregone output / Gained output" },
              { name: "PPF效率 (PPF Efficiency)", expr: "Point on PPF = All resources fully employed" }
            ],
            examples: [
              {
                question: { zh: "如果一个国家在生产1台电脑时需要放弃3台手机，而生产1台手机需要放弃0.5台电脑。该国在哪种产品上具有比较优势？", en: "If a country must give up 3 mobile phones to produce 1 computer, and gives up 0.5 computers to produce 1 mobile phone. Which product does the country have comparative advantage in?" },
                answer: { zh: "手机的比较优势。因为生产1台手机的机会成本是0.5台电脑，而生产1台电脑的机会成本是3台手机。手机的机会成本更低。", en: "Mobile phones. Because the opportunity cost of 1 mobile phone is 0.5 computers, while the opportunity cost of 1 computer is 3 mobile phones. Mobile phones have lower opportunity cost." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "区分正理与规范经济学；理解PPF曲线上的点与点外的点的含义；计算机会成本；比较优势与绝对优势的区别",
            examTips: "PPF图形的绘制与移动是高频考点；注意PPF弯曲形状表示递增的机会成本；移民/自然灾害等对PPF的影响",
            youtube: [
              { title: "Scarcity, Choice and Opportunity Cost", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8wD4uCXW3Uk" },
              { title: "Production Possibility Frontier (PPF)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=0C8oWfpl0Yc" },
              { title: "Comparative Advantage", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=AutXW1Mq1l4" }
            ]
          },
          {
            id: "e1c2", num: 2,
            title: { zh: "需求与消费者行为", en: "Demand & Consumer Behaviour" },
            overview: { zh: "学习需求曲线、需求法则、需求弹性以及消费者剩余的概念。", en: "Learn about demand curves, law of demand, demand elasticities, and consumer surplus." },
            keyPoints: [
              "Law of demand: There is an inverse (negative) relationship between price and quantity demanded, ceteris paribus",
              "Individual demand: The demand schedule for a single consumer",
              "Market demand: The sum of all individual demands at each price",
              "Movement along the demand curve: Caused by change in price of the good itself",
              "Shift of the demand curve: Caused by change in other factors (income, preferences, prices of related goods, expectations, number of buyers)",
              "Substitutes: Goods that can replace each other (price of one rises, demand for other rises)",
              "Complements: Goods used together (price of one rises, demand for other falls)",
              "Normal goods: Demand increases as income increases",
              "Inferior goods: Demand decreases as income increases",
              "Price Elasticity of Demand (PED) measures how responsive quantity demanded is to a change in price",
              "PED > 1: Elastic (demand sensitive to price change)",
              "PED < 1: Inelastic (demand insensitive to price change)",
              "PED = 1: Unit elastic",
              "PED = 0: Perfectly inelastic (vertical demand curve)",
              "PED = ∞: Perfectly elastic (horizontal demand curve)",
              "Factors affecting PED: Necessity vs luxury, availability of substitutes, proportion of income, time period",
              "Income Elasticity of Demand (YED): Measures responsiveness of demand to changes in income",
              "YED > 0: Normal goods; YED < 0: Inferior goods; YED > 1: Luxury goods",
              "Cross Elasticity of Demand (XED): Measures how demand for one good responds to price changes in another good",
              "XED > 0: Substitutes; XED < 0: Complements",
              "Consumer surplus: The benefit or welfare gain consumers receive when they pay less than their maximum willingness to pay"
            ],
            formulas: [
              { name: "需求价格弹性 (PED)", expr: "PED = (%ΔQd) / (%ΔP)" },
              { name: "点弹性 (Point PED)", expr: "PED = (ΔQ/Q) ÷ (ΔP/P)" },
              { name: "弧弹性 (Arc PED)", expr: "PED = [(Q2-Q1)/(Q1+Q2)] ÷ [(P2-P1)/(P1+P2)]" },
              { name: "消费者剩余 (Consumer Surplus)", expr: "CS = Maximum willing to pay - Actual price" },
              { name: "收入弹性 (YED)", expr: "YED = (%ΔQd) / (%ΔY)" },
              { name: "交叉弹性 (XED)", expr: "XED = (%ΔQd of good A) / (%ΔP of good B)" }
            ],
            examples: [
              {
                question: { zh: "如果某商品价格从10元上涨到12元，需求量从100件下降到80件。计算需求价格弹性。", en: "If the price of a good rises from $10 to $12, quantity demanded falls from 100 to 80 units. Calculate PED." },
                answer: { zh: "PED = (20/100) / (2/10) = 0.2 / 0.2 = 1 (单位弹性)。需求量的变化百分比 = -20%，价格变化百分比 = 20%。", en: "PED = (20/100) ÷ (2/10) = 0.2 ÷ 0.2 = 1 (unit elastic). % change in quantity = -20%, % change in price = 20%." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "弹性计算与图形结合；区分必需品与奢侈品；理解消费者剩余的图形表示",
            examTips: "弹性值的大小与敏感性关系必须熟练掌握；注意弹性计算的正负号含义；区分替代品与互补品",
            youtube: [
              { title: "The Law of Demand", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7C-4lEl9DYo" },
              { title: "Price Elasticity of Demand (PED)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=JKoq5S1LZVo" },
              { title: "Income Elasticity of Demand (YED)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=D6GXKXd2kWc" },
              { title: "Cross Elasticity of Demand (XED)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9gC2r-k2TqE" },
              { title: "Consumer Surplus", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6lM7Y2hT5Kn" }
            ]
          },
          {
            id: "e1c3", num: 3,
            title: { zh: "供给与生产者行为", en: "Supply & Producer Behaviour" },
            overview: { zh: "学习供给曲线、供给法则、供给弹性以及生产者剩余的概念。", en: "Learn about supply curves, law of supply, supply elasticity, and producer surplus." },
            keyPoints: [
              "Law of supply: There is a direct (positive) relationship between price and quantity supplied, ceteris paribus",
              "Individual supply: The supply schedule for a single producer",
              "Market supply: The sum of all individual supplies at each price",
              "Movement along the supply curve: Caused by change in price of the good itself",
              "Shift of the supply curve: Caused by change in other factors (costs of production, technology, expectations, number of sellers, government policies)",
              "Price Elasticity of Supply (PES) measures how responsive quantity supplied is to a change in price",
              "PES > 1: Elastic; PES < 1: Inelastic; PES = 1: Unit elastic",
              "PES = 0: Perfectly inelastic (vertical supply curve) - goods that cannot be produced more",
              "PES = ∞: Perfectly elastic (horizontal supply curve)",
              "Factors affecting PES: Mobility of factors of production, ability to store output, time period (short-run vs long-run)",
              "Producer surplus: The benefit producers receive when they sell at a price higher than their minimum acceptable price",
              "Short-run supply: More elastic as firms can vary some inputs",
              "Long-run supply: More elastic as all factors can be adjusted"
            ],
            formulas: [
              { name: "供给价格弹性 (PES)", expr: "PES = (%ΔQs) / (%ΔP)" },
              { name: "生产者剩余 (Producer Surplus)", expr: "PS = Actual price - Minimum willing to accept" }
            ],
            examples: [
              {
                question: { zh: "如果某商品价格从8元上涨到10元，供给量从200件增加到280件。计算供给价格弹性。", en: "If the price of a good rises from $8 to $10, quantity supplied increases from 200 to 280 units. Calculate PES." },
                answer: { zh: "PES = (80/200) / (2/8) = 0.4 / 0.25 = 1.6 (弹性供给)。供给量变化百分比 = 40%，价格变化百分比 = 25%。", en: "PES = (80/200) ÷ (2/8) = 0.4 ÷ 0.25 = 1.6 (elastic supply). % change in quantity = 40%, % change in price = 25%." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "供给弹性的影响因素理解；区分短期与长期供给弹性",
            examTips: "PES与PED的对比是常见题型；注意时间因素对供给弹性的影响",
            youtube: [
              { title: "The Law of Supply", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=0E-4r7i7n5k" },
              { title: "Price Elasticity of Supply (PES)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=Kl8KFl1PF8w" },
              { title: "Producer Surplus", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nM8Y2hT3Kp" }
            ]
          },
          {
            id: "e1c4", num: 4,
            title: { zh: "市场均衡", en: "Market Equilibrium" },
            overview: { zh: "学习市场均衡的形成、价格机制的功能以及供需变化对均衡的影响。", en: "Learn about market equilibrium formation, functions of price mechanism, and effects of supply and demand changes on equilibrium." },
            keyPoints: [
              "Market equilibrium: The point where supply and demand intersect, where Qd = Qs",
              "Equilibrium price: The price at which quantity demanded equals quantity supplied",
              "Equilibrium quantity: The quantity traded at equilibrium price",
              "Excess supply (surplus): When Qs > Qd at current price, price tends to fall",
              "Excess demand (shortage): When Qd > Qs at current price, price tends to rise",
              "Price mechanism automatically adjusts to restore equilibrium through changes in price",
              "Functions of price mechanism: Signalling (indicates scarcity), Incentivising (encourages production), Rationing (allocates scarce resources)",
              "Changes in demand (shift): Increase in demand raises equilibrium price and quantity; decrease in demand has opposite effect",
              "Changes in supply (shift): Increase in supply lowers equilibrium price, raises quantity; decrease in supply has opposite effect",
              "Joint shifts in demand and supply: Effects depend on direction and magnitude of both shifts",
              "Simultaneous increase in demand and supply: Quantity definitely increases, price effect is ambiguous",
              "Simultaneous decrease in demand and supply: Quantity definitely decreases, price effect is ambiguous",
              "Increase in demand + decrease in supply: Price definitely rises, quantity effect is ambiguous"
            ],
            formulas: [
              { name: "均衡条件", expr: "Qd = Qs" },
              { name: "均衡价格", expr: "Where demand curve intersects supply curve" }
            ],
            examples: [
              {
                question: { zh: "如果需求增加同时供给减少，分析均衡价格和均衡数量的变化。", en: "If demand increases while supply decreases, analyse the change in equilibrium price and quantity." },
                answer: { zh: "均衡价格一定会上升（需求增加推高价格，供给减少也推高价格）。均衡数量的变化不确定，取决于需求和供给变化的相对幅度。", en: "Equilibrium price will definitely rise (increase in demand pushes price up, decrease in supply also pushes price up). The change in equilibrium quantity is uncertain, depending on the relative magnitude of changes in demand and supply." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "区分需求曲线的移动与需求量的变动；联合移动的分析",
            examTips: "画图分析是解答此类题目的关键；注意按步骤分析：先看需求变化，再看供给变化，最后综合",
            youtube: [
              { title: "Market Equilibrium", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=SUoAEjM7k7Y" },
              { title: "Shifts in Demand and Supply", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9Gx2G8W5qX0" },
              { title: "Joint Shifts in D and S", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lM84KY2hTq" }
            ]
          },
          {
            id: "e1c5", num: 5,
            title: { zh: "市场失灵", en: "Market Failure" },
            overview: { zh: "学习市场失灵的原因：外部性、公共物品、信息不对称等问题。", en: "Learn about market failure causes: externalities, public goods, information asymmetry." },
            keyPoints: [
              "Market failure occurs when the market fails to allocate resources efficiently, resulting in welfare loss",
              "Positive externalities: Benefits to third parties from production/consumption, leading to underconsumption (too little produced)",
              "Negative externalities: Costs to third parties from production/consumption, leading to overproduction (too much produced)",
              "Marginal Private Cost (MPC): The cost to the producer of producing an additional unit",
              "Marginal Social Cost (MSC): The total cost to society = MPC + Marginal External Cost (MEC)",
              "Marginal Private Benefit (MPB): Benefit to the consumer of consuming an additional unit",
              "Marginal Social Benefit (MSB): Total benefit to society = MPB + Marginal External Benefit (MEB)",
              "Market equilibrium with externalities: Where MPB = MPC (not socially optimal)",
              "Socially optimal output: Where MSB = MSC",
              "Deadweight loss: Welfare loss due to market failure, shown as triangle between market output and socially optimal output",
              "Public goods: Non-excludable (cannot prevent people from using) and non-rivalrous (one person's use doesn't reduce availability)",
              "Examples of public goods: Street lighting, national defence, lighthouses",
              "Free-rider problem: People can benefit without paying, leading to underprovision",
              "Merit goods: Positive externalities, should be provided more than market would (e.g., education, healthcare)",
              "Demerit goods: Negative externalities, should be provided less than market would (e.g., cigarettes, alcohol)",
              "Asymmetric information: When one party has more information than another",
              "Moral hazard: One party takes risks because another bears the cost",
              "Adverse selection: Bad characteristics hidden from buyer before transaction",
              "Speculation: Buying assets hoping to sell at higher price, can cause market bubbles"
            ],
            formulas: [
              { name: "社会成本 (MSC)", expr: "MSC = MPC + MEC" },
              { name: "社会收益 (MSB)", expr: "MSB = MPB + MEB" },
              { name: "福利损失 (Deadweight Loss)", expr: "DWL = ½ × (Qmarket - Qoptimal) × (MSC - MPC at Qoptimal)" }
            ],
            examples: [
              {
                question: { zh: "为什么市场化学生会教育导致外部性？说明正外部性和负外部性各如何影响市场结果。", en: "Why does market provision of education lead to externalities? Explain how positive and negative externalities affect market outcomes." },
                answer: { zh: "教育具有正外部性：受教育者获得私人收益，同时社会也受益（更健康的公民、更高的税收、更少的犯罪）。市场均衡产量低于社会最优产量，因为私人边际收益低于社会边际收益。", en: "Education has positive externalities: educated individuals receive private benefits while society also benefits (healthier citizens, higher tax revenue, less crime). Market equilibrium quantity is below socially optimal because private marginal benefit is less than social marginal benefit." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "外部性图形的绘制与分析；公共物品的非排他性理解；区分不同类型的市场失灵",
            examTips: "市场失灵的解决方案是Essay的高频考点；掌握图形分析（供需曲线 + MSC/MSB曲线）",
            youtube: [
              { title: "Market Failure - Introduction", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7D8r0o3q9XQ" },
              { title: "Negative Externalities", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8hHXq5sT3TY" },
              { title: "Positive Externalities", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5kM8Y2hT3Lq" },
              { title: "Public Goods", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6lN7Y2hT4Kp" },
              { title: "Asymmetric Information", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mK7Y2hT5Lr" }
            ]
          },
          {
            id: "e1c6", num: 6,
            title: { zh: "政府干预", en: "Government Intervention" },
            overview: { zh: "学习政府干预市场的各种手段及其效果。", en: "Learn about various government interventions in markets and their effects." },
            keyPoints: [
              "Indirect taxes: Taxes on goods and services, can be ad valorem (percentage) or specific (fixed amount)",
              "Effect of tax: Shifts supply curve left by tax amount, raises price, reduces quantity traded",
              "Tax incidence/burden: Depends on PED and PES - more elastic side bears less burden",
              "Subsidies: Government payments to producers/consumers to lower price and increase output",
              "Effect of subsidy: Shifts supply curve right by subsidy amount, lowers price, increases quantity",
              "Subsidy cost: Government expenditure equal to subsidy × quantity",
              "Maximum price (price ceiling): Legal maximum price, creates excess demand if set below equilibrium",
              "Minimum price (price floor): Legal minimum price, creates excess supply if set above equilibrium",
              "Minimum wage: A price floor for labour, intended to raise wages but may cause unemployment",
              "Regulation: Government rules controlling business behaviour (e.g., safety standards, pollution controls)",
              "Competition policy: Laws to promote competition and prevent monopolies (e.g., breaking up monopolies)",
              "Government failure: When government intervention worsens market outcome or creates new problems",
              "Causes of government failure: Unintended consequences, imperfect information, political pressures, bureaucratic inefficiency",
              "Tradeable permits: Market-based approach to control pollution, firms can buy/sell permits"
            ],
            formulas: [
              { name: "税收归宿", expr: "Tax burden depends on PED and PES elasticity" },
              { name: "补贴效果", expr: "Subsidy shifts supply curve right by subsidy amount" },
              { name: "税收收入", expr: "Tax revenue = Tax × Quantity traded" }
            ],
            examples: [
              {
                question: { zh: "政府对某商品征收从量税2元。如果该商品的需求价格弹性为0.5，供给价格弹性为1.0，税收负担如何分配？", en: "Government imposes a specific tax of $2 on a good. If PED = 0.5 and PES = 1.0, how is the tax burden distributed?" },
                answer: { zh: "由于需求弹性小于供给弹性，消费者承担更大税收负担。消费者支付价格上升，生产者实际得到的价格下降，差额为税收。", en: "Since demand elasticity is lower than supply elasticity, consumers bear a larger tax burden. The price paid by consumers rises, while the price received by producers falls, with the difference being the tax." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "税收与补贴的图形分析；政府失败的原因；最高限价与最低限价的效应",
            examTips: "比较不同干预手段的优缺点；注意分析长期效应与短期效应的区别",
            youtube: [
              { title: "Indirect Taxes", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3p7qE9k0Z4n" },
              { title: "Subsidies", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9G7rK2sY1Qw" },
              { title: "Price Controls - Minimum Price", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5Rx8rY2eL8M" },
              { title: "Price Controls - Maximum Price", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nM8Y2hT3Kp" }
            ]
          }
        ]
      },
      Unit2: {
        id: "Unit2",
        title: { zh: "宏观经济表现与政策", en: "Macroeconomic Performance and Policy" },
        subtitle: { zh: "宏观经济学基础", en: "Macroeconomics Foundations" },
        color: "#1565C0",
        chapters: [
          {
            id: "e2c1", num: 1,
            title: { zh: "经济表现衡量", en: "Economic Performance Measures" },
            overview: { zh: "学习衡量经济表现的四大指标：经济增长、通胀、失业、国际收支。", en: "Learn the four main indicators of economic performance: economic growth, inflation, unemployment, balance of payments." },
            keyPoints: [
              "Economic growth: Increase in real GDP over time, measured as percentage change",
              "GDP (Gross Domestic Product): Total value of final goods and services produced within a country in a given period",
              "GNI (Gross National Income): GDP + Net income from abroad",
              "Nominal GDP: Measured at current prices, affected by inflation",
              "Real GDP: Adjusted for inflation, measures actual output change",
              "GDP calculation methods: Expenditure approach (C+I+G+X-M), Income approach, Output/Production approach",
              "Inflation: Sustained increase in general price level over time",
              "CPI (Consumer Price Index): Measures cost of representative basket of consumer goods",
              "RPI (Retail Price Index): Includes housing costs and mortgage interest",
              "GDP Deflator: Broader measure, includes all domestically produced goods",
              "Inflation rate: Percentage change in price index",
              "Demand-pull inflation: Too much money chasing too few goods (excess AD)",
              "Cost-push inflation: Rising costs push prices up (negative AS shock)",
              "Unemployment: People of working age actively seeking work but unable to find it",
              "Labour force: Employed + Unemployed",
              "Unemployment rate: Unemployed / Labour force × 100%",
              "Types of unemployment: Frictional (between jobs), Structural (skills mismatch), Seasonal, Cyclical (demand-deficient)",
              "Balance of payments: Record of all economic transactions between residents and rest of world",
              "Current account: Trade in goods (balance of trade), services, income, current transfers"
            ],
            formulas: [
              { name: "GDP增长率", expr: "(Real GDP₂ - Real GDP₁) / Real GDP₁ × 100%" },
              { name: "实际GDP", expr: "Real GDP = Nominal GDP / Price index × 100" },
              { name: "失业率", expr: "Unemployment rate = Unemployed / Labour force × 100%" },
              { name: "经常账户余额", expr: "CA = X - M + NI + NT" }
            ],
            examples: [
              {
                question: { zh: "如果名义GDP为1000亿元，价格指数为100；今年名义GDP为1100亿元，价格指数为110。计算实际GDP增长率。", en: "If nominal GDP is $1000 billion with price index 100; this year nominal GDP is $1100 billion with price index 110. Calculate real GDP growth rate." },
                answer: { zh: "去年实际GDP = 1000/100×100 = 1000亿元；今年实际GDP = 1100/110×100 = 1000亿元；实际GDP增长率为0%。", en: "Last year's real GDP = 1000/100×100 = 1000; This year's real GDP = 1100/110×100 = 1000; Real GDP growth rate = 0%." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "区分名义GDP与实际GDP；理解各类失业类型；计算通货膨胀率",
            examTips: "各指标的定义与计算必须熟练；注意区分不同价格指数的应用场景",
            youtube: [
              { title: "GDP and Economic Growth", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=n-Yp5LHSmGk" },
              { title: "Inflation and CPI", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=W7y5J2jGDlM" },
              { title: "Unemployment", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5Z8uZ2vK4sE" },
              { title: "Balance of Payments", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4lM7Y2hT3Kp" }
            ]
          },
          {
            id: "e2c2", num: 2,
            title: { zh: "总需求", en: "Aggregate Demand" },
            overview: { zh: "学习总需求的构成要素及其影响因素。", en: "Learn the components of aggregate demand and factors affecting them." },
            keyPoints: [
              "Aggregate Demand (AD): Total planned/expenditure on final goods and services at each price level",
              "AD = C + I + G + (X - M)",
              "Consumption (C): Household spending on goods and services, largest component",
              "Factors affecting consumption: Income, wealth, interest rates, expectations, consumer confidence",
              "Investment (I): Spending by firms on capital goods (machinery, buildings), most volatile component",
              "Factors affecting investment: Interest rates, expected returns, business confidence, technology",
              "Government expenditure (G): Spending on goods and services by government",
              "Net exports (X - M): Exports minus imports",
              "Why AD curve slopes downward: Wealth effect (P↓ → real wealth ↑ → C↑), Interest rate effect (P↓ → money demand ↓ → i↓ → I↑), Import effect (P↓ → imports ↑ → X-M↓)",
              "Shifts in AD curve: Changes in C, I, G, X-M due to non-price factors",
              "Components of AD can be influenced by fiscal policy (G, T) and monetary policy (interest rates)",
              "Multiplier effect: Initial change in spending leads to larger final change in income"
            ],
            formulas: [
              { name: "总需求", expr: "AD = C + I + G + (X - M)" },
              { name: "边际消费倾向 (MPC)", expr: "MPC = ΔC / ΔY" },
              { name: "边际储蓄倾向 (MPS)", expr: "MPS = ΔS / ΔY = 1 - MPC" }
            ],
            examples: [
              {
                question: { zh: "如果边际消费倾向为0.8，政府增加100亿元支出，总需求会增加多少？", en: "If MPC is 0.8, government increases spending by $10 billion. How much will aggregate demand increase?" },
                answer: { zh: "乘数 = 1/(1-0.8) = 5。总需求增加 = 100亿 × 5 = 500亿元。", en: "Multiplier = 1/(1-0.8) = 5. AD increase = $10 billion × 5 = $50 billion." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "各组成部分的影响因素；AD曲线向下倾斜的三个原因",
            examTips: "AD曲线的移动分析；注意区分移动与沿着曲线移动",
            youtube: [
              { title: "Aggregate Demand", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4t3b2-Y5JkA" },
              { title: "Components of AD", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=K8x7G2Y6-Xw" },
              { title: "Consumption Function", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7lM8Y2hT3Kp" }
            ]
          },
          {
            id: "e2c3", num: 3,
            title: { zh: "总供给", en: "Aggregate Supply" },
            overview: { zh: "学习短期与长期总供给曲线的区别。", en: "Learn about short-run and long-run aggregate supply curves." },
            keyPoints: [
              "Aggregate Supply (AS): Total quantity of final goods and services produced at each price level",
              "Short-run Aggregate Supply (SRAS): Upward sloping, some input costs fixed",
              "Long-run Aggregate Supply (LRAS): Vertical at full employment output, all costs flexible",
              "Keynesian LRAS: Horizontal in deep recession, becomes upward sloping, then vertical at capacity",
              "Classical LRAS: Always vertical at full employment (potential GDP)",
              "Potential GDP: Maximum sustainable output without accelerating inflation",
              "Actual GDP: Can be above or below potential GDP",
              "Output gap: Actual GDP - Potential GDP",
              "Positive output gap (Inflationary gap): Actual > Potential, upward pressure on prices",
              "Negative output gap (Deflationary gap): Actual < Potential, unemployment above natural rate",
              "Factors that shift SRAS: Input costs, expectations, productivity, subsidies/taxes on production",
              "Factors that shift LRAS: Technology, quantity/quality of resources, institutional factors",
              "Economic growth: Rightward shift in LRAS"
            ],
            formulas: [
              { name: "产出缺口", expr: "Output gap = Actual GDP - Potential GDP" },
              { name: "增长率差距", expr: "Gap = Actual growth rate - Potential growth rate" }
            ],
            examples: [
              {
                question: { zh: "解释为什么SRAS曲线向上倾斜而LRAS曲线垂直。", en: "Explain why the SRAS curve slopes upward while the LRAS curve is vertical." },
                answer: { zh: "短期：一些投入成本固定，价格上升使实际收益增加，产量增加。长期：所有投入成本可调整，产量由潜在产出决定，与价格无关。", en: "Short-run: Some input costs are fixed, higher prices increase real revenue, output increases. Long-run: All input costs are adjustable, output is determined by potential output, unrelated to price level." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "SRAS与LRAS的区别；古典与凯恩斯观点的对比；理解潜在产出概念",
            examTips: "结合AD-AS模型分析宏观经济；区分短期与长期效应",
            youtube: [
              { title: "Short-run Aggregate Supply", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9g7rK3Y2HxU" },
              { title: "Long-run Aggregate Supply", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5s8Y2hK3lPs" },
              { title: "AD-AS Model", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6nM7Y2hT4Lq" }
            ]
          },
          {
            id: "e2c4", num: 4,
            title: { zh: "国民收入", en: "National Income" },
            overview: { zh: "学习国民收入的决定与乘数效应。", en: "Learn about national income determination and the multiplier effect." },
            keyPoints: [
              "Equilibrium national income: Where AD = AS (or planned spending = actual output)",
              "Injections: Investment (I), Government spending (G), Exports (X)",
              "Withdrawals (Leakages): Savings (S), Taxes (T), Imports (M)",
              "Equilibrium condition: Injections = Withdrawals (I + G + X = S + T + M)",
              "Multiplier effect: Initial change in spending leads to larger final change in income",
              "Marginal Propensity to Consume (MPC): Fraction of additional income spent",
              "Marginal Propensity to Save (MPS): Fraction of additional income saved",
              "MPC + MPS = 1",
              "Multiplier (k): Change in equilibrium income / Initial change in spending",
              "Multiplier formula: k = 1 / (1 - MPC) = 1 / MPS",
              "Higher MPC → Larger multiplier → Greater impact on income",
              "Leakages (withdrawals) reduce the multiplier effect",
              "Deflationary gap: Need to increase AD to reach full employment",
              "Inflationary gap: Need to decrease AD to reach price stability"
            ],
            formulas: [
              { name: "乘数 (Multiplier)", expr: "k = 1 / (1 - MPC)" },
              { name: "均衡条件", expr: "I + G + X = S + T + M" },
              { name: "均衡收入变化", expr: "ΔY = k × Initial Δ spending" }
            ],
            examples: [
              {
                question: { zh: "如果MPC为0.75，进口增加50亿元对国民收入的影响是什么？", en: "If MPC is 0.75, what is the effect of a $5 billion increase in imports on national income?" },
                answer: { zh: "进口增加相当于 withdrawals 增加。乘数 = 1/(1-0.75) = 4。收入减少 = 50亿 × 4 × (1-0.75) = 50亿。", en: "Increase in imports is a leakage. Multiplier = 1/(1-0.75) = 4. Income decreases by $5 billion." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "乘数的计算与应用；漏损的理解；注入与漏损的平衡",
            examTips: "乘数效应的大小取决于MPC；注意区分不同注入或漏损的影响",
            youtube: [
              { title: "National Income Equilibrium", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8hY7pT4nKjU" },
              { title: "The Multiplier Effect", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7s6Y9hT3LsM" },
              { title: "Injections and Withdrawals", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3nL7Y2hT4Kq" }
            ]
          },
          {
            id: "e2c5", num: 5,
            title: { zh: "经济增长", en: "Economic Growth" },
            overview: { zh: "学习经济增长的衡量、来源及其政策。", en: "Learn about the measurement, sources and policies of economic growth." },
            keyPoints: [
              "Economic growth: Sustained increase in productive capacity of an economy over time",
              "GDP growth rate: Annual percentage change in real GDP",
              "Actual economic growth: Movement of actual GDP over time",
              "Potential economic growth: Growth in potential GDP (LRAS shift)",
              "Sustainable growth: Long-term growth that can be maintained without depleting resources",
              "Benefits of growth: Higher living standards, reduced poverty, more tax revenue for public services, improved welfare",
              "Costs of growth: Environmental damage, inequality, resource depletion, cultural impacts",
              "Sources of growth: Capital accumulation (investment), Labour force growth, Productivity improvements (technology, education)",
              "Investment: Spending on capital goods that increases productive capacity",
              "Human capital: Skills and knowledge of workforce through education and training",
              "Technology: New methods of production, innovation, research and development",
              "Capital widening: Adding more capital but maintaining capital per worker ratio",
              "Capital deepening: Increasing capital per worker, leading to higher productivity",
              "Productivity: Output per worker or per hour worked",
              "Labour productivity: Real GDP / Total labour hours",
              "Multi-factor productivity: Growth not explained by capital or labour inputs",
              "Growth strategies: Education and training, Investment incentives, Infrastructure development, Trade openness, Technology transfer"
            ],
            formulas: [
              { name: "经济增长率", expr: "Growth rate = (Real GDP₂ - Real GDP₁) / Real GDP₁ × 100%" },
              { name: "劳动生产率", expr: "Labour productivity = Real GDP / Total labour hours" },
              { name: "人均产出", expr: "Real GDP per capita = Real GDP / Population" }
            ],
            examples: [
              {
                question: { zh: "解释为什么技术进步对长期经济增长最重要。", en: "Explain why technological progress is most important for long-term economic growth." },
                answer: { zh: "技术进步可以提高全要素生产率，使相同数量的资本和劳动力产出更多。它不依赖于资源投入，是可持续的增长来源。", en: "Technology improves total factor productivity, allowing more output from the same inputs. It doesn't rely on resource inputs and is a sustainable source of growth." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "区分实际增长与潜在增长；理解增长的来源",
            examTips: "分析经济增长的利弊；理解人均GDP与生活水平的关系",
            youtube: [
              { title: "Economic Growth", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4mN8Y2hT3Kp" },
              { title: "Sources of Growth", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7pL8Y2hT4Kq" },
              { title: "Productivity", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lN8Y2hT3Kq" }
            ]
          },
          {
            id: "e2c6", num: 6,
            title: { zh: "宏观经济政策", en: "Macroeconomic Policy" },
            overview: { zh: "学习宏观经济政策的目标与工具。", en: "Learn about macroeconomic policy objectives and instruments." },
            keyPoints: [
              "Macroeconomic objectives: Sustainable economic growth, low inflation, full employment, equilibrium in balance of payments",
              "Fiscal policy: Government decisions about spending (G) and taxation (T)",
              "Expansionary fiscal policy: Increase G or decrease T to boost AD (during recession)",
              "Contractionary fiscal policy: Decrease G or increase T to reduce AD (during inflation)",
              "Budget surplus: T > G; Budget deficit: G > T; Balanced budget: T = G",
              "Automatic stabilizers: Built-in mechanisms that reduce fluctuations (e.g., progressive tax, unemployment benefits)",
              "Monetary policy: Control of money supply and interest rates by central bank",
              "Expansionary monetary policy: Increase money supply, lower interest rates to boost AD",
              "Contractionary monetary policy: Decrease money supply, raise interest rates to reduce AD",
              "Taylor Rule: Guidelines for setting interest rates based on inflation and output gaps",
              "Supply-side policies: Aim to increase LRAS (potential output)",
              "Supply-side policies: Education/training, incentives to work/invest, deregulation, trade liberalisation",
              "Policy conflicts: Phillips curve shows inverse relationship between unemployment and inflation",
              "Conflicts: Growth vs inflation (need to balance), Growth vs balance of payments",
              "Evaluation of policies: Effectiveness, time lags, side effects, political constraints"
            ],
            formulas: [
              { name: "预算盈余", expr: "Budget surplus = T - G" },
              { name: "预算赤字", expr: "Budget deficit = G - T" },
              { name: "预算乘数", expr: "G multiplier = 1/(1-MPC); T multiplier = -MPC/(1-MPC)" }
            ],
            examples: [
              {
                question: { zh: "比较财政政策与货币政策的优缺点。", en: "Compare the advantages and disadvantages of fiscal policy versus monetary policy." },
                answer: { zh: "财政政策：直接但受政治影响，可能产生挤出效应。货币政策：独立性强但有时滞，对投资影响间接。", en: "Fiscal policy: Direct impact but subject to political influence, may cause crowding out. Monetary policy: More independent but has lags, indirect effect on investment." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "政策组合的分析；目标冲突的理解；评估政策效果",
            examTips: "评估不同政策的优缺点；注意政策时滞的影响",
            youtube: [
              { title: "Fiscal Policy", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6kJ8Y2hT5lP" },
              { title: "Monetary Policy", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9mN4Y3sK6tU" },
              { title: "Supply-side Policies", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3lM7Y2hT8kV" },
              { title: "Phillips Curve", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nM7Y2hT3Kp" }
            ]
          }
        ]
      },
      Unit3: {
        id: "Unit3",
        title: { zh: "商业行为", en: "Business Behaviour" },
        subtitle: { zh: "微观经济学进阶", en: "Advanced Microeconomics" },
        color: "#0D47A1",
        chapters: [
          {
            id: "e3c1", num: 1,
            title: { zh: "企业类型与规模", en: "Business Types & Size" },
            overview: { zh: "学习不同类型企业的特点、优势与劣势，以及规模经济。", en: "Learn about different types of businesses, their characteristics, advantages and disadvantages, and economies of scale." },
            keyPoints: [
              "Sole proprietorships (个体企业): Single owner, unlimited liability, easy to set up, all profits kept, difficulty raising capital",
              "Partnerships (合伙企业): 2-20 partners, shared ownership, joint liability (or limited liability for LLP), combines skills",
              "Corporations/Companies (公司): Separate legal entity, limited liability, can raise capital through shares, double taxation, separation of ownership and management",
              "Public sector (公共部门): Government-owned, aims to provide services rather than profit",
              "Private sector (私人部门): Privately owned, aims to maximize profit",
              "Multinational corporations (MNCs): Operate in multiple countries, benefit from economies of scale, can exploit differences in costs",
              "Small and medium enterprises (SMEs): Significant employer, flexible, local market focus, limited access to finance",
              "Business objectives: Profit maximization, revenue maximization, market share growth, survival, stakeholder interests",
              // Economies of scale content
              "Economies of scale (规模经济): Unit costs fall as output increases",
              "Internal economies of scale: Cost advantages from within the firm",
              "  - Technical economies: Larger machines, specialisation, by-products",
              "  - Managerial economies: Specialised management, better monitoring",
              "  - Financial economies: Lower interest rates, easier access to capital",
              "  - Marketing economies: Bulk buying, advertising spread over larger output",
              "  - Risk-bearing economies: Diversification across products/markets",
              "External economies of scale: Cost advantages from industry growth",
              "  - Infrastructure development, skilled labour pool, support services",
              "Diseconomies of scale: Unit costs rise at very high output levels",
              "  - Communication problems, bureaucracy, reduced motivation, coordination difficulties"
            ],
            formulas: [
              { name: "规模经济", expr: "AC falls as Q increases" },
              { name: "规模不经济", expr: "AC rises as Q increases" },
              { name: "长期平均成本", expr: "LAC = Lowest point of short-run AC curves" }
            ],
            examples: [
              {
                question: { zh: "比较个体企业与公司的优缺点。", en: "Compare the advantages and disadvantages of sole proprietorships versus corporations." },
                answer: { zh: "个体企业：设立简单，无双重课税，但承担无限责任，融资困难。公司：有限责任，融资容易，但设立复杂，双重课税。", en: "Sole proprietorship: Easy to set up, no double taxation, unlimited liability, difficult to raise capital. Corporation: Limited liability, easy to raise capital, complex to set up, double taxation." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "不同企业类型的法律责任区分；理解企业的不同目标",
            examTips: "理解不同规模企业的特点；能分析企业类型选择的考量因素",
            youtube: [
              { title: "Types of Business Organisation", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8s4Y2hT3KlU" },
              { title: "Sole Proprietors vs Corporations", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lM7Y2hT3Kp" }
            ]
          },
          {
            id: "e3c2", num: 2,
            title: { zh: "收益、成本与利润", en: "Revenue, Costs & Profit" },
            overview: { zh: "学习企业的收益结构、成本分类与利润最大化条件。", en: "Learn about business revenue structure, cost classification, and profit maximisation conditions." },
            keyPoints: [
              "Total Revenue (TR): Total income from sales = P × Q",
              "Average Revenue (AR): TR / Q = Revenue per unit",
              "Marginal Revenue (MR): Change in TR from producing one more unit",
              "In perfect competition: AR = MR = P (horizontal demand curve)",
              "In imperfect competition: MR < AR (downward sloping demand)",
              "Fixed Costs (FC): Costs that don't change with output (rent, salaries)",
              "Variable Costs (VC): Costs that change with output (raw materials, wages)",
              "Total Costs (TC): FC + VC",
              "Average Costs (AC): TC / Q",
              "Marginal Cost (MC): Change in TC from producing one more unit",
              "Relationship: MC curve intersects AC curve at minimum AC (bell-shaped MC)",
              "Normal profit: Minimum return to keep resources in current use",
              "Abnormal/Supernormal profit: Revenue exceeds all costs (including normal profit)",
              "Loss: When revenue < total costs",
              "Profit maximisation rule: MR = MC (producing one more adds more revenue than cost)"
            ],
            formulas: [
              { name: "总收益 (TR)", expr: "TR = P × Q" },
              { name: "平均收益 (AR)", expr: "AR = TR / Q" },
              { name: "边际收益 (MR)", expr: "MR = ΔTR / ΔQ" },
              { name: "平均成本 (AC)", expr: "AC = TC / Q" },
              { name: "边际成本 (MC)", expr: "MC = ΔTC / ΔQ" },
              { name: "利润", expr: "π = TR - TC" },
              { name: "利润最大化条件", expr: "MR = MC" }
            ],
            examples: [
              {
                question: { zh: "某企业边际收益为20元，边际成本为15元。请问企业应该增加还是减少产量？为什么？", en: "A firm's marginal revenue is $20 and marginal cost is $15. Should the firm increase or decrease output? Why?" },
                answer: { zh: "应该增加产量。因为MR>MC，生产额外一单位产品带来的收益大于成本，增加产量会增加利润。", en: "Should increase output. Because MR>MC, producing an extra unit brings more revenue than cost, increasing output will increase profit." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "边际收益与边际成本的分析；区分不同市场结构下的收益曲线",
            examTips: "MR=MC是利润最大化的核心原则；注意完美竞争与垄断的区别",
            youtube: [
              { title: "Revenue Curves", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4lM7Y2hT3Kp" },
              { title: "Cost Curves", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7nK8Y2hT5Ls" },
              { title: "Profit Maximisation", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3jM7Y2hT4Kq" },
              { title: "Normal and Supernormal Profit", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nM7Y2hT3Kq" }
            ]
          },
          {
            id: "e3c3", num: 3,
            title: { zh: "市场结构", en: "Market Structure" },
            overview: { zh: "学习不同市场结构的特点与企业行为，包括博弈论分析。", en: "Learn about different market structures and business behaviour, including game theory analysis." },
            keyPoints: [
              "Perfect competition (完全竞争): Many buyers/sellers, homogeneous product, no barriers to entry/exit, price takers, normal profit in long-run",
              "Monopoly (垄断): Single seller, high barriers to entry, price maker, can earn supernormal profit",
              "Monopolistic competition (垄断竞争): Many sellers, differentiated products, low barriers, some advertising, non-price competition",
              "Oligopoly (寡头): Few large firms, high barriers, interdependence, game theory, collusion possible",
              "Barriers to entry: Economies of scale, brand loyalty, patents, control of resources, legal restrictions",
              "Contestability (可竞争性): Low barriers to entry/exit, hit-and-run competition, forces efficiency",
              "Productive efficiency: Producing at lowest possible cost (where MC = AC)",
              "Allocative efficiency: Producing what society values most (where P = MC)",
              "X-inefficiency: Costs above minimum due to lack of competition",
              "Lerner Index: Measures market power L = (P - MC) / P, higher = more monopoly power",
              "Price discrimination: Charging different prices to different groups for same product",
              // Game Theory content
              "Game theory (博弈论): Strategic interaction between firms in oligopoly markets",
              "Payoff matrix (收益矩阵): Shows outcomes for each firm based on their choices",
              "Nash equilibrium (纳什均衡): Each firm chooses best strategy given what others are doing",
              "Dominant strategy: Best choice regardless of what other firms do",
              "Prisoners' dilemma (囚徒困境): Individual rationality leads to worse collective outcome",
              "Collusion vs Competition: Firms may collude to earn monopoly profits or compete aggressively",
              "Cartels (卡特尔): Formal agreement to fix prices/output, often illegal",
              "Tit-for-tat strategy: Begin with cooperation, then copy opponent's last move"
            ],
            formulas: [
              { name: "垄断定价", expr: "MR = MC for profit maximisation" },
              { name: "勒纳指数 (Lerner Index)", expr: "L = (P - MC) / P" },
              { name: "赫芬达尔指数 (HHI)", expr: "HHI = Σ(Market share)²" },
              { name: "博弈论收益", expr: "Each cell shows (Payoff A, Payoff B)" }
            ],
            examples: [
              {
                question: { zh: "比较完全竞争与垄断的效率差异。", en: "Compare the efficiency of perfect competition versus monopoly." },
                answer: { zh: "完全竞争：生产效率高(P=MC=AC最低)，配置效率高(P=MC)。垄断：产量低，价格高，存在无谓损失(DWL)。", en: "Perfect competition: High productive efficiency (P=MC=AC at minimum), high allocative efficiency. Monopoly: Lower output, higher price, deadweight loss." }
              },
              {
                question: { zh: "使用博弈论解释寡头企业为什么会陷入'囚徒困境'。", en: "Use game theory to explain why oligopoly firms fall into a 'prisoners' dilemma'." },
                answer: { zh: "每个企业都担心对手会背叛合作协议来获取优势，因此都选择不合作。即使双方合作能带来更高的集体收益（像垄断一样），但个体理性的选择导致竞争结局。", en: "Each firm fears the opponent will betray the cooperation agreement to gain advantage, so both choose not to cooperate. Even though cooperation would bring higher collective payoffs (like monopoly), individual rational choice leads to competitive outcome." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "不同市场结构的长期与短期均衡分析；理解效率概念；博弈论矩阵分析；纳什均衡的识别",
            examTips: "比较各市场结构的效率；掌握图形分析；理解博弈论在寡头市场中的应用",
            youtube: [
              { title: "Perfect Competition", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=9lN4Y2hT3Kj" },
              { title: "Monopoly", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5mK7Y2hT6Ls" },
              { title: "Monopolistic Competition", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6nL7Y2hT4Kq" },
              { title: "Oligopoly", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8pK8Y2hT4Mm" },
              { title: "Game Theory in Oligopoly", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7mK8Y2hT5Lq" }
            ]
          },
          {
            id: "e3c4", num: 4,
            title: { zh: "劳动力市场", en: "Labour Market" },
            overview: { zh: "学习劳动力需求、供给与工资决定。", en: "Learn about labour demand, supply, and wage determination." },
            keyPoints: [
              "Derived demand: Demand for labour depends on demand for the product it produces",
              "Marginal Revenue Product of Labour (MRPL): Additional revenue from employing one more worker",
              "MRPL = Marginal Physical Product of Labour (MPN) × Marginal Revenue (MR)",
              "In perfect competition: MR = P, so MRPL = MP × P",
              "Labour demand curve: Downward sloping (as wage falls, more workers hired)",
              "Factors shifting labour demand: Product demand, productivity, technology, price of other inputs",
              "Wage determination in perfect competition: Wage = MRPL = Supply (at equilibrium)",
              "Trade unions: Organizations that bargain with employers on behalf of workers",
              "Union objectives: Higher wages, better working conditions, job security",
              "Ways to raise wages: Limit supply (restrict immigration), Increase demand (collective bargaining), Minimum wage",
              "Minimum wage: Government-mandated wage floor, raises wages but may cause unemployment",
              "Labour market discrimination: Unequal treatment based on race, gender, age, etc.",
              "Efficiency wage theory: Paying above equilibrium to increase productivity"
            ],
            formulas: [
              { name: "劳动边际产出 (MRPL)", expr: "MRPL = MPₗ × MR" },
              { name: "边际物质产品 (MPN)", expr: "MPN = ΔQ / ΔL" },
              { name: "工资决定", expr: "W = MRPL = Supply at equilibrium" }
            ],
            examples: [
              {
                question: { zh: "解释为什么劳动力需求是派生需求。", en: "Explain why labour demand is derived demand." },
                answer: { zh: "企业对劳动力的需求取决于其产品的需求。企业雇佣劳动力是为了生产产品出售获利，因此对劳动力的需求是从对产品的需求派生出来的。", en: "Firms' demand for labour depends on the demand for their products. Firms hire labour to produce goods for sale, so demand for labour is derived from product demand." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解劳动力的派生需求；分析工会的影响",
            examTips: "分析工会对工资与就业的影响；理解最低工资的效应",
            youtube: [
              { title: "Labour Market", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6lM7Y2hT5Kn" },
              { title: "Demand for Labour", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nK7Y2hT3Lj" },
              { title: "Trade Unions", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lN8Y2hT3Kq" },
              { title: "Minimum Wage", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7mN8Y2hT4Lr" }
            ]
          },
          {
            id: "e3c5", num: 5,
            title: { zh: "政府干预与竞争政策", en: "Government Intervention & Competition Policy" },
            overview: { zh: "学习政府对企业行为的管制政策。", en: "Learn about government regulations on business behaviour." },
            keyPoints: [
              "Competition policy: Government actions to promote competition and prevent monopoly power",
              "Aims of competition policy: Efficiency, consumer welfare, fair competition, innovation",
              "Mergers: Two or more firms combining: Horizontal (same industry), Vertical (different stages), Conglomerate (unrelated)",
              "Reasons for mergers: Economies of scale, market power, diversification, synergy",
              "Concerns about mergers: Reduced competition, higher prices, barriers to entry",
              "Regulation of natural monopolies: Single firm with lowest costs, price regulation (cost-plus, price cap)",
              "Privatisation: Transferring state-owned enterprises to private sector",
              "Arguments for privatisation: Efficiency, competition, accountability, funding",
              "Arguments against: Natural monopolies, public interest, inequality",
              "Anti-competitive behaviour: Cartels, price-fixing, market sharing, abuse of dominance",
              "Competition authorities: Investigate and penalise anti-competitive practices"
            ],
            formulas: [
              { name: "HHI指数", expr: "HHI = Σ(Market share)², >2500=高集中度" },
              { name: "自然垄断管制", expr: "成本加成: 允许成本+合理利润；价格上限: RPI-X" }
            ],
            examples: [
              {
                question: { zh: "为什么自然垄断需要政府管制？", en: "Why do natural monopolies require government regulation?" },
                answer: { zh: "自然垄断的边际成本很低，如果多家竞争会导致重复建设和社会资源浪费。但如果让其自然发展，会索取垄断价格，损害消费者利益。", en: "Natural monopolies have very low marginal costs, if multiple firms compete it would cause redundant construction and waste. But if left unregulated, they would charge monopoly prices, harming consumers." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "自然垄断的管制方法；理解合并的类型与影响",
            examTips: "评估政府干预的效果；分析不同政策的利弊",
            youtube: [
              { title: "Competition Policy", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7lM7Y2hT4Mk" },
              { title: "Mergers", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nK7Y2hT3Lj" },
              { title: "Natural Monopoly", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mN8Y2hT4Lq" }
            ]
          }
        ]
      },
      Unit4: {
        id: "Unit4",
        title: { zh: "全球经济发展", en: "Developments in the Global Economy" },
        subtitle: { zh: "宏观经济学进阶", en: "Advanced Macroeconomics" },
        color: "#0A3D8F",
        chapters: [
          {
            id: "e4c1", num: 1,
            title: { zh: "全球化", en: "Globalisation" },
            overview: { zh: "学习全球化的原因、表现及其影响。", en: "Learn about the causes, manifestations and impacts of globalisation." },
            keyPoints: [
              "Globalisation: Increasing interconnectedness and integration of world economies through trade, investment, and technology",
              "Causes of globalisation: Improvements in technology (transport, communication), Trade liberalisation (lower barriers), Capital mobility (free movement of finance)",
              "Global value chains (GVCs): Production process spread across multiple countries",
              "Multinational corporations (MNCs): Firms operating in multiple countries, drive globalisation",
              "Benefits of globalisation: Economic growth, Lower prices for consumers, Greater choice, Technology transfer, Employment in developing countries",
              "Costs of globalisation: Inequality (between and within countries), Job losses in developed countries, Cultural homogenisation, Environmental degradation",
              "Anti-globalisation movement: Protests against perceived negative impacts",
              "Fair trade: Movement to ensure better prices and conditions for producers in developing countries"
            ],
            formulas: [
              { name: "全球化指数", expr: "贸易开放度 = (X+M)/GDP × 100%" },
              { name: "FDI流入", expr: "Foreign Direct Investment - 外国直接投资" }
            ],
            examples: [
              {
                question: { zh: "分析全球化对发展中国家的利弊。", en: "Analyse the advantages and disadvantages of globalisation for developing countries." },
                answer: { zh: "利益：就业机会、技术转移、出口收入增加、经济增长。弊：依赖国际市场、容易被剥削、不平等加剧、环境问题。", en: "Advantages: Job opportunities, technology transfer, increased export revenue, economic growth. Disadvantages: Dependence on international markets, exploitation, increased inequality, environmental issues." }
              }
            ],
            difficulty: "Foundation",
            hardPoints: "理解全球化的多维度影响；辩证分析利弊",
            examTips: "辩证分析全球化的利弊；能讨论政策应对",
            youtube: [
              { title: "Globalisation", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8lM7Y2hT5Kp" },
              { title: "Multinational Corporations", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lM7Y2hT3Kp" }
            ]
          },
          {
            id: "e4c2", num: 2,
            title: { zh: "国际贸易", en: "International Trade" },
            overview: { zh: "学习国际贸易理论与政策。", en: "Learn about international trade theory and policy." },
            keyPoints: [
              "Absolute advantage: Ability to produce more output with the same inputs",
              "Comparative advantage: Lower opportunity cost of production, basis for trade",
              "Gains from trade: Both countries can consume beyond their PPF through specialisation",
              "Terms of trade: Ratio of export prices to import prices",
              "Trade protectionism: Government policies restricting imports",
              "Tariffs: Taxes on imported goods, raises price, reduces quantity, government revenue",
              "Quotas: Quantity limits on imports, creates scarcity and higher prices, licenses valuable",
              "Subsidies: Government payments to domestic producers, lowers their costs",
              "Arguments for protection: Infant industry, National security, Anti-dumping, Protection of domestic jobs",
              "Arguments against protection: Higher prices for consumers, Reduced competition, Retaliation, Inefficient domestic industries",
              "Trade agreements: EU, WTO (multilateral), Regional agreements (NAFTA/USMCA, ASEAN)"
            ],
            formulas: [
              { name: "比较优势", expr: "Country should specialize in goods with lowest opportunity cost" },
              { name: "贸易条件", expr: "ToT = Price of exports / Price of imports × 100" }
            ],
            examples: [
              {
                question: { zh: "A国生产1单位小麦需要10小时，生产1单位布需要5小时。B国生产1单位小麦需要6小时，生产1单位布需要12小时。两国应如何进行贸易？", en: "Country A uses 10 hours to produce 1 unit of wheat and 5 hours for 1 unit of cloth. Country B uses 6 hours for wheat and 12 hours for cloth. How should they trade?" },
                answer: { zh: "A国在布上有比较优势（机会成本更低），B国在小麦上有比较优势。", en: "Country A has comparative advantage in cloth, Country B in wheat." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "比较优势的计算与应用；保护主义的各种手段分析",
            examTips: "评估保护主义的利弊；理解贸易协定的层次",
            youtube: [
              { title: "Comparative Advantage", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=7mN8Y2hT4Kq" },
              { title: "Trade Protectionism - Tariffs", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4pL7Y2hT3Lm" },
              { title: "Trade Protectionism - Quotas", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nL7Y2hT3Kq" },
              { title: "Free Trade vs Protectionism", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6mN7Y2hT4Lr" }
            ]
          },
          {
            id: "e4c3", num: 3,
            title: { zh: "国际收支", en: "Balance of Payments" },
            overview: { zh: "学习国际收支账户的构成与平衡。", en: "Learn about the components of balance of payments accounts and equilibrium." },
            keyPoints: [
              "Balance of Payments (BOP): Systematic record of all economic transactions between residents and rest of world",
              "Current Account: Trade in goods (visible), Trade in services (invisible), Primary income (investment income), Secondary income (transfers)",
              "Balance of Trade: Exports of goods - Imports of goods",
              "Trade deficit: Imports > Exports; Trade surplus: Exports > Imports",
              "Capital Account: Capital transfers (e.g., migrants' transfers)",
              "Financial Account: Foreign Direct Investment (FDI), Portfolio investment (bonds, shares)",
              "BOP identity: Current + Capital + Financial = 0 (accounting identity)",
              "Current account deficit: Must be financed by capital inflows (borrowing/investment)",
              "Measures to correct deficit: Expenditure-reducing (fiscal contraction), Expenditure-switching (devaluation)"
            ],
            formulas: [
              { name: "经常账户", expr: "CA = X - M + NI + NT" },
              { name: "国际收支", expr: "BOP = Current + Capital + Financial = 0" },
              { name: "贸易差额", expr: "Balance of Trade = Exports - Imports" }
            ],
            examples: [
              {
                question: { zh: "解释为什么收支总是平衡的。", en: "Explain why the balance of payments always balances." },
                answer: { zh: "国际收支采用复式记账法。经常账户赤字必然由资本和金融账户盈余融资。", en: "BOP uses double-entry bookkeeping. Current account deficit must be financed by capital and financial account surplus." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "国际收支账户的复式记账；理解不同账户之间的关系",
            examTips: "理解国际收支与汇率的关系；分析赤字的可持续性",
            youtube: [
              { title: "Balance of Payments", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nM8Y2hT4Lr" },
              { title: "Current Account", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mN8Y2hT3Kq" },
              { title: "Trade Deficits", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nL8Y2hT4Lr" }
            ]
          },
          {
            id: "e4c4", num: 4,
            title: { zh: "汇率", en: "Exchange Rates" },
            overview: { zh: "学习汇率制度与汇率决定因素。", en: "Learn about exchange rate systems and determinants." },
            keyPoints: [
              "Exchange rate: Price of one currency in terms of another",
              "Appreciation: Currency becomes more valuable (fewer units needed to buy others)",
              "Depreciation: Currency becomes less valuable (more units needed to buy others)",
              "Floating exchange rate: Determined by market forces (demand and supply)",
              "Fixed exchange rate: Pegged to another currency, maintained by central bank intervention",
              "Factors affecting exchange rates: Interest rates, Inflation rates, Current account balance, Economic performance, Speculation",
              "J-curve effect: Currency depreciation initially worsens trade balance before improving",
              "Effects of appreciation: Imports cheaper, exports more expensive, inflation reduced, growth may slow",
              "Effects of depreciation: Imports more expensive, exports cheaper, inflation may rise, growth may boost"
            ],
            formulas: [
              { name: "名义汇率", expr: "E = Foreign currency / Domestic currency" },
              { name: "实际汇率", expr: "Real exchange rate = Nominal × (P_domestic / P_foreign)" }
            ],
            examples: [
              {
                question: { zh: "如果一国利率上升，对其汇率有何影响？为什么？", en: "If a country's interest rates rise, what happens to its exchange rate? Why?" },
                answer: { zh: "利率上升会吸引外资流入，增加对本币的需求，导致本币升值。", en: "Higher interest rates attract foreign capital inflows, increasing demand for domestic currency, causing appreciation." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "汇率变动对经济的影响分析；J曲线效应",
            examTips: "比较浮动与固定汇率制度的优劣；分析汇率政策的影响",
            youtube: [
              { title: "Exchange Rates - Introduction", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=6pM8Y2hT3Kn" },
              { title: "Floating vs Fixed Exchange Rates", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nM7Y2hT3Kp" },
              { title: "Effects of Exchange Rate Changes", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lN7Y2hT4Lq" }
            ]
          },
          {
            id: "e4c5", num: 5,
            title: { zh: "不平等与贫困", en: "Inequality & Poverty" },
            overview: { zh: "学习收入分配不平等的原因与政府政策。", en: "Learn about causes of income distribution inequality and government policies." },
            keyPoints: [
              "Income distribution: How income is distributed among population",
              "Lorenz curve: Graph showing proportion of income held by bottom x% of population",
              "Gini coefficient: Measure of inequality (0 = perfect equality, 1 = perfect inequality)",
              "Causes of inequality: Differences in education and skills, Discrimination, Wealth ownership, Inheritance, Technology, Globalisation",
              "Poverty: Absolute poverty (below minimum living standard), Relative poverty (below average)",
              "Poverty line: Income level below which people are considered poor",
              "Poverty traps: Circumstances that make it difficult to escape poverty",
              "Redistribution policies: Progressive taxation, Social welfare payments, Minimum wage, Public services"
            ],
            formulas: [
              { name: "基尼系数", expr: "G = Area between Lorenz curve and line of equality" }
            ],
            examples: [
              {
                question: { zh: "使用洛伦兹曲线解释基尼系数的含义。", en: "Explain the meaning of Gini coefficient using the Lorenz curve." },
                answer: { zh: "基尼系数等于洛伦兹曲线与绝对平等线之间的面积。面积越大，基尼系数越高。", en: "The Gini coefficient equals the area between the Lorenz curve and the line of perfect equality. Larger area means higher Gini." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解贫困陷阱的含义；区分绝对贫困与相对贫困",
            examTips: "评估再分配政策的效果；分析不平等的原因",
            youtube: [
              { title: "Income Distribution", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4qM8Y2hT5Kj" },
              { title: "Lorenz Curve and Gini Coefficient", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nM8Y2hT3Kq" },
              { title: "Poverty and Inequality", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mL8Y2hT4Lr" }
            ]
          },
          {
            id: "e4c6", num: 6,
            title: { zh: "经济发展", en: "Economic Development" },
            overview: { zh: "学习经济发展的衡量与促进政策。", en: "Learn about economic development measurement and promotion policies." },
            keyPoints: [
              "Economic growth: Increase in quantity of goods and services (GDP)",
              "Economic development: Broader concept including quality of life, health, education, freedom",
              "Human Development Index (HDI): Composite of life expectancy, education, income",
              "GDP per capita: Average income, useful but ignores distribution and non-market activities",
              "Other development indicators: Literacy rate, infant mortality, life expectancy, access to clean water",
              "Emerging economies (BRICS): Countries undergoing rapid industrialisation",
              "Barriers to development: Low capital accumulation, Poor education/health, Corruption, Debt burden, Capital flight",
              "Development strategies: Import substitution (ISI), Export-led growth, Agricultural development",
              "Role of foreign aid: Can help but may create dependency",
              "Foreign Direct Investment (FDI): Brings capital, technology, jobs",
              "Sustainable development: Meeting present needs without compromising future generations"
            ],
            formulas: [
              { name: "人类发展指数", expr: "HDI = ³√(Life expectancy × Education × Income)" },
              { name: "GDP per capita", expr: "GDP / Population" }
            ],
            examples: [
              {
                question: { zh: "为什么GDP增长不一定带来经济发展？", en: "Why doesn't GDP growth necessarily lead to economic development?" },
                answer: { zh: "GDP增长可能来自少数人。经济发展还包括健康、教育、平等、自由等非收入因素。", en: "GDP growth may benefit only a few. Development also includes health, education, equality, freedom - non-income factors." }
              }
            ],
            difficulty: "Intermediate",
            hardPoints: "区分经济增长与经济发展；理解HDI的计算",
            examTips: "分析促进经济发展的政策；评估不同发展战略的优劣",
            youtube: [
              { title: "Economic Development", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5rN8Y2hT4Lm" },
              { title: "Human Development Index", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mN8Y2hT4Lq" },
              { title: "Barriers to Development", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nL8Y2hT3Kq" },
              { title: "Sustainable Development", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lM8Y2hT4Lr" }
            ]
          }
        ]
      }
    }
  },

  // ============================================================
  // HISTORY (历史)
  // ============================================================
  history: {
    id: "history",
    name: { zh: "历史", en: "History" },
    nameFull: { zh: "爱德思IAL历史", en: "Pearson Edexcel IAL History" },
    icon: "📜",
    color: "#8D6E63",
    bgColor: "#EFEBE9",
    level: "IAL (International A-Level)",
    books: {
      Unit1: {
        id: "Unit1",
        title: { zh: "广度研究：现代国际历史", en: "Breadth Study: Modern International History" },
        subtitle: { zh: "1789-1945年", en: "1789-1945" },
        color: "#6D4C41",
        chapters: [
          {
            id: "h1c1", num: 1,
            title: { zh: "法国大革命", en: "The French Revolution (1789-1815)" },
            overview: { zh: "学习法国大革命的起因、过程和影响。", en: "Learn the causes, process and impact of the French Revolution." },
            keyPoints: [
              "Causes: Financial crisis, Enlightenment ideas, social inequality",
              "Revolutionary events: 1789 storming of Bastille",
              "Role of radical groups: Jacobins, Sans-culottes",
              "Reign of Terror (1793-1794)",
              "Napoleon's rise and fall"
            ],
            definitions: [
              { term: "波旁王朝", definition: "法国皇室家族，1789年前统治法国" },
              { term: "雅各宾派", definition: "法国大革命中的激进共和派" }
            ],
            difficulty: "Foundation",
            hardPoints: "理解革命各阶段的转变",
            examTips: "分析因果关系",
            youtube: [
              { title: "The French Revolution Overview", channel: "John Green", url: "https://www.youtube.com/watch?v=8K_kBaH0jCE" },
              { title: "French Revolution Causes", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=j5C8zK2q5QY" }
            ]
          },
          {
            id: "h1c2", num: 2,
            title: { zh: "第一次世界大战", en: "World War I (1914-1918)" },
            overview: { zh: "学习一战的起因、过程和后果。", en: "Learn the causes, process and consequences of WWI." },
            keyPoints: [
              "Causes: Alliance system, imperialism, nationalism, arms race",
              "War phases: 1914-1918",
              "Trench warfare and new weapons",
              "Peace treaties: Versailles 1919",
              "Impact: Treaty of Versailles, League of Nations"
            ],
            definitions: [
              { term: "同盟国", definition: "一战中的德国、奥匈帝国、奥斯曼帝国" },
              { term: "协约国", definition: "一战中的英国、法国、俄国（后期美国）" }
            ],
            difficulty: "Foundation",
            hardPoints: "分析战争的深层原因",
            examTips: "掌握战争的影响",
            youtube: [
              { title: "World War I Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=K4DyEh2g6Q0" },
              { title: "Causes of WWI", channel: "John Green", url: "https://www.youtube.com/watch?v=HbK-M7xks4E" }
            ]
          },
          {
            id: "h1c3", num: 3,
            title: { zh: "俄国革命", en: "The Russian Revolution (1917)" },
            overview: { zh: "学习俄国革命的起因和影响。", en: "Learn the causes and impact of the Russian Revolution." },
            keyPoints: [
              "Background: Tsarist autocracy, WWI strains",
              "1905 Revolution and its legacy",
              "February Revolution 1917",
              "Bolsheviks and Lenin's leadership",
              "October Revolution and rise of Soviet Union"
            ],
            definitions: [
              { term: "布尔什维克", definition: "俄国社会民主工党中的革命派" },
              { term: "苏维埃", definition: "俄国工人、农民和士兵代表会议" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解革命的多阶段进程",
            examTips: "比较不同革命的特点",
            youtube: [
              { title: "Russian Revolution", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=3K6RooT5q7s" }
            ]
          },
          {
            id: "h1c4", num: 4,
            title: { zh: "第二次世界大战", en: "World War II (1939-1945)" },
            overview: { zh: "学习二战的起因、过程和后果。", en: "Learn the causes, process and consequences of WWII." },
            keyPoints: [
              "Causes: Treaty of Versailles, Rise of Fascism, Nazi Germany",
              "Key events: Blitzkrieg, Pearl Harbor, D-Day",
              "Holocaust and war crimes",
              "Atomic bombs and war's end",
              "Post-war order: UN, Cold War beginnings"
            ],
            definitions: [
              { term: "轴心国", definition: "二战中的德国、意大利、日本" },
              { term: "同盟国", definition: "二战中的英国、苏联、美国、中国等" }
            ],
            difficulty: "Intermediate",
            hardPoints: "分析战争的全球性影响",
            examTips: "理解战后国际秩序的建立",
            youtube: [
              { title: "World War II Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=PCeG6Ru1W3M" }
            ]
          }
        ]
      },
      Unit2: {
        id: "Unit2",
        title: { zh: "深度研究：美国历史", en: "Depth Study: History of the USA" },
        subtitle: { zh: "1918-1968", en: "1918-1968" },
        color: "#5D4037",
        chapters: [
          {
            id: "h2c1", num: 1,
            title: { zh: "爵士时代与大萧条", en: "Jazz Age and Great Depression" },
            overview: { zh: "学习1920年代美国繁荣与大萧条。", en: "Learn about 1920s prosperity and the Great Depression." },
            keyPoints: [
              "Roaring Twenties: economic boom, cultural changes",
              "Stock market crash 1929",
              "Great Depression causes and impact",
              "New Deal policies",
              "Recovery by WWII"
            ],
            difficulty: "Foundation",
            hardPoints: "分析大萧条的原因",
            examTips: "联系政府政策",
            youtube: [
              { title: "The Roaring Twenties", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=VHHq3xQ3gGU" },
              { title: "The Great Depression", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=7hK5c6p" },
              { title: "New Deal", channel: "John Green", url: "https://www.youtube.com/watch?v=5CT74gT0nA4" }
            ]
          },
          {
            id: "h2c2", num: 2,
            title: { zh: "二战及战后美国", en: "WWII and Post-War America" },
            overview: { zh: "学习二战期间及战后美国的发展。", en: "Learn about America's role in WWII and post-war period." },
            keyPoints: [
              "America's entry into WWII",
              "Home front: wartime economy",
              "Post-war economic boom",
              "Cold War context and containment",
              "McCarthyism and domestic politics"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解战后美国国际地位的提升",
            examTips: "分析国内政策与国际形势的关系",
            youtube: [
              { title: "America in WWII", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=6r6YfI2_q" }
            ]
          },
          {
            id: "h2c3", num: 3,
            title: { zh: "民权运动", en: "Civil Rights Movement" },
            overview: { zh: "学习美国民权运动的历史。", en: "Learn about the American Civil Rights Movement." },
            keyPoints: [
              "Segregation and Jim Crow laws",
              "Brown v. Board of Education (1954)",
              "Montgomery Bus Boycott (1955-1956)",
              "Martin Luther King Jr. and nonviolent protest",
              "Civil Rights Act (1964), Voting Rights Act (1965)"
            ],
            definitions: [
              { term: "种族隔离", definition: "法律上的种族分离政策" },
              { term: "吉姆·克劳法", definition: "美国南部实行的种族隔离法律" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解非暴力抵抗策略",
            examTips: "分析民权运动的成功因素",
            youtube: [
              { title: "Civil Rights Movement", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=6HDp1l0V3s" }
            ]
          }
        ]
      },
      Unit3: {
        id: "Unit3",
        title: { zh: "主题研究：大英帝国", en: "Thematic Study: The British Empire" },
        subtitle: { zh: "1855-1967", en: "c. 1855-1967" },
        color: "#4E342E",
        chapters: [
          {
            id: "h3c1", num: 1,
            title: { zh: "帝国的扩张", en: "Expansion of the British Empire" },
            overview: { zh: "学习大英帝国的扩张过程。", en: "Learn about the expansion of the British Empire." },
            keyPoints: [
              "Factors driving expansion: economic, strategic, ideological",
              "Key territories: India, Africa, Caribbean",
              "Colonial administration methods",
              "Impact on indigenous populations"
            ],
            difficulty: "Intermediate",
            hardPoints: "分析帝国扩张的动机",
            examTips: "理解殖民统治的多重影响",
            formulas: [
              { name: "帝国扩张动机", expr: "经济利益 + 战略安全 + 意识形态 = 扩张动力" },
              { name: "殖民统治模式", expr: "直接统治 vs 间接统治" }
            ],
            youtube: [
              { title: "British Empire Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=H5i2oMg1P7w" },
              { title: "Empire and Identity", channel: "BBC", url: "https://www.youtube.com/watch?v=RlMJ2pGMkg" }
            ]
          },
          {
            id: "h3c2", num: 2,
            title: { zh: "殖民统治与抵抗", en: "Colonial Rule and Resistance" },
            overview: { zh: "学习殖民统治下的抵抗运动。", en: "Learn about resistance movements under colonial rule." },
            keyPoints: [
              "Forms of resistance: political, military, cultural",
              "Indian independence movement",
              "African nationalist movements",
              "Role of education and western ideas"
            ],
            formulas: [
              { name: "抵抗运动类型", expr: "武装抵抗 + 政治运动 + 文化觉醒" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解抵抗运动的多样性",
            examTips: "分析不同地区抵抗运动的差异",
            youtube: [
              { title: "Indian Independence Movement", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=7T5Kk4jU7" },
              { title: "African Independence", channel: "Al Jazeera", url: "https://www.youtube.com/watch?v=KlDWvj2Y" }
            ]
          },
          {
            id: "h3c3", num: 3,
            title: { zh: "非殖民化", en: "Decolonisation" },
            overview: { zh: "学习大英帝国的非殖民化过程。", en: "Learn about the process of decolonisation." },
            keyPoints: [
              "Post-WWII pressure for independence",
              "Key independence movements: India (1947), Kenya (1963)",
              "Wind of Change speech (1960)",
              "Impact on Britain and former colonies"
            ],
            formulas: [
              { name: "非殖民化进程", expr: "独立运动 + 谈判/战争 + 新国家形成" }
            ],
            difficulty: "Advanced",
            hardPoints: "分析非殖民化的原因和影响",
            examTips: "理解英国政策的转变",
            youtube: [
              { title: "Decolonisation Overview", channel: "BBC", url: "https://www.youtube.com/watch?v=LYH7h9jG" },
              { title: "Wind of Change Speech", channel: "British Pathé", url: "https://www.youtube.com/watch?v=wT1X5cEe" }
            ]
          }
        ]
      },
      Unit4: {
        id: "Unit4",
        title: { zh: "来源评估与历史解释", en: "Thematic Study with Source Evaluation" },
        subtitle: { zh: "史料评估与解释", en: "Source Analysis & Historical Interpretations" },
        color: "#5D4037",
        chapters: [
          {
            id: "h4c1", num: 1,
            title: { zh: "美国历史：独立到内战", en: "US History: Independence to Civil War (1763-1865)" },
            overview: { zh: "学习美国从独立到内战的历史。", en: "Learn US history from independence to the Civil War." },
            keyPoints: [
              "Causes of American Revolution",
              "Constitution and Bill of Rights",
              "Expansion and Manifest Destiny",
              "Slavery and Abolition",
              "Civil War (1861-1865) and Reconstruction"
            ],
            definitions: [
              { term: "Manifest Destiny", definition: "19世纪美国扩张的理念" },
              { term: "Reconstruction", definition: "战后重建时期(1865-1877)" }
            ],
            formulas: [
              { name: "美国革命原因", expr: " taxation + representation + ideology = revolution" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解因果关系的复杂性",
            examTips: "能够评估历史学家观点",
            youtube: [
              { title: "American Revolution", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=5Da3cP4b" },
              { title: "Civil War Overview", channel: "John Green", url: "https://www.youtube.com/watch?v=wE1oX8jP" }
            ]
          },
          {
            id: "h4c2", num: 2,
            title: { zh: "英国战争经历", en: "British War Experience (1803-1945)" },
            overview: { zh: "学习英国在主要战争中的角色和影响。", en: "Study Britain's role in major wars." },
            keyPoints: [
              "Napoleonic Wars",
              "Crimean War causes and consequences",
              "World War I: Western Front",
              "World War II: Blitz and Home Front",
              "War economics and social change"
            ],
            formulas: [
              { name: "战争影响分析", expr: "经济影响 + 社会变革 + 政治格局 = 全面影响" }
            ],
            difficulty: "Advanced",
            hardPoints: "分析战争对社会的影响",
            examTips: "能够比较不同战争的异同",
            youtube: [
              { title: "World War I Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=Zy19o6v3" },
              { title: "World War II Overview", channel: "History Channel", url: "https://www.youtube.com/watch?v=HQH8X3y" }
            ]
          },
          {
            id: "h4c3", num: 3,
            title: { zh: "德国：统一、分裂与再统一", en: "Germany: Unity, Division & Reunification (1870-1990)" },
            overview: { zh: "学习德国现代史的关键时期。", en: "Study key periods in modern German history." },
            keyPoints: [
              "German unification (1871)",
              "Kaiserreich and World War I",
              "Weimar Republic and Nazi Germany",
              "Division after World War II",
              "Reunification (1990)"
            ],
            definitions: [
              { term: "Weimar Republic", definition: "德国魏玛共和国(1919-1933)" },
              { term: "Cold War", definition: "冷战时期的东西方对抗" }
            ],
            formulas: [
              { name: "德国历史主线", expr: "统一 → 一战 → 魏玛 → 纳粹 → 二战 → 分裂 → 统一" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解德国历史转折点",
            examTips: "能够评估不同历史时期",
            youtube: [
              { title: "German Unification", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=Q2W7dN3" },
              { title: "Nazi Germany", channel: "John Green", url: "https://www.youtube.com/watch?v=hH1g1s6" }
            ]
          }
        ]
      }
    }
  },

  // ============================================================
  // POLITICS (政治)
  // ============================================================
  politics: {
    id: "politics",
    name: { zh: "政治", en: "Politics" },
    nameFull: { zh: "爱德思IAL政治", en: "Pearson Edexcel IAL Politics" },
    icon: "⚖️",
    color: "#455A64",
    bgColor: "#ECEFF1",
    level: "IAL (International A-Level)",
    books: {
      Unit1: {
        id: "Unit1",
        title: { zh: "英国政治与核心政治理论", en: "UK Politics & Core Political Ideas" },
        subtitle: { zh: "民主、议会、选举", en: "Democracy, Parliament, Elections" },
        color: "#37474F",
        chapters: [
          {
            id: "p1c1", num: 1,
            title: { zh: "英国民主制度", en: "UK Democracy" },
            overview: { zh: "学习英国的民主制度和选举系统。", en: "Learn about UK's democratic system and electoral system." },
            keyPoints: [
              "Features of UK democracy: elections, representation",
              "Electoral systems: FPTP, AMS, STV, AV",
              "Electoral reform debates",
              "Voting behaviour and participation",
              "Pressure groups and democracy"
            ],
            definitions: [
              { term: "简单多数制(FPTP)", definition: "得票最多的候选人获胜的选举制度" },
              { term: "比例代表制", definition: "根据得票比例分配席位的选举制度" }
            ],
            difficulty: "Foundation",
            hardPoints: "比较不同选举制度的优缺点",
            examTips: "能评价选举制度的公平性",
            youtube: [
              { title: "UK Democracy Overview", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=4GBbK7Wzxzw" },
              { title: "Electoral Systems Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=7K7G9Qk6X3w" }
            ]
          },
          {
            id: "p1c2", num: 2,
            title: { zh: "核心政治理论", en: "Core Political Ideas" },
            overview: { zh: "学习自由主义、社会主义、保守主义。", en: "Learn Liberalism, Socialism, Conservatism." },
            keyPoints: [
              "Liberalism: individual liberty, rights, free market",
              "Socialism: equality, collective ownership, welfare state",
              "Conservatism: tradition, hierarchy, authority",
              "Anarchism: opposition to the state"
            ],
            definitions: [
              { term: "自由主义", definition: "强调个人自由、权利和市场的政治理论" },
              { term: "社会主义", definition: "强调平等、集体所有和福利国家的政治理论" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解各理论的核心理念",
            examTips: "能区分不同理论的观点",
            youtube: [
              { title: "Political Ideologies Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=5q7j8D1vH8" },
              { title: "Liberalism Explained", channel: "Philosophy Tube", url: "https://www.youtube.com/watch?v=e-mL4LzVXY" }
            ]
          }
        ]
      },
      Unit2: {
        id: "Unit2",
        title: { zh: "比较政治：美国政府", en: "Comparative Politics: US Government" },
        subtitle: { zh: "联邦制、国会、总统", en: "Federalism, Congress, Presidency" },
        color: "#263238",
        chapters: [
          {
            id: "p2c1", num: 1,
            title: { zh: "美国联邦制度", en: "US Federalism" },
            overview: { zh: "学习美国的联邦制度。", en: "Learn about US federal system." },
            keyPoints: [
              "Division of powers: Federal vs State government",
              "Supremacy clause and states' rights",
              "Supreme Court and constitutional interpretation",
              "Recent federalism debates"
            ],
            difficulty: "Intermediate",
            hardPoints: "比较英美政治制度",
            examTips: "理解联邦制的运作",
            youtube: [
              { title: "US Government Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=ymA6X5z5WBk" },
              { title: "US Federalism", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=0jT_jV1Mj3k" }
            ]
          },
          {
            id: "p2c2", num: 2,
            title: { zh: "美国国会", en: "US Congress" },
            overview: { zh: "学习美国国会的结构和功能。", en: "Learn about the structure and function of US Congress." },
            keyPoints: [
              "House of Representatives: structure, elections, powers",
              "Senate: structure, elections, powers",
              "Legislative process: bill to law",
              "Checks and balances between chambers"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解国会两院制的运作",
            examTips: "分析国会的制衡功能",
            youtube: [
              { title: "US Congress Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=ty0B6vU06w" }
            ]
          },
          {
            id: "p2c3", num: 3,
            title: { zh: "美国总统", en: "US Presidency" },
            overview: { zh: "学习美国总统的权力和职能。", en: "Learn about the powers and functions of the US President." },
            keyPoints: [
              "Executive power and presidential roles",
              "Relationship with Congress",
              "Presidential elections",
              "Cabinet and executive agencies"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解总统权力的限制",
            examTips: "分析总统与国会的关系",
            formulas: [
              { name: "总统权力来源", expr: "宪法 + 行政命令 + 政治资本 = 总统权力" }
            ],
            youtube: [
              { title: "US Presidency Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=5K3Z3k1" }
            ]
          }
        ]
      },
      Unit3: {
        id: "Unit3",
        title: { zh: "全球政治", en: "Global Politics" },
        subtitle: { zh: "全球化、国际组织、人权", en: "Globalisation, International Organisations, Human Rights" },
        color: "#1A237E",
        chapters: [
          {
            id: "p3c1", num: 1,
            title: { zh: "全球化", en: "Globalisation" },
            overview: { zh: "学习全球化的概念和影响。", en: "Learn about the concept and impact of globalisation." },
            keyPoints: [
              "Definition and drivers of globalisation",
              "Economic, political, cultural dimensions",
              "Globalisation's winners and losers",
              "Anti-globalisation movements"
            ],
            formulas: [
              { name: "全球化维度", expr: "经济全球化 + 政治全球化 + 文化全球化" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解全球化的多维影响",
            examTips: "分析全球化的利弊",
            youtube: [
              { title: "Globalisation Explained", channel: "Economics Explained", url: "https://www.youtube.com/watch?v=YaH4k9sA" }
            ]
          },
          {
            id: "p3c2", num: 2,
            title: { zh: "国际组织", en: "International Organisations" },
            overview: { zh: "学习主要国际组织的结构和功能。", en: "Learn about major international organisations." },
            keyPoints: [
              "United Nations: structure, functions, reforms",
              "European Union: history, institutions, Brexit",
              "NATO: purpose, expansion, current challenges",
              "Effectiveness of international organisations"
            ],
            formulas: [
              { name: "国际组织评估标准", expr: "成员国支持 + 执行能力 + 解决问题效率" }
            ],
            difficulty: "Advanced",
            hardPoints: "分析国际组织的有效性",
            examTips: "评估国际组织的作用",
            youtube: [
              { title: "United Nations Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=yp1En5f5" }
            ]
          },
          {
            id: "p3c3", num: 3,
            title: { zh: "国际关系理论", en: "International Relations Theories" },
            overview: { zh: "学习国际关系的理论框架。", en: "Learn theoretical frameworks of international relations." },
            keyPoints: [
              "Realism: power, security, national interest",
              "Liberalism: cooperation, institutions, economic interdependence",
              "Constructivism: identity, norms, social construction",
              "Applying theories to case studies"
            ],
            formulas: [
              { name: "IR理论框架", expr: "现实主义 + 自由主义 + 建构主义 = 国际关系理论" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解不同理论视角",
            examTips: "用理论分析实际问题",
            youtube: [
              { title: "IR Theories Overview", channel: "IR Theory", url: "https://www.youtube.com/watch?v=7f8S2c4" }
            ]
          }
        ]
      },
      Unit4: {
        id: "Unit4",
        title: { zh: "比较政治学", en: "Comparative Politics" },
        subtitle: { zh: "政治制度比较与全球治理", en: "Comparative Political Systems & Global Governance" },
        color: "#37474F",
        chapters: [
          {
            id: "p4c1", num: 1,
            title: { zh: "比较政治学方法", en: "Comparative Politics Methods" },
            overview: { zh: "学习比较不同政治体系的方法。", en: "Learn methods for comparing different political systems." },
            keyPoints: [
              "Comparative politics: definition and scope",
              "Political systems: presidential vs parliamentary",
              "Federal vs unitary systems",
              " Democratisation and transitions",
              "Political culture and socialization"
            ],
            definitions: [
              { term: "Presidential system", definition: "总统制，如美国" },
              { term: "Parliamentary system", definition: "议会制，如英国" }
            ],
            formulas: [
              { name: "比较政治学研究方法", expr: "比较方法 + 制度分析 + 过程追踪" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解不同政治制度差异",
            examTips: "能够比较和分析不同政治体系",
            youtube: [
              { title: "Comparative Politics", channel: "Political Science", url: "https://www.youtube.com/watch?v=8f9k6b2" }
            ]
          },
          {
            id: "p4c2", num: 2,
            title: { zh: "美国政治体系", en: "US Political System" },
            overview: { zh: "深入学习美国政治制度。", en: "Study the US political system in depth." },
            keyPoints: [
              "US Constitution and federalism",
              "Separation of powers: executive, legislative, judicial",
              "Congress: House and Senate",
              "Presidential power and limitations",
              "Supreme Court and judicial review",
              "US electoral system: Electoral College"
            ],
            formulas: [
              { name: "权力分立与制衡", expr: "行政权 + 立法权 + 司法权 = 三权分立" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解权力分立与制衡",
            examTips: "能比较英美政治体系",
            youtube: [
              { title: "US Constitution Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=UrYkzJ4e" }
            ]
          },
          {
            id: "p4c3", num: 3,
            title: { zh: "全球治理与国际组织", en: "Global Governance & International Organisations" },
            overview: { zh: "学习全球治理机制和国际组织。", en: "Study global governance mechanisms and international organisations." },
            keyPoints: [
              "United Nations: structure and functions",
              "UN Security Council and veto power",
              "International courts: ICC, ICJ",
              "Global economic institutions: WTO, IMF, World Bank",
              "Regional organisations: EU, NATO, ASEAN"
            ],
            definitions: [
              { term: "Sovereignty", definition: "国家主权概念" },
              { term: "Human rights", definition: "人权与国际保护" }
            ],
            formulas: [
              { name: "全球治理框架", expr: "国际组织 + 国际法 + 主权国家 = 全球治理" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解国际组织的作用",
            examTips: "评估全球治理的有效性",
            youtube: [
              { title: "Global Governance", channel: "UNDP", url: "https://www.youtube.com/watch?v=6c5Z8e1" }
            ]
          }
        ]
      }
    }
  },

  // ============================================================
  // PSYCHOLOGY (心理学)
  // ============================================================
  psychology: {
    id: "psychology",
    name: { zh: "心理学", en: "Psychology" },
    nameFull: { zh: "爱德思IAL心理学", en: "Pearson Edexcel IAL Psychology" },
    icon: "🧠",
    color: "#00897B",
    bgColor: "#E0F2F1",
    level: "IAL (International A-Level)",
    books: {
      Unit1: {
        id: "Unit1",
        title: { zh: "心理学基础与方法", en: "Foundations of Psychology & Research Methods" },
        subtitle: { zh: "社会心理学、认知心理学、研究方法", en: "Social Psychology, Cognitive Psychology, Research Methods" },
        color: "#00695C",
        chapters: [
          {
            id: "psy1c1", num: 1,
            title: { zh: "社会心理学", en: "Social Psychology" },
            overview: { zh: "学习社会影响、态度、从众。", en: "Learn about social influence, attitudes, conformity." },
            keyPoints: [
              "Conformity: Types (normative, informational)",
              "Obedience to authority (Milgram experiment)",
              "Social identity theory",
              "Attitudes and attitude change",
              "Prejudice and discrimination"
            ],
            definitions: [
              { term: "从众", definition: "个人因群体压力而改变行为或信念" },
              { term: "服从", definition: "因权威人物要求而服从的行为" }
            ],
            difficulty: "Foundation",
            hardPoints: "理解经典实验的设计和伦理",
            examTips: "能评价实验的优缺点",
            youtube: [
              { title: "Social Psychology Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=YO4RbT4Eps" },
              { title: "Milgram Experiment", channel: "Veritasium", url: "https://www.youtube.com/watch?v=m7wF2j0B4" }
            ]
          },
          {
            id: "psy1c2", num: 2,
            title: { zh: "认知心理学", en: "Cognitive Psychology" },
            overview: { zh: "学习记忆、感知、信息加工。", en: "Learn about memory, perception, information processing." },
            keyPoints: [
              "Multi-store model of memory: sensory, short-term, long-term",
              "Levels of processing model",
              "Forgetting: decay, interference, retrieval failure",
              "Perceptual illusions",
              "Schemas and top-down processing"
            ],
            formulas: [
              { name: "艾宾浩斯遗忘曲线", expr: "R = e^(-t/S)" }
            ],
            difficulty: "Intermediate",
            hardPoints: "记忆模型的比较",
            examTips: "能解释遗忘的原因",
            youtube: [
              { title: "How Memory Works", channel: "TED-Ed", url: "https://www.youtube.com/watch?v=2zCwS14qSqM" },
              { title: "Memory and Forgetting", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=2mYKrB9K4" }
            ]
          },
          {
            id: "psy1c3", num: 3,
            title: { zh: "研究方法", en: "Research Methods" },
            overview: { zh: "学习实验设计、统计方法、伦理。", en: "Learn experimental design, statistical methods, ethics." },
            keyPoints: [
              "Hypotheses: null and alternative",
              "Experimental designs: lab, field, natural",
              "Variables: IV, DV, control, confounding",
              "Qualitative vs Quantitative methods",
              "Ethics in psychological research"
            ],
            formulas: [
              { name: "皮尔逊相关", expr: "r = Σ(x-x̄)(y-ȳ) / √[Σ(x-x̄)²Σ(y-ȳ)²]" }
            ],
            difficulty: "Intermediate",
            hardPoints: "实验设计的选择",
            examTips: "掌握统计方法的应用",
            youtube: [
              { title: "Research Methods in Psychology", channel: "Psychology Today", url: "https://www.youtube.com/watch?v=3XW8Qk9P4" }
            ]
          }
        ]
      },
      Unit2: {
        id: "Unit2",
        title: { zh: "生物心理学与学习理论", en: "Biological Psychology & Learning Theories" },
        subtitle: { zh: "生物心理学、学习理论与发展", en: "Biological Psychology, Learning Theories & Development" },
        color: "#004D40",
        chapters: [
          {
            id: "psy2c1", num: 1,
            title: { zh: "生物心理学", en: "Biological Psychology" },
            overview: { zh: "学习生物心理学基础，理解神经系统如何影响行为。", en: "Learn the foundations of biological psychology and how the nervous system affects behavior." },
            keyPoints: [
              "Neurons: structure and function",
              "Central and peripheral nervous system",
              "Endocrine system and hormones",
              "Brain structure: cortex, limbic system, brain stem",
              "Biological explanations of aggression",
              "Circadian rhythms"
            ],
            formulas: [
              { name: "神经元结构", expr: "树突 → 细胞体 → 轴突 → 突触" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解大脑结构与功能的关系",
            examTips: "能够将生物学知识应用于行为解释",
            youtube: [
              { title: "Biological Psychology", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=4K8G7Lm" }
            ]
          },
          {
            id: "psy2c2", num: 2,
            title: { zh: "学习理论", en: "Learning Theories" },
            overview: { zh: "学习经典条件反射、操作条件反射和社会学习理论。", en: "Learn classical conditioning, operant conditioning, and social learning theory." },
            keyPoints: [
              "Classical conditioning: Pavlov's experiments",
              "Operant conditioning: reinforcement, punishment",
              "Schedules of reinforcement",
              "Social learning theory: Bandura",
              "Observational learning"
            ],
            formulas: [
              { name: "操作性条件反射", expr: "强化 + 惩罚 = 行为改变" }
            ],
            difficulty: "Intermediate",
            hardPoints: "区分经典条件反射与操作性条件反射",
            examTips: "能用条件反射原理解释行为现象",
            youtube: [
              { title: "Learning Theories", channel: "Simply Psychology", url: "https://www.youtube.com/watch?v=5L8H9Mk" }
            ]
          },
          {
            id: "psy2c3", num: 3,
            title: { zh: "发展心理学", en: "Developmental Psychology" },
            overview: { zh: "学习从婴儿到成年的心理发展过程。", en: "Learn about psychological development from infancy to adulthood." },
            keyPoints: [
              "Piaget's stages of cognitive development",
              "Erikson's psychosocial stages",
              "Attachment theory: Bowlby, Ainsworth",
              "Deprivation and privation",
              "Social development across lifespan"
            ],
            formulas: [
              { name: "皮亚杰认知发展阶段", expr: "感觉运动 → 前运算 → 具体运算 → 形式运算" }
            ],
            difficulty: "Intermediate",
            hardPoints: "理解发展理论的应用",
            examTips: "能够分析儿童发展案例",
            youtube: [
              { title: "Developmental Psychology", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=6M9J8Kk" }
            ]
          }
        ]
      },
      Unit3: {
        id: "Unit3",
        title: { zh: "心理学应用", en: "Applications of Psychology" },
        subtitle: { zh: "犯罪、健康、发展心理学应用", en: "Applications: Criminal, Health, Development" },
        color: "#00332a",
        chapters: [
          {
            id: "psy3c1", num: 1,
            title: { zh: "犯罪心理学", en: "Criminal Psychology" },
            overview: { zh: "学习犯罪行为的心理学解释。", en: "Learn psychological explanations for criminal behaviour." },
            keyPoints: [
              "Biological theories of criminality",
              "Psychodynamic and behavioral explanations",
              "Eysenck's theory of personality and crime",
              "Approaches to treating offenders",
              "Psychology and the legal system"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解犯罪行为的多种解释",
            examTips: "分析不同理论的优缺点",
            formulas: [
              { name: "犯罪心理学理论", expr: "生物学 + 精神分析 + 行为主义 = 犯罪解释" }
            ],
            youtube: [
              { title: "Criminal Psychology", channel: "Psychology Today", url: "https://www.youtube.com/watch?v=8K7G9Qk" }
            ]
          },
          {
            id: "psy3c2", num: 2,
            title: { zh: "健康心理学", en: "Health Psychology" },
            overview: { zh: "学习心理因素对健康的影响。", en: "Learn about psychological factors affecting health." },
            keyPoints: [
              "Health beliefs and behaviour",
              "Stress and its effects on health",
              "Coping strategies and health",
              "Psychoneuroimmunology",
              "Health promotion strategies"
            ],
            formulas: [
              { name: "健康心理学模型", expr: "健康信念 + 行为意图 + 自我效能 = 健康行为" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解心理与生理的相互作用",
            examTips: "分析健康行为改变的策略",
            youtube: [
              { title: "Health Psychology", channel: "Simply Psychology", url: "https://www.youtube.com/watch?v=9K7G8Lm" }
            ]
          },
          {
            id: "psy3c3", num: 3,
            title: { zh: "心理学辩论", en: "Debates in Psychology" },
            overview: { zh: "学习心理学的主要理论辩论。", en: "Learn major theoretical debates in psychology." },
            keyPoints: [
              "Nature vs Nurture debate",
              "Free will vs Determinism",
              "Reductionism vs Holism",
              "Idiographic vs Nomothetic approaches",
              "Science vs Humanistic perspectives"
            ],
            formulas: [
              { name: "心理学辩论框架", expr: "先天 vs 后天 / 决定论 vs 自由意志" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解不同理论视角",
            examTips: "能用辩论观点分析研究",
            youtube: [
              { title: "Nature vs Nurture", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=5K8G7Lm" }
            ]
          },
          {
            id: "psy3c4", num: 4,
            title: { zh: "高级研究方法", en: "Advanced Research Methods" },
            overview: { zh: "学习更高级的研究设计和统计方法。", en: "Learn advanced research designs and statistical methods." },
            keyPoints: [
              "Repeated measures, independent groups design",
              "Quantitative data analysis: t-tests, ANOVA",
              "Qualitative methods: interviews, observations",
              "Pilot studies and reliability",
              "Advanced ethical considerations"
            ],
            formulas: [
              { name: "t检验公式", expr: "t = (X̄1 - X̄2) / √(s²/n1 + s²/n2)" }
            ],
            difficulty: "Advanced",
            hardPoints: "选择合适的研究设计",
            examTips: "能设计和评估心理学研究",
            youtube: [
              { title: "Research Methods", channel: "Simply Psychology", url: "https://www.youtube.com/watch?v=6L9M8K" }
            ]
          }
        ]
      },
      Unit4: {
        id: "Unit4",
        title: { zh: "临床心理学与心理技能", en: "Clinical Psychology & Psychological Skills" },
        subtitle: { zh: "心理障碍诊断与治疗", en: "Diagnosis & Treatment of Psychological Disorders" },
        color: "#00695C",
        chapters: [
          {
            id: "psy4c1", num: 1,
            title: { zh: "临床心理学导论", en: "Introduction to Clinical Psychology" },
            overview: { zh: "学习临床心理学的基本概念和评估方法。", en: "Learn fundamental concepts and assessment methods in clinical psychology." },
            keyPoints: [
              "Historical development of clinical psychology",
              "Classification of mental disorders: DSM and ICD",
              "Assessment methods: interviews, psychometric tests",
              "Clinical observation and diagnosis",
              "Prevalence and incidence of psychological disorders"
            ],
            definitions: [
              { term: "DSM", definition: "精神疾病诊断与统计手册" },
              { term: "ICD", definition: "国际疾病分类" }
            ],
            formulas: [
              { name: "临床评估流程", expr: "面谈 + 心理测验 + 观察 = 全面评估" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解不同诊断系统的差异",
            examTips: "能够评估不同心理障碍",
            youtube: [
              { title: "Clinical Psychology Overview", channel: "American Psychological Association", url: "https://www.youtube.com/watch?v=7K8L9Mm" }
            ]
          },
          {
            id: "psy4c2", num: 2,
            title: { zh: "焦虑障碍", en: "Anxiety Disorders" },
            overview: { zh: "学习焦虑障碍的类型、原因和治疗方法。", en: "Study types, causes and treatments of anxiety disorders." },
            keyPoints: [
              "Generalised Anxiety Disorder (GAD)",
              "Phobias: specific and social",
              "Panic disorder and agoraphobia",
              "Obsessive-Compulsive Disorder (OCD)",
              "Biological and psychological explanations",
              "Treatments: CBT, medication, exposure therapy"
            ],
            formulas: [
              { name: "暴露疗法原理", expr: "系统脱敏 = 放松 + 等级暴露" }
            ],
            difficulty: "Advanced",
            hardPoints: "区分不同焦虑障碍",
            examTips: "能够比较不同治疗方法",
            youtube: [
              { title: "Anxiety Disorders", channel: "Khan Academy", url: "https://www.youtube.com/watch?v=8L9M0Nk" }
            ]
          },
          {
            id: "psy4c3", num: 3,
            title: { zh: "心境障碍", en: "Mood Disorders" },
            overview: { zh: "学习抑郁症和双相情感障碍。", en: "Study depression and bipolar disorder." },
            keyPoints: [
              "Major Depressive Disorder: symptoms and diagnosis",
              "Bipolar I and Bipolar II disorders",
              "Biological explanations: neurotransmitters, genetics",
              "Psychological theories: cognitive, behavioural",
              "Treatments: antidepressants, ECT, psychotherapy",
              "Suicide and self-harm considerations"
            ],
            definitions: [
              { term: "Mania", definition: "躁狂发作时期" },
              { term: "Anhedonia", definition: "快感缺失" }
            ],
            formulas: [
              { name: "抑郁症诊断标准", expr: "情绪 + 认知 + 生理 + 行为 = 全面症状" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解心境障碍的复杂性",
            examTips: "能够评估病因和治疗方法",
            youtube: [
              { title: "Mood Disorders", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=9M0N1Pk" }
            ]
          },
          {
            id: "psy4c4", num: 4,
            title: { zh: "心理治疗技术", en: "Psychotherapeutic Techniques" },
            overview: { zh: "学习主要的心理治疗方法。", en: "Learn major psychotherapeutic treatment approaches." },
            keyPoints: [
              "Cognitive Behavioral Therapy (CBT): principles and techniques",
              "Psychodynamic therapy: free association, dream analysis",
              "Humanistic therapy: client-centered approach",
              "Biological treatments: psychopharmacology",
              "Ethical considerations in treatment",
              "Effectiveness research and evidence-based practice"
            ],
            formulas: [
              { name: "CBT核心原理", expr: "认知-情绪-行为三角关系" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解不同治疗方法的适用性",
            examTips: "能够评估治疗效果",
            youtube: [
              { title: "Psychotherapy Approaches", channel: "Simply Psychology", url: "https://www.youtube.com/watch?v=0N2M2Lk" }
            ]
          }
        ]
      }
    }
  },

  // ============================================================
  // FURTHER MATHEMATICS
  // ============================================================
  further_math: {
    id: "further_math",
    name: { zh: "进阶数学", en: "Further Mathematics" },
    nameFull: { zh: "爱德思IAL进阶数学", en: "Pearson Edexcel IAL Further Mathematics" },
    icon: "🧮",
    color: "#6A1B9A",
    bgColor: "#F3E5F5",
    level: "IAL (International A-Level) - 2018 Syllabus",
    books: {
      FP1: {
        id: "FP1",
        title: { zh: "进阶纯数1", en: "Further Pure 1" },
        subtitle: { zh: "进阶数学基础", en: "Foundation of Further Mathematics" },
        color: "#7B1FA2",
        chapters: [
          {
            id: "fm1c1", num: 1,
            title: { zh: "复数", en: "Complex Numbers" },
            overview: { zh: "学习复数的运算、模与辐角、极坐标形式。", en: "Learn complex number operations, modulus and argument, polar form." },
            keyPoints: [
              "Complex numbers: z = a + bi",
              "Addition, subtraction, multiplication, division of complex numbers",
              "Modulus and argument: |z| and arg(z)",
              "Polar form: z = r(cosθ + isinθ)",
              "De Moivre's Theorem: (cosθ + isinθ)^n = cos(nθ) + isin(nθ)",
              "Roots of complex numbers",
              "Complex roots of polynomial equations"
            ],
            formulas: [
              { name: "复数乘法", expr: "z1z2 = r1r2[cos(θ1+θ2) + isin(θ1+θ2)]" },
              { name: "De Moivre定理", expr: "(cosθ + isinθ)^n = cos(nθ) + isin(nθ)" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解复数的几何意义",
            examTips: "熟练使用极坐标形式",
            youtube: [
              { title: "Introduction to Complex Numbers", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=7Z-0eHKzVKY" },
              { title: "De Moivre's Theorem", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=zs6MZwxaZu0" }
            ]
          },
          {
            id: "fm1c2", num: 2,
            title: { zh: "矩阵与行列式", en: "Matrices and Determinants" },
            overview: { zh: "学习矩阵运算、逆矩阵、行列式的性质。", en: "Learn matrix operations, inverse matrices, properties of determinants." },
            keyPoints: [
              "Matrix addition, subtraction, multiplication",
              "Identity matrix, zero matrix",
              "Determinant of 2x2 and 3x3 matrices",
              "Inverse of a matrix (2x2 and 3x3)",
              "Singular and non-singular matrices",
              "Matrix equations and solving systems"
            ],
            formulas: [
              { name: "2x2逆矩阵", expr: "A^-1 = (1/det(A)) × adj(A)" },
              { name: "行列式", expr: "det(A) = ad - bc (for 2x2)" }
            ],
            difficulty: "Advanced",
            hardPoints: "矩阵运算的维度匹配",
            examTips: "熟练计算3x3行列式",
            youtube: [
              { title: "Matrix Operations", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=OCcKiKqZwT4" },
              { title: "Inverse Matrices", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=0cJ-1wJZ5w" }
            ]
          },
          {
            id: "fm1c3", num: 3,
            title: { zh: "数学归纳法", en: "Proof by Induction" },
            overview: { zh: "学习用数学归纳法证明数列和矩阵命题。", en: "Learn to prove sequence and matrix propositions using mathematical induction." },
            keyPoints: [
              "Steps of proof by induction",
              "Proving summation formulae",
              "Proving divisibility results",
              "Proving matrix statements",
              "Strong induction"
            ],
            formulas: [
              { name: "归纳步骤", expr: "假设n=k成立，证明n=k+1也成立" }
            ],
            difficulty: "Advanced",
            hardPoints: "正确的归纳假设",
            examTips: "清晰写出归纳步骤",
            youtube: [
              { title: "Proof by Induction", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=0hGozWMdjV4" }
            ]
          },
          {
            id: "fm1c4", num: 4,
            title: { zh: "级数求和", en: "Series and Summation" },
            overview: { zh: "学习有限级数、斐波那契数列、递推关系。", en: "Learn finite series, Fibonacci sequence, recurrence relations." },
            keyPoints: [
              "Arithmetic and geometric series",
              "Summation notation and formulae",
              "Fibonacci sequence and properties",
              "Recurrence relations and solving",
              "Method of differences"
            ],
            formulas: [
              { name: "等差级数", expr: "Sn = n/2(a1 + an)" },
              { name: "等比级数", expr: "Sn = a1(1-r^n)/(1-r)" }
            ],
            difficulty: "Advanced",
            hardPoints: "递推关系的求解",
            examTips: "掌握常见级数公式",
            youtube: [
              { title: "Series and Sequences", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=0hGozWMdjV4" }
            ]
          },
          {
            id: "fm1c5", num: 5,
            title: { zh: "极坐标", en: "Polar Coordinates" },
            overview: { zh: "学习极坐标系统、极坐标方程、曲线绘图。", en: "Learn polar coordinate system, polar equations, curve sketching." },
            keyPoints: [
              "Polar coordinates (r, θ)",
              "Converting between Cartesian and polar",
              "Sketching polar curves",
              "Area enclosed by polar curves",
              "Tangents to polar curves"
            ],
            formulas: [
              { name: "极坐标转换", expr: "x = rcosθ, y = rsinθ" },
              { name: "极坐标面积", expr: "A = 1/2∫r²dθ" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解极坐标几何意义",
            examTips: "熟练绘制常见极坐标曲线",
            youtube: [
              { title: "Polar Coordinates", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=0X SaNlk2k" }
            ]
          }
        ]
      },
      FP2: {
        id: "FP2",
        title: { zh: "进阶纯数2", en: "Further Pure 2" },
        subtitle: { zh: "高级数学主题", en: "Advanced Mathematical Topics" },
        color: "#8E24AA",
        chapters: [
          {
            id: "fm2c1", num: 1,
            title: { zh: "双曲函数", en: "Hyperbolic Functions" },
            overview: { zh: "学习双曲函数的定义、恒等式和微分。", en: "Learn definitions, identities and differentiation of hyperbolic functions." },
            keyPoints: [
              "Definitions: sinh, cosh, tanh",
              "Hyperbolic identities",
              "Inverse hyperbolic functions",
              "Differentiation of hyperbolic functions",
              "Integration of hyperbolic functions"
            ],
            formulas: [
              { name: "双曲恒等式", expr: "cosh²x - sinh²x = 1" },
              { name: "sinh导数", expr: "d/dx(sinh x) = cosh x" }
            ],
            difficulty: "Advanced",
            hardPoints: "双曲函数与三角函数的区别",
            examTips: "熟练使用双曲恒等式",
            youtube: [
              { title: "Hyperbolic Functions", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=emM7W7kJ5w" }
            ]
          },
          {
            id: "fm2c2", num: 2,
            title: { zh: "微分方程", en: "Differential Equations" },
            overview: { zh: "学习常微分方程的求解方法。", en: "Learn solution methods for ordinary differential equations." },
            keyPoints: [
              "First order ODEs: separable",
              "First order ODEs: linear (integrating factor)",
              "Second order linear ODEs with constant coefficients",
              "Homogeneous and particular solutions",
              "Boundary conditions"
            ],
            formulas: [
              { name: "一阶线性ODE", expr: "dy/dx + P(x)y = Q(x)" },
              { name: "二阶齐次", expr: "ay'' + by' + cy = 0" }
            ],
            difficulty: "Advanced",
            hardPoints: "特解的求法",
            examTips: "正确使用积分因子",
            youtube: [
              { title: "Differential Equations", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=6a3Q7k7lZ8" }
            ]
          },
          {
            id: "fm2c3", num: 3,
            title: { zh: "向量空间", en: "Vector Spaces" },
            overview: { zh: "学习向量空间的定义、子空间、基与维数。", en: "Learn definitions, subspaces, basis and dimension of vector spaces." },
            keyPoints: [
              "Definition of vector space",
              "Subspaces and spanning sets",
              "Linear independence",
              "Basis and dimension",
              "Linear transformations"
            ],
            formulas: [
              { name: "维数公式", expr: "dim(V) = dim(null T) + dim(range T)" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解抽象向量空间",
            examTips: "掌握线性相关判断",
            youtube: [
              { title: "Vector Spaces", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=Fsx60W-JK3c" }
            ]
          }
        ]
      },
      FM1: {
        id: "FM1",
        title: { zh: "进阶力学1", en: "Further Mechanics 1" },
        subtitle: { zh: "高级力学主题", en: "Advanced Mechanics Topics" },
        color: "#5E35B1",
        chapters: [
          {
            id: "fmech1c1", num: 1,
            title: { zh: "动量与碰撞", en: "Momentum and Impulse" },
            overview: { zh: "学习动量守恒定律和弹性碰撞。", en: "Learn conservation of momentum and elastic collisions." },
            keyPoints: [
              "Momentum: p = mv",
              "Impulse: J = FΔt",
              "Conservation of momentum",
              "Elastic and inelastic collisions",
              "Coefficient of restitution"
            ],
            formulas: [
              { name: "动量守恒", expr: "m1v1 + m2v2 = m1v1' + m2v2'" },
              { name: "恢复系数", expr: "e = (v2' - v1')/(v1 - v2)" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解弹性碰撞的动能",
            examTips: "熟练使用恢复系数",
            youtube: [
              { title: "Momentum and Impulse", channel: "PhysicsOnline", url: "https://www.youtube.com/watch?v=2L3Yqy7D0c" }
            ]
          },
          {
            id: "fmech1c2", num: 2,
            title: { zh: "圆周运动", en: "Circular Motion" },
            overview: { zh: "学习匀速圆周运动和向心力。", en: "Learn uniform circular motion and centripetal force." },
            keyPoints: [
              "Angular velocity: ω = v/r",
              "Centripetal force: F = mv²/r",
              "Banking of roads",
              "Conical pendulum",
              "Vertical circular motion"
            ],
            formulas: [
              { name: "向心力", expr: "F = mv²/r = mω²r" },
              { name: "角速度", expr: "ω = 2π/T = 2πf" }
            ],
            difficulty: "Advanced",
            hardPoints: "垂直圆周运动的分析",
            examTips: "正确分析向心力来源",
            youtube: [
              { title: "Circular Motion", channel: "PhysicsOnline", url: "https://www.youtube.com/watch?v=H3cZ5s" }
            ]
          }
        ]
      },
      FS1: {
        id: "FS1",
        title: { zh: "进阶统计1", en: "Further Statistics 1" },
        subtitle: { zh: "高级统计方法", en: "Advanced Statistical Methods" },
        color: "#3949AB",
        chapters: [
          {
            id: "fs1c1", num: 1,
            title: { zh: "离散随机变量", en: "Discrete Random Variables" },
            overview: { zh: "学习离散随机变量的分布、期望与方差。", en: "Learn distribution, expectation and variance of discrete random variables." },
            keyPoints: [
              "Probability distribution functions",
              "Expectation E(X) and variance Var(X)",
              "Poisson distribution",
              "Binomial distribution",
              "Cumulative distribution functions"
            ],
            formulas: [
              { name: "期望", expr: "E(X) = Σx·P(X=x)" },
              { name: "方差", expr: "Var(X) = E(X²) - [E(X)]²" }
            ],
            difficulty: "Advanced",
            hardPoints: "组合期望与方差",
            examTips: "熟练使用分布公式",
            youtube: [
              { title: "Discrete Random Variables", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=3F4YkY50w" }
            ]
          },
          {
            id: "fs1c2", num: 2,
            title: { zh: "假设检验", en: "Hypothesis Testing" },
            overview: { zh: "学习统计假设检验的原理与方法。", en: "Learn principles and methods of statistical hypothesis testing." },
            keyPoints: [
              "Null and alternative hypotheses",
              "Significance levels and p-values",
              "Type I and Type II errors",
              "One-tailed and two-tailed tests",
              "Chi-squared tests"
            ],
            formulas: [
              { name: "Chi-squared", expr: "χ² = Σ(O-E)²/E" }
            ],
            difficulty: "Advanced",
            hardPoints: "理解显著性水平",
            examTips: "正确建立假设",
            youtube: [
              { title: "Hypothesis Testing", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=5JqYk6Yw5" }
            ]
          }
        ]
      }
    }
  }
};

export default SUBJECTS;
