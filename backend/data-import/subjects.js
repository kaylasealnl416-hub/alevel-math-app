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
            videos: [
              { title: "Edexcel Economics: Nature of Economics & The Economic Problem", channel: "Edexcel", url: "https://www.youtube.com/watch?v=HvXg00N2FTU" },
              { title: "Y1 1) The Economic Problem (Scarcity & Choice)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=W9IjktFC9Tg" },
              { title: "A Level Economics - Introduction To Economics", channel: "EconPlusDal", url: "https://www.youtube.com/watch?v=34yVBDvhAgc" },
              { title: "Y1 41) Positive, Normative Statements and Economic Methodology", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=eG-6_Il9daA" },
              { title: "Positive and Normative Statements | A Level Economics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=OkIr3Mfx-o0" },
              { title: "Y1 2) Production Possibility Curves - PPCs / PPFs", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=IzccVWouIxM" },
              { title: "PPF and Opportunity Cost | A Level Economics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=-XK9KW9dYwU" },
              { title: "Production Possibility Frontier (PPF) - Edexcel Economics Unit 1", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=w5jz9sphFfQ" },
              { title: "The Economic Problem - Scarcity", channel: "Edexcel", url: "https://www.youtube.com/watch?v=dMxy-9piB14" },
              { title: "Scarcity, Opportunity Cost and the Basic Economic Problem", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=U7p_QvH2mN4" }
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
            videos: [
              { title: "Edexcel Economics: Demand and the Demand Curve", channel: "Edexcel", url: "https://www.youtube.com/watch?v=aH_XC6EAzXE" },
              { title: "A Level Economics - Introduction to Demand", channel: "EconPlusDal", url: "https://www.youtube.com/watch?v=02mrxL8IBDM" },
              { title: "Edexcel Economics: Utility Theory - Total, Marginal & Average Utility", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=cEdDOzoa8wM" },
              { title: "Diminishing Marginal Utility | A Level Economics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=EEgZIYf3Y4w" },
              { title: "The Law of Diminishing Marginal Utility", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=0eEMWQPRn1Q" },
              { title: "Edexcel Economics: Behavioural Economics (Intro)", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=4_h0kT4DrYE" },
              { title: "Alternative Views of Consumer Behaviour: Edexcel Economics A Level", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=F7qiOihAgUo" },
              { title: "Edexcel Economics: Rational Decision Making & How Markets Work", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=VSiDQ_z0q74" },
              { title: "Scarcity & Opportunity Cost", channel: "Edexcel", url: "https://www.youtube.com/watch?v=1R8laUo-kJ4" },
              { title: "Production Possibility Frontier (PPF) Explained", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=P3b_RmK5vD8" }
            ]
          },
          {
            id: "e1c3", num: 3,
            title: { zh: "供给与生产者行为", en: "Supply & Producer Behaviour" },
            overview: { zh: "学习供给曲线、供给法则、供给弹性以及生产者剩余的概念。", en: "Learn about supply curves, law of supply, supply elasticity, producer surplus, and detailed supply curve analysis." },
            keyPoints: [
              "Law of supply: There is a direct (positive) relationship between price and quantity supplied, ceteris paribus - as price rises, quantity supplied increases",
              "Reason for upward-sloping supply: Higher prices increase profit margins, making production more attractive and covering higher marginal costs of additional production",
              "Individual supply: The supply schedule for a single producer showing quantities they are willing to supply at different prices",
              "Market supply: The horizontal sum of all individual supply curves at each price level",
              "Movement along the supply curve: Caused ONLY by change in price of the good itself (expansion when price rises, contraction when price falls)",
              "Shift of the supply curve: Caused by changes in non-price factors affecting production costs or conditions",
              "SUPPLY CURVE SHIFTS - Rightward shift (increase in supply): Lower production costs (cheaper raw materials, wages), improved technology, government subsidies, increase in number of producers, favorable weather (agriculture), lower indirect taxes",
              "SUPPLY CURVE SHIFTS - Leftward shift (decrease in supply): Higher production costs (expensive inputs), natural disasters, government taxes, decrease in number of producers, unfavorable weather",
              "SUPPLY CURVE ANALYSIS - Shape: Upward sloping from left to right, showing positive relationship between price and quantity supplied",
              "SUPPLY CURVE ANALYSIS - Producer Surplus: The area above the supply curve and below the market price, representing the benefit producers receive from selling at market price rather than their minimum acceptable price",
              "SUPPLY CURVE ANALYSIS - Producer Surplus Calculation: For each unit, PS = Market Price - Minimum Price willing to accept. Total PS = triangular area between supply curve and price line",
              "SUPPLY CURVE ANALYSIS - Producer Surplus Example: If a producer is willing to supply at £5 but sells at market price £10, producer surplus = £5 per unit. If 100 units sold, total PS depends on supply curve shape",
              "REAL-WORLD EXAMPLE - 2020-2022 Global Chip Shortage: COVID-19 disrupted supply chains → chip production costs increased and capacity reduced → leftward shift in supply → chip prices rose 300% → car and electronics production constrained. Demonstrated low PES in short-run for complex manufacturing",
              "REAL-WORLD EXAMPLE - OPEC Oil Production Cuts: OPEC controls 40% of global oil supply. When OPEC reduces production quotas → leftward shift in supply curve → oil prices rise. Example: 2022 production cuts pushed oil from $70 to $120 per barrel, demonstrating market power of suppliers",
              "REAL-WORLD EXAMPLE - Agricultural Supply Shocks: 2022 Ukraine war disrupted wheat supply (Ukraine = 10% of global wheat exports) → leftward shift in wheat supply → global wheat prices rose 50% → food inflation. Shows how supply shocks affect prices, especially for goods with inelastic demand",
              "Price Elasticity of Supply (PES): Measures responsiveness of quantity supplied to a change in price. PES = (% change in Qs) / (% change in P)",
              "PES > 1: Elastic supply - quantity supplied changes proportionally more than price (e.g., manufactured goods with spare capacity)",
              "PES < 1: Inelastic supply - quantity supplied changes proportionally less than price (e.g., agricultural products in short-run, skilled labor)",
              "PES = 1: Unit elastic supply - quantity supplied changes proportionally equal to price",
              "PES = 0: Perfectly inelastic supply (vertical supply curve) - quantity supplied cannot change regardless of price (e.g., original Picasso paintings, land in fixed location, concert tickets after venue is full)",
              "PES = ∞: Perfectly elastic supply (horizontal supply curve) - any price decrease causes quantity supplied to fall to zero (theoretical, rarely exists)",
              "Factors affecting PES - Time Period: Short-run supply is more inelastic (fixed capacity, contracts), long-run supply is more elastic (can build new factories, train workers, adjust all inputs)",
              "Factors affecting PES - Spare Capacity: Firms with spare capacity have more elastic supply (can quickly increase output), firms at full capacity have inelastic supply",
              "Factors affecting PES - Stocks/Inventory: Goods that can be stored (canned food, electronics) have more elastic supply, perishable goods (fresh fish, flowers) have inelastic supply",
              "Factors affecting PES - Mobility of Factors: If labor and capital can easily move between industries, supply is more elastic. Specialized factors (skilled surgeons, specialized machinery) make supply inelastic",
              "Factors affecting PES - Production Lag: Goods with short production time (t-shirts) have elastic supply, goods with long production time (ships, buildings) have inelastic supply"
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
            videos: [
              { title: "Y1 4) Supply and the Supply Curve (Edexcel Focus)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=qMX3CJDt22o" },
              { title: "A Level Economics - Supply (Shifts and Movements)", channel: "EconPlusDal", url: "https://www.youtube.com/watch?v=10tURzUjHjM" },
              { title: "Supply and Demand in 8 Minutes (Core Concept Review)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=kIFBaaPJUO0" },
              { title: "Y1 12) Price Elasticity of Supply (PES)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=ICjglEvPL44" },
              { title: "Price Elasticity of Supply | A-level Economics Edexcel", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=W5ZrRrKEqBA" },
              { title: "A Level Economics - Price Elasticity Of Supply Explained", channel: "EconPlusDal", url: "https://www.youtube.com/watch?v=IzjtR6_-1qI" },
              { title: "Markets, Consumers and Firms", channel: "Edexcel", url: "https://www.youtube.com/watch?v=TqFw49LWMc8" },
              { title: "Comparative and Absolute Advantage in Trade", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=C9n_JwL7pX2" },
              { title: "Supply Curves and Price Elasticity of Supply (PES)", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=S2k_PvN8mY3" }
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
            videos: [
              { title: "What Are the FOUR Market Structures in Economics?", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=u1xIZOieOUw" },
              { title: "Y2 15) Perfect Competition (完全竞争)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=2BqFpSN4IsE" },
              { title: "Y2 17) Monopoly (垄断)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=UXC51iTDEJI" },
              { title: "Y2 25) Oligopoly - Kinked Demand Curve (寡头垄断与拐折需求曲线)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=Ec19ljjvlCI" },
              { title: "Oligopoly Behaviour - Compete or Collude? (寡头博弈行为)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=qNIiBJYeO_c" },
              { title: "Y2 23) Monopolistic Competition (垄断竞争)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=DHgSBazfTEk" },
              { title: "Needs and Wants & Factors of Production", channel: "Edexcel", url: "https://www.youtube.com/watch?v=W4oQ51_f6to" },
              { title: "Demand Curves and Price Elasticity of Demand (PED)", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=D5v_TmR4qZ8" },
              { title: "Market Equilibrium and Price Determination", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=M8b_QwL5rP7" }
            ]
          },
          {
            id: "e1c5", num: 5,
            title: { zh: "市场失灵", en: "Market Failure" },
            overview: { zh: "学习市场失灵的原因：外部性、公共物品、信息不对称等问题。", en: "Learn about market failure causes: externalities, public goods, information asymmetry, with detailed graphical analysis and policy solutions." },
            keyPoints: [
              "Market failure occurs when the free market fails to allocate resources efficiently, resulting in welfare loss and deadweight loss to society",
              "NEGATIVE EXTERNALITIES - Definition: Costs imposed on third parties from production or consumption, not reflected in market price",
              "NEGATIVE EXTERNALITIES - Examples: Air pollution from factories, noise from airports, passive smoking, traffic congestion, carbon emissions",
              "NEGATIVE EXTERNALITIES - Graph Analysis: MPC (Marginal Private Cost) curve represents supply, MSC (Marginal Social Cost) = MPC + MEC (Marginal External Cost). MSC curve lies ABOVE MPC curve",
              "NEGATIVE EXTERNALITIES - Market Outcome: Free market equilibrium where MPB = MPC produces quantity Q1 at price P1. This is OVERPRODUCTION because private costs < social costs",
              "NEGATIVE EXTERNALITIES - Socially Optimal Outcome: Where MSB = MSC, producing lower quantity Q* at higher price P*. Q* < Q1 because society wants less production when external costs are considered",
              "NEGATIVE EXTERNALITIES - Deadweight Loss: Triangular area between Q* and Q1, bounded by MSC and MPB curves. Represents welfare loss to society from overproduction",
              "NEGATIVE EXTERNALITIES - Real Example: Carbon Emissions from Coal Power Plants. Private cost = fuel + labor + capital. External cost = climate change, health problems, environmental damage. Society bears these costs, not the power company",
              "POSITIVE EXTERNALITIES - Definition: Benefits to third parties from production or consumption, not captured in market price",
              "POSITIVE EXTERNALITIES - Examples: Education (informed citizens, higher productivity), vaccination (herd immunity), R&D (knowledge spillovers), bee-keeping (pollination for nearby farms)",
              "POSITIVE EXTERNALITIES - Graph Analysis: MPB (Marginal Private Benefit) curve represents demand, MSB (Marginal Social Benefit) = MPB + MEB (Marginal External Benefit). MSB curve lies ABOVE MPB curve",
              "POSITIVE EXTERNALITIES - Market Outcome: Free market equilibrium where MPB = MPC produces quantity Q1 at price P1. This is UNDERPRODUCTION because private benefits < social benefits",
              "POSITIVE EXTERNALITIES - Socially Optimal Outcome: Where MSB = MSC, producing higher quantity Q* at price P*. Q* > Q1 because society wants more production when external benefits are considered",
              "POSITIVE EXTERNALITIES - Deadweight Loss: Triangular area between Q1 and Q*, bounded by MSB and MPC curves. Represents welfare loss to society from underproduction",
              "POSITIVE EXTERNALITIES - Real Example: COVID-19 Vaccination. Private benefit = personal protection. External benefit = herd immunity protects others, reduces healthcare burden, enables economic reopening. Society benefits more than individual",
              "POLICY SOLUTION 1 - Pigouvian Tax (for negative externalities): Tax equal to marginal external cost at socially optimal output. Shifts MPC curve up to MSC, internalizing the externality",
              "POLICY SOLUTION 1 - Pigouvian Tax Example: Sweden Carbon Tax (1991-present). Started at $27/ton CO2, now $137/ton (world's highest). Result: GDP grew 78% while emissions fell 29% (1990-2020). Transport sector: biofuel use rose from 0% to 30%",
              "POLICY SOLUTION 1 - Pigouvian Tax Advantages: Creates revenue for government, maintains market mechanism, incentivizes innovation (firms seek cleaner technology), efficient (firms with lowest abatement costs reduce most)",
              "POLICY SOLUTION 1 - Pigouvian Tax Disadvantages: Difficult to measure external cost accurately, may be regressive (hurts poor more), firms may relocate to countries without tax (carbon leakage), politically unpopular",
              "POLICY SOLUTION 2 - Subsidies (for positive externalities): Payment equal to marginal external benefit at socially optimal output. Shifts MPC curve down or MPB curve up",
              "POLICY SOLUTION 2 - Subsidy Example: UK University Tuition Subsidies. Government pays ~£7,000 per student per year, students pay ~£9,250. Without subsidy, fewer would attend university, losing social benefits (innovation, productivity, tax revenue)",
              "POLICY SOLUTION 2 - Subsidy Advantages: Increases consumption/production of merit goods, politically popular, can target specific groups (low-income students)",
              "POLICY SOLUTION 2 - Subsidy Disadvantages: Opportunity cost (government spending), may lead to overconsumption, difficult to remove once established (vested interests), may be inefficient if poorly targeted",
              "POLICY SOLUTION 3 - Regulation: Direct rules limiting harmful activities or mandating beneficial ones. Examples: emission limits, safety standards, mandatory education",
              "POLICY SOLUTION 3 - Regulation Advantages: Certainty of outcome (quantity controlled), simple to understand and enforce, can ban extremely harmful activities",
              "POLICY SOLUTION 3 - Regulation Disadvantages: Inflexible (same rule for all firms), no incentive to exceed standard, high monitoring costs, may stifle innovation",
              "POLICY SOLUTION 4 - Tradable Pollution Permits (Cap and Trade): Government sets total pollution limit (cap), issues permits, firms can trade permits",
              "POLICY SOLUTION 4 - Permits Example: EU Emissions Trading System (ETS). Covers 40% of EU emissions. Firms exceeding limit must buy permits, firms below limit can sell. Permit price ~€80/ton (2023)",
              "POLICY SOLUTION 4 - Permits Advantages: Certainty of total pollution, cost-effective (firms with low abatement costs reduce more), creates market for permits, incentivizes innovation",
              "POLICY SOLUTION 4 - Permits Disadvantages: Initial allocation controversial (free vs auction), price volatility, monitoring costs, may allow rich firms to keep polluting",
              "POLICY SOLUTION 5 - Property Rights (Coase Theorem): Clearly define property rights, allow parties to negotiate. If transaction costs are low, efficient outcome achieved regardless of initial allocation",
              "POLICY SOLUTION 5 - Property Rights Example: Fishing quotas. Assign tradable quotas to fishermen, preventing overfishing. New Zealand's quota system (1986) stabilized fish stocks",
              "POLICY SOLUTION 5 - Property Rights Advantages: Market-based solution, no government intervention needed, efficient allocation",
              "POLICY SOLUTION 5 - Property Rights Disadvantages: High transaction costs (negotiation, legal fees), difficult for diffuse externalities (air pollution affects millions), assumes rational negotiation",
              "POLICY SOLUTION 6 - Information Provision: Educate consumers/producers about external costs/benefits. Examples: health warnings on cigarettes, energy efficiency labels, nutrition information",
              "POLICY SOLUTION 6 - Information Advantages: Low cost, preserves consumer choice, addresses information failure",
              "POLICY SOLUTION 6 - Information Disadvantages: Assumes rational behavior (people may ignore information), slow to change behavior, ineffective for addictive goods",
              "PUBLIC GOODS - Definition: Non-excludable (cannot prevent non-payers from using) AND non-rivalrous (one person's use doesn't reduce availability for others)",
              "PUBLIC GOODS - Examples: National defense, street lighting, lighthouses, flood defenses, public fireworks displays",
              "PUBLIC GOODS - Free-Rider Problem: People can benefit without paying, so private firms won't provide (no profit). Leads to market failure - zero or insufficient provision",
              "PUBLIC GOODS - Solution: Government provision funded by taxation. Everyone pays through taxes, everyone benefits",
              "MERIT GOODS - Definition: Goods with positive externalities that are under-consumed in free market. Society believes people consume too little",
              "MERIT GOODS - Examples: Education, healthcare, museums, libraries, sports facilities",
              "MERIT GOODS - Information Failure: Consumers undervalue long-term benefits (myopia), leading to under-consumption",
              "DEMERIT GOODS - Definition: Goods with negative externalities that are over-consumed in free market. Society believes people consume too much",
              "DEMERIT GOODS - Examples: Cigarettes, alcohol, gambling, sugary drinks, drugs",
              "DEMERIT GOODS - Information Failure: Consumers underestimate long-term costs (addiction, health problems), leading to over-consumption",
              "INFORMATION ASYMMETRY - Definition: One party has more/better information than another, leading to market failure",
              "INFORMATION ASYMMETRY - Adverse Selection: Hidden characteristics before transaction. Example: Used car market (sellers know defects, buyers don't), leading to 'market for lemons'",
              "INFORMATION ASYMMETRY - Moral Hazard: Hidden actions after transaction. Example: Insurance (people take more risks after insuring), bank bailouts (banks take excessive risks knowing government will rescue)",
              "INFORMATION ASYMMETRY - Solutions: Regulation (mandatory disclosure), warranties/guarantees, reputation mechanisms (reviews, ratings), government inspection/certification"
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
            videos: [
              { title: "Y1 22) Types of Market Failure", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=2HU2ZLRGyOM" },
              { title: "Edexcel A level Economics 1.3 Market Failure", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=Ay9CBsvGYhk" },
              { title: "Types of Market Failure: Edexcel Economics A Level", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=XFMptEHCfc8" },
              { title: "Y1 23) Negative Externalities in Production & Consumption", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=2bI_EX3U5xc" },
              { title: "Y1 24) Positive Externalities in Consumption and Production", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=mcQvtKDiTho" },
              { title: "Edexcel A level Economics: Solutions to Negative Externalities", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=KrQZsDhmMac" },
              { title: "Market Failure | A-level Economics | Edexcel Focus", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=YE3oALZ5pl8" },
              { title: "What is Scarcity?", channel: "Edexcel", url: "https://www.youtube.com/watch?v=-YYAqt3-79w" },
              { title: "Market Failure and Externalities", channel: "A-Level Economics", url: "https://www.youtube.com/watch?v=F4m_RvK9qX5" }
            ]
          },
          {
            id: "e1c6", num: 6,
            title: { zh: "政府干预", en: "Government Intervention" },
            overview: { zh: "学习政府干预市场的各种手段及其效果。", en: "Learn about various government interventions in markets and their effects, with detailed graphical analysis and real-world examples." },
            keyPoints: [
              "INDIRECT TAXES - Definition: Taxes on goods and services (expenditure taxes), not on income or wealth",
              "INDIRECT TAXES - Types: (1) Specific tax (fixed amount per unit, e.g., £2 per pack of cigarettes), (2) Ad valorem tax (percentage of price, e.g., 20% VAT)",
              "INDIRECT TAXES - Graphical Analysis: Tax shifts supply curve vertically upward (leftward) by tax amount. New equilibrium: higher price (P1), lower quantity (Q1)",
              "INDIRECT TAXES - Price Changes: Consumer price rises from P0 to P1 (consumer burden). Producer price falls from P0 to P2 (producer burden). Tax = P1 - P2",
              "INDIRECT TAXES - Tax Incidence: Distribution of tax burden between consumers and producers depends on relative elasticities",
              "INDIRECT TAXES - Incidence Rule 1: If demand is more inelastic than supply (PED < PES), consumers bear larger burden. Example: Cigarettes (addictive, inelastic demand) - consumers pay most of tax",
              "INDIRECT TAXES - Incidence Rule 2: If supply is more inelastic than demand (PES < PED), producers bear larger burden. Example: Fresh fish (perishable, inelastic supply) - producers absorb most of tax",
              "INDIRECT TAXES - Tax Revenue: Government revenue = Tax per unit × Quantity sold after tax. Shown as rectangle on graph (tax × Q1)",
              "INDIRECT TAXES - Deadweight Loss: Welfare loss from reduced quantity traded (Q0 → Q1). Triangular area between supply and demand curves",
              "INDIRECT TAXES - Real Example: UK Sugar Tax (2018): 18p per liter for drinks with 5-8g sugar/100ml, 24p for >8g. Result: 50% of drinks reformulated to avoid tax, childhood obesity decline",
              "SUBSIDIES - Definition: Government payments to producers (or consumers) to encourage production/consumption of merit goods or support industries",
              "SUBSIDIES - Graphical Analysis: Subsidy shifts supply curve vertically downward (rightward) by subsidy amount. New equilibrium: lower price (P1), higher quantity (Q1)",
              "SUBSIDIES - Price Changes: Consumer price falls from P0 to P1 (consumer benefit). Producer receives P2 = P1 + subsidy (producer benefit)",
              "SUBSIDIES - Subsidy Distribution: Like tax incidence, benefit distribution depends on elasticities. More inelastic side receives larger benefit",
              "SUBSIDIES - Government Cost: Total subsidy cost = Subsidy per unit × Quantity produced. Shown as rectangle (subsidy × Q1). Opportunity cost: could spend on healthcare, education",
              "SUBSIDIES - Real Example: EU Common Agricultural Policy (CAP): €55 billion/year subsidies to farmers. Benefits: Food security, rural employment. Costs: Overproduction, environmental damage, trade distortions",
              "SUBSIDIES - Real Example: Electric Vehicle Subsidies: UK offered £2,500-£3,000 per EV (2011-2022). Result: EV sales rose from 3,500 (2013) to 267,000 (2022). Ended due to budget constraints",
              "MAXIMUM PRICE (Price Ceiling) - Definition: Legal maximum price set below equilibrium, intended to make goods affordable (e.g., rent controls, food price caps)",
              "MAXIMUM PRICE - Graphical Analysis: Price ceiling below equilibrium creates excess demand (shortage). Qd > Qs at ceiling price. Shortage = Qd - Qs",
              "MAXIMUM PRICE - Consequences: (1) Shortages and queuing, (2) Black markets emerge (illegal higher prices), (3) Quality deterioration (suppliers cut costs), (4) Rationing needed, (5) Reduced supply in long-run",
              "MAXIMUM PRICE - Real Example: Venezuela Price Controls (2003-2018): Government set maximum prices on food, medicine. Result: Severe shortages, black markets, hyperinflation, economic collapse. Lesson: Price controls don't address underlying supply problems",
              "MAXIMUM PRICE - Real Example: New York Rent Control (1943-present): Limits rent increases. Benefits: Affordable housing for existing tenants. Costs: Housing shortage, deteriorating quality, black market, reduced new construction",
              "MINIMUM PRICE (Price Floor) - Definition: Legal minimum price set above equilibrium, intended to protect producers or workers (e.g., minimum wage, agricultural price supports)",
              "MINIMUM PRICE - Graphical Analysis: Price floor above equilibrium creates excess supply (surplus). Qs > Qd at floor price. Surplus = Qs - Qd",
              "MINIMUM PRICE - Consequences: (1) Unsold surplus, (2) Government must buy surplus (storage costs), (3) Inefficient resource allocation, (4) Higher prices for consumers, (5) Potential unemployment (if minimum wage)",
              "MINIMUM PRICE - Real Example: EU Butter Mountain (1970s-1980s): CAP set minimum prices for dairy. Result: Massive butter surplus (1.4 million tons stored), huge storage costs, eventually sold cheaply to USSR or destroyed",
              "MINIMUM WAGE - Definition: Price floor in labor market, legal minimum hourly wage. UK: £10.42/hour (2023, age 23+)",
              "MINIMUM WAGE - Arguments For: (1) Reduces poverty, (2) Increases worker motivation, (3) Reduces inequality, (4) Stimulates demand (workers spend more)",
              "MINIMUM WAGE - Arguments Against: (1) May cause unemployment (especially for young/low-skilled), (2) Firms may cut hours or benefits, (3) May accelerate automation, (4) Regional differences ignored (London vs rural areas)",
              "MINIMUM WAGE - Evidence: UK National Living Wage (2016): Raised from £7.20 to £10.42 (2023). Studies show minimal unemployment effect, but some hour reductions. Debate continues",
              "REGULATION - Definition: Government rules and laws controlling business behavior to correct market failures or protect consumers",
              "REGULATION - Types: (1) Health and safety standards, (2) Environmental regulations (emission limits), (3) Consumer protection (product safety), (4) Financial regulation (banking rules), (5) Competition law (anti-monopoly)",
              "REGULATION - Advantages: (1) Directly addresses market failures, (2) Certainty of outcome, (3) Can ban harmful activities, (4) Protects vulnerable groups",
              "REGULATION - Disadvantages: (1) Compliance costs for firms, (2) Reduced flexibility and innovation, (3) Enforcement costs, (4) May be captured by industry (regulatory capture), (5) One-size-fits-all approach",
              "REGULATION - Real Example: EU GDPR (2018): Data protection regulation, fines up to €20m or 4% of revenue. Result: Improved privacy, but compliance costs €1.3 billion for UK firms alone",
              "TRADEABLE POLLUTION PERMITS (Cap and Trade) - Definition: Government sets total pollution limit (cap), issues permits, firms can trade permits in market",
              "TRADEABLE PERMITS - Mechanism: (1) Government sets cap (total allowed pollution), (2) Issues/auctions permits, (3) Firms exceeding limit must buy permits, (4) Firms below limit can sell permits, (5) Permit price determined by market",
              "TRADEABLE PERMITS - Advantages: (1) Certainty of total pollution (cap), (2) Cost-effective (low-cost reducers do more), (3) Incentivizes innovation (reduce pollution to sell permits), (4) Market-based (efficient allocation), (5) Government revenue (if auctioned)",
              "TRADEABLE PERMITS - Disadvantages: (1) Initial allocation controversial (free vs auction), (2) Permit price volatility, (3) Monitoring and enforcement costs, (4) May allow rich firms to keep polluting, (5) International coordination difficult",
              "TRADEABLE PERMITS - Real Example: EU Emissions Trading System (ETS, 2005-present): Covers 40% of EU emissions, 10,000+ installations. Permit price: €5 (2013) → €80 (2023). Result: 35% emission reduction (2005-2020), but criticized for initial over-allocation",
              "GOVERNMENT FAILURE - Definition: When government intervention makes the situation worse or creates new problems, resulting in net welfare loss",
              "GOVERNMENT FAILURE - Cause 1: Imperfect Information: Government lacks complete information about costs, benefits, and market conditions. Example: Subsidizing biofuels increased food prices (didn't anticipate impact)",
              "GOVERNMENT FAILURE - Cause 2: Unintended Consequences: Policies have unexpected side effects. Example: Rent controls reduce housing supply, worsening shortage",
              "GOVERNMENT FAILURE - Cause 3: Political Pressures: Politicians prioritize votes over efficiency. Example: Agricultural subsidies continue despite inefficiency due to farmer lobby",
              "GOVERNMENT FAILURE - Cause 4: Regulatory Capture: Regulators influenced by industries they regulate. Example: Financial regulators too close to banks before 2008 crisis",
              "GOVERNMENT FAILURE - Cause 5: Bureaucratic Inefficiency: Government agencies less efficient than private sector due to lack of profit motive. Example: State-owned enterprises often loss-making",
              "GOVERNMENT FAILURE - Cause 6: Time Lags: Policy takes time to implement and have effect. Example: Infrastructure projects take years, by which time economic conditions changed",
              "GOVERNMENT FAILURE - Cause 7: Excessive Costs: Intervention costs exceed benefits. Example: Monitoring and enforcement costs of regulations may outweigh benefits",
              "GOVERNMENT FAILURE - Real Example: US Prohibition (1920-1933): Banned alcohol to reduce crime and health problems. Result: Organized crime flourished, illegal speakeasies, government lost tax revenue, eventually repealed. Classic government failure",
              "GOVERNMENT FAILURE - Real Example: EU Biofuel Mandate (2003): Required 10% biofuel in transport fuel to reduce emissions. Unintended consequence: Rainforest cleared for palm oil, food prices rose, net emissions increased. Policy revised 2015",
              "EVALUATION - Choosing Intervention: Consider (1) Severity of market failure, (2) Costs vs benefits of intervention, (3) Risk of government failure, (4) Equity vs efficiency trade-off, (5) Short-run vs long-run effects, (6) Political feasibility"
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
            videos: [
              { title: "Government Intervention - 25 Mark A-Level Economics Question (Edexcel)", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=PpHnw5UtZW8" },
              { title: "Government Intervention | A-level Economics | Edexcel, OCR, AQA", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=BmtWOhz5R9w" },
              { title: "Y1 30) Subsidy and Market Failure (补贴与市场失灵)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=KTsXGkK7Lkg" },
              { title: "Government Intervention - Micro Topic 2.8", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=eE_FYK2FlnQ" },
              { title: "Y1 28) Government Failure (政府失灵核心必看)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=WN8LEjGIkrA" },
              { title: "Government Failure Explained | A Level Economics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=HOfl0CNYuQM" },
              { title: "Government Failure - Topical Examples | A Level Economics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=FJswdZaIO_0" }
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
            videos: [
              { title: "Macroeconomics - Everything You Need to Know", channel: "AcaDutch", url: "https://www.youtube.com/watch?v=MKO1icFVtDc" },
              { title: "Aggregate Demand and Supply and LRAS", channel: "Jacob Clifford", url: "https://www.youtube.com/watch?v=em5Wqg1IVp8" },
              { title: "8 Marker - Paper 1, 2 & 3 - Edexcel A Level Economics", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=-QjR8slEKuU" },
              { title: "15 Marker - Paper 1 & 2 - Edexcel A Level Economics", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=bNfqXgWoZcc" },
              { title: "25 Marker - Paper 1 & 2 - Edexcel A Level Economics", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=FKMNXwAKUc4" }
            ]
          },
          {
            id: "e2c2", num: 2,
            title: { zh: "总需求", en: "Aggregate Demand" },
            overview: { zh: "学习总需求的构成要素及其影响因素。", en: "Learn the components of aggregate demand and factors affecting them, including detailed AD curve analysis." },
            keyPoints: [
              "Aggregate Demand (AD): Total planned expenditure on final goods and services at each price level in an economy",
              "AD = C + I + G + (X - M) where C = Consumption, I = Investment, G = Government spending, X = Exports, M = Imports",
              "Consumption (C): Household spending on goods and services, typically 60-70% of AD, largest component",
              "Factors affecting consumption: Disposable income (Y), wealth (assets), interest rates, consumer confidence, expectations about future income, availability of credit",
              "Investment (I): Spending by firms on capital goods (machinery, buildings, equipment), typically 15-20% of AD, most volatile component",
              "Factors affecting investment: Interest rates (cost of borrowing), expected rate of return, business confidence, level of technology, corporate taxes, accelerator effect",
              "Government expenditure (G): Spending on goods and services by government (healthcare, education, defense, infrastructure), typically 15-25% of AD",
              "Net exports (X - M): Exports minus imports, can be positive (trade surplus) or negative (trade deficit)",
              "Factors affecting net exports: Exchange rates, relative inflation rates, foreign income levels, trade policies, competitiveness",
              "AD CURVE ANALYSIS - Shape: The AD curve slopes downward from left to right, showing inverse relationship between price level and real GDP",
              "AD CURVE ANALYSIS - Wealth Effect (Real Balance Effect): When price level falls → real value of money holdings increases → consumers feel wealthier → consumption increases → AD increases. Example: If prices fall 10%, your £10,000 savings can now buy more goods, so you spend more",
              "AD CURVE ANALYSIS - Interest Rate Effect: When price level falls → less money needed for transactions → money demand decreases → interest rates fall → investment and consumption (on credit) increase → AD increases. Example: Lower prices mean firms need less money to buy inputs, reducing demand for loans, lowering interest rates, encouraging investment",
              "AD CURVE ANALYSIS - International Trade Effect (Net Export Effect): When domestic price level falls → domestic goods become relatively cheaper compared to foreign goods → exports increase and imports decrease → net exports (X-M) increase → AD increases. Example: If UK prices fall relative to EU prices, UK exports become more competitive, increasing demand for UK goods",
              "AD CURVE ANALYSIS - Movement Along vs Shift: Movement along AD curve is caused by changes in price level only. Shifts in AD curve are caused by changes in non-price factors affecting C, I, G, or (X-M)",
              "AD CURVE SHIFTS - Rightward Shift (Increase in AD): Caused by increases in C (higher consumer confidence, tax cuts, wealth increase), I (lower interest rates, improved business confidence), G (expansionary fiscal policy), or (X-M) (depreciation of currency, higher foreign income)",
              "AD CURVE SHIFTS - Leftward Shift (Decrease in AD): Caused by decreases in C (recession fears, tax increases), I (higher interest rates, pessimistic expectations), G (austerity measures), or (X-M) (appreciation of currency, recession in trading partners)",
              "REAL-WORLD EXAMPLE - 2008 Financial Crisis: Collapse in consumer and business confidence → sharp fall in C and I → leftward shift in AD → recession. Governments responded with fiscal stimulus (increase G) and central banks cut interest rates to boost AD",
              "REAL-WORLD EXAMPLE - COVID-19 Pandemic (2020): Lockdowns → collapse in C and I → massive leftward shift in AD. Governments implemented unprecedented fiscal stimulus (furlough schemes, direct payments) to support AD",
              "Components of AD can be influenced by fiscal policy (changes in G and taxation affecting C) and monetary policy (interest rate changes affecting C and I)",
              "Multiplier effect: Initial change in any component of AD (especially I or G) leads to larger final change in national income through rounds of spending. Multiplier = 1/(1-MPC) or 1/MPS or 1/(MPS+MPT+MPM)"
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
            videos: [
              { title: "Y1 1) Macro Objectives of Government (TIGERS)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=OPV1BOs1ISI" },
              { title: "Macroeconomic Objectives - A Level and IB Economics", channel: "Economics Help", url: "https://www.youtube.com/watch?v=TL95p1m-0Z4" },
              { title: "A Level Economics - Macroeconomic Objectives", channel: "tutor2u", url: "https://www.youtube.com/watch?v=eRQwZJ1tNVY" },
              { title: "Understanding economic growth | AP Macroeconomics", channel: "ACDC Leadership", url: "https://www.youtube.com/watch?v=khDAji7dXw0" }
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
            videos: [
              { title: "Y1 30) Fiscal Policy - Government Spending and Taxation", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=NEcfy0HpewQ" },
              { title: "Fiscal & Monetary Policy - Macro Topic 5.1", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=bv-uNNkE39I" },
              { title: "Fiscal Policy and Supply Side Policy – 15 Mark Question", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=QbY9cSIDh0I" },
              { title: "Macroeconomic Policies and Impact on Firms and Individuals", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=0tHitgMvU_U" }
            ]
          },
          {
            id: "e2c4", num: 4,
            title: { zh: "国民收入", en: "National Income" },
            overview: { zh: "学习国民收入的决定与乘数效应。", en: "Learn about national income determination and the multiplier effect, with real-world examples from the 2008 financial crisis." },
            keyPoints: [
              "Equilibrium national income: Where AD = AS (or planned spending = actual output), representing the level of income where there is no tendency to change",
              "Injections: Additions to circular flow of income - Investment (I), Government spending (G), Exports (X)",
              "Withdrawals (Leakages): Removals from circular flow - Savings (S), Taxes (T), Imports (M)",
              "Equilibrium condition: Injections = Withdrawals (I + G + X = S + T + M). When injections > withdrawals, income rises; when withdrawals > injections, income falls",
              "Multiplier effect: Initial change in any injection or withdrawal leads to larger final change in national income through successive rounds of spending",
              "Marginal Propensity to Consume (MPC): Fraction of additional income that households spend on consumption. MPC = ΔC / ΔY",
              "Marginal Propensity to Save (MPS): Fraction of additional income that households save. MPS = ΔS / ΔY",
              "MPC + MPS = 1 (additional income is either spent or saved)",
              "Multiplier (k): Ratio of final change in equilibrium income to initial change in spending. k = ΔY / ΔInjection",
              "Multiplier formula (simple): k = 1 / (1 - MPC) = 1 / MPS",
              "Multiplier formula (with tax and imports): k = 1 / (MPS + MPT + MPM) where MPT = marginal propensity to tax, MPM = marginal propensity to import",
              "Higher MPC → Larger multiplier → Greater impact on income. Example: MPC = 0.8 gives k = 5; MPC = 0.5 gives k = 2",
              "Leakages (withdrawals) reduce the multiplier effect by removing spending from the circular flow at each round",
              "MULTIPLIER PROCESS EXAMPLE: Government spends £100m on infrastructure (MPC = 0.8). Round 1: £100m income to construction workers. Round 2: Workers spend £80m (0.8 × £100m), save £20m. Round 3: Recipients spend £64m (0.8 × £80m), save £16m. Total effect: £100m × 5 = £500m increase in national income",
              "REAL-WORLD CASE STUDY - 2008 Financial Crisis and Multiplier Effect: US housing bubble burst → banks collapsed → credit freeze → sharp fall in investment and consumption",
              "2008 CRISIS - Initial Shock: Investment fell by approximately $1 trillion (2007-2009) as businesses cut spending and banks stopped lending",
              "2008 CRISIS - Multiplier Effect in Action: Investment decline → construction workers lose jobs → they cut consumption → retailers lose sales → retail workers lose jobs → further consumption cuts. Negative multiplier amplified the initial shock",
              "2008 CRISIS - Multiplier Calculation: Assuming MPC = 0.8, multiplier k = 1/(1-0.8) = 5. Initial investment fall of $1 trillion → Total GDP decline = $1 trillion × 5 = $5 trillion (theoretical). Actual US GDP fell 2.5% in 2009",
              "2008 CRISIS - Government Response: US implemented $787 billion stimulus package (American Recovery and Reinvestment Act 2009) to boost AD through positive multiplier effect",
              "2008 CRISIS - Stimulus Multiplier: Government spending increase → income to recipients → they spend (MPC × income) → further income increases. Goal: Offset negative multiplier from investment collapse",
              "2008 CRISIS - Outcome: GDP contracted 2.5% in 2009 but recovered to positive growth in 2010. Unemployment peaked at 10% (2009), took 6 years to return to pre-crisis levels. Demonstrated importance of fiscal policy in severe recessions",
              "2008 CRISIS - Lessons: (1) Multiplier works in both directions (positive and negative), (2) Financial sector shocks can trigger large multiplier effects, (3) Government intervention can stabilize economy through multiplier, (4) Recovery takes time even with stimulus",
              "Deflationary gap (Recessionary gap): When equilibrium income is below full employment level. AD is insufficient, causing unemployment. Solution: Increase injections (G, I, X) or reduce withdrawals (cut taxes)",
              "Inflationary gap: When equilibrium income exceeds full employment level. Excess AD causes inflation. Solution: Decrease injections or increase withdrawals (raise taxes)",
              "Factors affecting multiplier size: MPC (higher = larger multiplier), tax rates (higher = smaller multiplier), import propensity (higher = smaller multiplier), time lags (longer = weaker effect)",
              "Multiplier in open economy: Smaller than closed economy because imports are a leakage. Money spent on imports doesn't circulate domestically",
              "Multiplier limitations: Assumes spare capacity (if economy at full employment, multiplier mainly causes inflation), time lags (effect takes months/years), crowding out (government borrowing may reduce private investment)"
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
            videos: [
              { title: "Y1 35) Monetary Policy - Interest Rates, Money Supply & Exchange Rate", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=uBaTPugw3M4" },
              { title: "The Difference Between Fiscal and Monetary Policy", channel: "tutor2u", url: "https://www.youtube.com/watch?v=o0Yt6buayZ4" },
              { title: "Monetary Policy | A-Level Economics Basics", channel: "tutor2u", url: "https://www.youtube.com/watch?v=gehC_Dx7osE" }
            ]
          },
          {
            id: "e2c5", num: 5,
            title: { zh: "经济增长", en: "Economic Growth" },
            overview: { zh: "学习经济增长的衡量、来源及其政策。", en: "Comprehensive study of economic growth measurement, sources, theories, and policies, including growth models and real-world case studies." },
            keyPoints: [
              "Economic growth: Sustained increase in productive capacity of an economy over time, measured by real GDP growth rate",
              "GDP growth rate: Annual percentage change in real GDP, formula: [(GDP₂ - GDP₁) / GDP₁] × 100%",
              "Actual economic growth: Short-run increase in real GDP, movement towards full capacity (closing output gap), shown as movement along PPF or towards LRAS",
              "Potential economic growth: Long-run increase in productive capacity (LRAS shift right), expansion of PPF outward, determined by quantity and quality of factors of production",
              "Sustainable growth: Long-term growth that can be maintained without depleting resources or harming future generations, balances economic, environmental, and social objectives",

              "GRAPHICAL ANALYSIS - Production Possibility Frontier (PPF): Shows maximum output combinations an economy can produce with given resources. Actual growth = movement from inside PPF towards the frontier (using spare capacity). Potential growth = outward shift of entire PPF (increased productive capacity)",
              "GRAPHICAL ANALYSIS - LRAS Shift: Potential growth shown as rightward shift of Long-Run Aggregate Supply curve. Caused by: increased quantity of factors (labour force growth, capital accumulation), improved quality of factors (education, technology, efficiency)",

              "Benefits of growth: (1) Higher living standards - increased real incomes and consumption, (2) Reduced poverty - more employment opportunities, (3) More tax revenue - funds public services without raising tax rates, (4) Improved welfare - better healthcare, education, infrastructure, (5) Increased business confidence - encourages investment",
              "Costs of growth: (1) Environmental damage - pollution, climate change, resource depletion, (2) Inequality - benefits may not be evenly distributed, (3) Opportunity cost - resources used for investment cannot be consumed now, (4) Cultural impacts - traditional lifestyles disrupted, (5) Stress and work-life balance issues",

              "Sources of growth - Capital accumulation: Investment in physical capital (machinery, factories, infrastructure) increases productive capacity. Requires saving and sacrifice of current consumption. Example: China's investment rate 40-45% of GDP (2000-2020) fueled rapid growth",
              "Sources of growth - Labour force growth: Increase in quantity of workers through population growth, immigration, higher participation rates. Quality matters more than quantity - skilled workers contribute more to output",
              "Sources of growth - Productivity improvements: Technological progress, innovation, better education and training. Most important source of long-run sustainable growth as it doesn't rely on resource depletion",

              "Investment: Spending on capital goods (machinery, equipment, buildings) that increases productive capacity. Gross investment = total spending. Net investment = gross investment - depreciation. Only net investment increases capital stock",
              "Human capital: Skills, knowledge, and health of workforce acquired through education, training, and experience. Higher human capital → higher productivity → higher wages and output. Example: South Korea invested 5% of GDP in education (1960-2000), became high-income country",
              "Technology: New methods of production, innovation, research and development (R&D). Includes process innovation (producing more efficiently) and product innovation (new goods/services). Example: Internet, smartphones, AI transformed productivity",

              "Capital widening: Adding more capital but maintaining capital per worker ratio (K/L constant). Supports growing labour force but doesn't increase labour productivity. Example: Building more factories as population grows",
              "Capital deepening: Increasing capital per worker (K/L rises), leading to higher labour productivity. Workers have more/better equipment to work with. Example: Automation in manufacturing - robots increase output per worker",

              "Productivity: Output per unit of input, key determinant of living standards",
              "Labour productivity: Output per worker or per hour worked, formula: Real GDP / Total labour hours. UK labour productivity: £37 per hour (2022)",
              "Multi-factor productivity (Total Factor Productivity): Growth not explained by capital or labour inputs alone. Captures technological progress, efficiency improvements, better management. Accounts for 50-70% of long-run growth in developed economies",

              "SOLOW GROWTH MODEL - Key Assumptions: (1) Diminishing returns to capital - each additional unit of capital adds less output, (2) Constant returns to scale, (3) Exogenous technological progress, (4) Savings rate determines investment",
              "SOLOW GROWTH MODEL - Steady State: Economy reaches equilibrium where investment exactly offsets depreciation. Output per worker stops growing unless technology improves. Explains why poor countries can grow faster (catch-up effect) but rich countries need innovation",
              "SOLOW GROWTH MODEL - Implications: (1) Capital accumulation alone cannot sustain long-run growth due to diminishing returns, (2) Technological progress is essential for sustained growth, (3) Higher savings rate increases steady-state capital and output but not long-run growth rate, (4) Convergence hypothesis - poor countries should grow faster than rich countries",

              "ENDOGENOUS GROWTH THEORY - Key Difference from Solow: Technology is endogenous (determined within model) not exogenous. Investment in human capital, R&D, and knowledge creates positive externalities and spillover effects that prevent diminishing returns",
              "ENDOGENOUS GROWTH THEORY - Policy Implications: (1) Government can influence long-run growth rate through education, R&D subsidies, patent protection, (2) Knowledge spillovers justify government intervention, (3) Increasing returns to scale possible in knowledge production, (4) No automatic convergence - poor countries may stay poor without right policies",

              "Growth strategies - Education and training: Increases human capital, productivity, and innovation capacity. Returns to education: each additional year of schooling raises wages by 8-10% on average",
              "Growth strategies - Investment incentives: Tax breaks, subsidies, stable macroeconomic environment to encourage private investment. Example: Singapore's low corporate tax (17%) attracted FDI",
              "Growth strategies - Infrastructure development: Transport, energy, telecommunications networks reduce costs and increase efficiency. Example: China's high-speed rail network (40,000km) connected cities and boosted trade",
              "Growth strategies - Trade openness: Access to larger markets, technology transfer, competitive pressure drives efficiency. Example: South Korea's export-led growth strategy",
              "Growth strategies - Technology transfer: Adopting technologies from advanced countries. Example: Japan's post-WWII strategy of importing and improving Western technology",
              "Growth strategies - Institutional quality: Property rights, rule of law, low corruption, political stability. Strong institutions attract investment and encourage entrepreneurship",

              "REAL EXAMPLE - China's Growth Miracle (1978-2020): GDP growth averaged 9.5% per year for 40 years, lifting 800 million out of poverty. Key factors: (1) Economic reforms - shift from central planning to market economy (1978), (2) High investment rate - 40-45% of GDP, (3) Export-led growth - 'factory of the world', (4) Technology transfer - joint ventures with foreign firms, (5) Infrastructure investment - massive spending on roads, railways, ports, (6) Urbanization - 300 million moved from rural to urban areas. Result: GDP per capita rose from $156 (1978) to $10,500 (2020), became world's 2nd largest economy",
              "REAL EXAMPLE - Japan's Lost Decades (1991-2010): After rapid growth (1950-1990), Japan experienced 20 years of stagnation. Causes: (1) Asset price bubble burst (1991) - stock market fell 60%, property prices fell 70%, (2) Banking crisis - bad loans, credit crunch, (3) Deflation - prices fell, consumers delayed spending, (4) Aging population - shrinking workforce, high dependency ratio, (5) Zombie companies - inefficient firms kept alive by banks. Policy responses failed: (1) Zero interest rates couldn't stimulate demand (liquidity trap), (2) Fiscal stimulus increased debt to 250% of GDP but limited growth impact. Lesson: Demographic decline and deflation are hard to overcome",
              "REAL EXAMPLE - Asian Tigers (1960-1990): South Korea, Taiwan, Hong Kong, Singapore achieved rapid growth (8-10% per year). Common factors: (1) Export-oriented industrialization, (2) High savings and investment rates (30-40% of GDP), (3) Investment in education - universal primary and secondary education, (4) Stable macroeconomic policies - low inflation, balanced budgets, (5) Openness to trade and FDI, (6) Strong work ethic and social cohesion. Result: Transformed from low-income to high-income economies in one generation. South Korea GDP per capita: $1,200 (1960) → $32,000 (2020)",
              "REAL EXAMPLE - Botswana's Success (1966-2020): Africa's fastest-growing economy, GDP per capita rose from $400 (1966) to $7,600 (2020). Key factors: (1) Diamond wealth - managed prudently, revenues invested in infrastructure and education, (2) Good governance - low corruption, stable democracy, rule of law, (3) Prudent fiscal policy - budget surpluses, sovereign wealth fund, (4) Investment in education and healthcare. Lesson: Natural resources can fuel growth if well-managed with strong institutions"
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
            videos: [
              { title: "Y1 38) Supply Side Policies (Interventionist & Market Based)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=PvfdPfEd-gk" },
              { title: "A Level Economics - Supply Side Policies", channel: "tutor2u", url: "https://www.youtube.com/watch?v=AkERi6pbbWo" },
              { title: "Edexcel A level Economics 2.6.3 Supply side policies", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=YmH4rlTNguM" },
              { title: "Supply-Side Policies and Their Impact", channel: "tutor2u", url: "https://www.youtube.com/watch?v=lYKAMu3F9YE" }
            ]
          },
          {
            id: "e2c6", num: 6,
            title: { zh: "宏观经济政策", en: "Macroeconomic Policy" },
            overview: { zh: "学习宏观经济政策的目标与工具。", en: "Learn about macroeconomic policy objectives and instruments, with detailed analysis of fiscal, monetary, and supply-side policies." },
            keyPoints: [
              "MACROECONOMIC OBJECTIVES - The Four Main Goals: (1) Sustainable economic growth (2-3% annually), (2) Low and stable inflation (2% target), (3) Low unemployment (near natural rate), (4) Balance of payments equilibrium",
              "MACROECONOMIC OBJECTIVES - Trade-offs: Policies often conflict. Phillips Curve shows inverse relationship between unemployment and inflation. Growth may worsen current account. Must prioritize objectives",
              "FISCAL POLICY - Definition: Government decisions about spending (G) and taxation (T) to influence aggregate demand and achieve macroeconomic objectives",
              "FISCAL POLICY - Expansionary (Loose): Increase G or decrease T → AD shifts right → Higher output and employment. Used during recession. Example: 2008 stimulus packages",
              "FISCAL POLICY - Contractionary (Tight): Decrease G or increase T → AD shifts left → Lower inflation. Used when economy overheating. Example: Austerity measures",
              "FISCAL POLICY - Budget Positions: (1) Budget surplus (T > G): Government saves, reduces national debt, (2) Budget deficit (G > T): Government borrows, increases debt, (3) Balanced budget (T = G): Neutral stance",
              "FISCAL POLICY - Automatic Stabilizers: Built-in mechanisms that automatically reduce economic fluctuations without policy changes",
              "FISCAL POLICY - Automatic Stabilizer 1: Progressive income tax. Recession → Incomes fall → Tax revenue falls automatically → Disposable income cushioned. Boom → Incomes rise → Tax revenue rises → Dampens spending",
              "FISCAL POLICY - Automatic Stabilizer 2: Unemployment benefits. Recession → Unemployment rises → Benefit payments rise automatically → Supports consumption. Boom → Unemployment falls → Payments fall",
              "FISCAL POLICY - Advantages: (1) Direct impact on AD, (2) Can target specific sectors, (3) Automatic stabilizers work immediately, (4) Multiplier effect amplifies impact",
              "FISCAL POLICY - Disadvantages: (1) Time lags (recognition, decision, implementation), (2) Political constraints (unpopular tax rises), (3) Crowding out (government borrowing raises interest rates, reduces private investment), (4) Budget deficit increases national debt",
              "FISCAL POLICY - Real Example: UK Austerity (2010-2016): Government cut spending by £30 billion to reduce deficit from 10% to 3% of GDP. Result: Slow growth (1.5% average), public service cuts, poverty increased. Debate: Was it necessary or did it prolong recession?",
              "FISCAL POLICY - Real Example: US CARES Act (2020): $2.2 trillion stimulus during COVID-19. Direct payments ($1,200 per adult), unemployment benefits (+$600/week), business loans. Result: GDP recovered quickly, but inflation rose to 9% (2022)",
              "MONETARY POLICY - Definition: Central bank control of money supply and interest rates to influence aggregate demand and achieve price stability",
              "MONETARY POLICY - Expansionary (Loose): Lower interest rates or increase money supply → Cheaper borrowing → Investment and consumption increase → AD shifts right. Used during recession",
              "MONETARY POLICY - Contractionary (Tight): Raise interest rates or decrease money supply → Expensive borrowing → Investment and consumption decrease → AD shifts left. Used to control inflation",
              "MONETARY POLICY - Transmission Mechanism: Interest rate change → (1) Cost of borrowing changes → Investment and consumption change, (2) Exchange rate changes → Net exports change, (3) Asset prices change → Wealth effect on consumption, (4) Expectations change → Spending decisions change",
              "MONETARY POLICY - Interest Rate Effects: Lower rates → (1) Cheaper mortgages → More housing demand, (2) Cheaper business loans → More investment, (3) Lower savings returns → More consumption, (4) Currency depreciates → Exports increase",
              "MONETARY POLICY - Quantitative Easing (QE): Central bank creates money electronically to buy government bonds and other assets. Increases money supply, lowers long-term interest rates, boosts asset prices",
              "MONETARY POLICY - QE Example: Bank of England (2009-2021): Purchased £895 billion of assets during financial crisis and COVID-19. Result: Prevented deflation, supported recovery, but increased inequality (asset owners benefited most)",
              "MONETARY POLICY - Advantages: (1) Quick to implement (central bank decides), (2) Flexible (can adjust rates frequently), (3) Independent from politics, (4) Affects whole economy",
              "MONETARY POLICY - Disadvantages: (1) Time lags (6-18 months for full effect), (2) Liquidity trap (rates can't go below zero, or negative rates ineffective), (3) Depends on consumer/business confidence, (4) May cause asset bubbles (low rates → speculation)",
              "MONETARY POLICY - Real Example: US Federal Reserve (2008-2015): Cut rates from 5.25% to 0.25% during financial crisis. Implemented QE ($4.5 trillion asset purchases). Result: Prevented depression, but slow recovery, inequality increased",
              "MONETARY POLICY - Real Example: Japan Negative Interest Rates (2016-present): Bank of Japan set rate at -0.1% to fight deflation. Result: Limited success, banks reluctant to pass negative rates to depositors, yen weakened",
              "SUPPLY-SIDE POLICIES - Definition: Policies to increase aggregate supply (LRAS) by improving productivity and efficiency, shifting LRAS curve right",
              "SUPPLY-SIDE POLICIES - Market-Based Approach: Reduce government intervention, let markets work efficiently",
              "SUPPLY-SIDE POLICY 1 - Tax Cuts: Lower income tax → Incentive to work harder. Lower corporation tax → Incentive to invest. Example: US Tax Cuts and Jobs Act (2017) cut corporate tax from 35% to 21%",
              "SUPPLY-SIDE POLICY 2 - Deregulation: Remove unnecessary regulations → Lower business costs → More competition. Example: UK airline deregulation (1980s) → Budget airlines emerged, prices fell 40%",
              "SUPPLY-SIDE POLICY 3 - Privatization: Sell state-owned enterprises to private sector → Profit motive → Greater efficiency. Example: British Telecom privatization (1984) → Service improved, prices fell",
              "SUPPLY-SIDE POLICY 4 - Flexible Labour Markets: Reduce minimum wage, weaken unions, easier hiring/firing → Lower unemployment. Example: Germany Hartz reforms (2003-2005) → Unemployment fell from 11% to 5%",
              "SUPPLY-SIDE POLICIES - Interventionist Approach: Government actively improves supply-side through investment",
              "SUPPLY-SIDE POLICY 5 - Education and Training: Improve human capital → Higher productivity. Example: South Korea invested 5% of GDP in education (1960s-1990s) → Became developed economy",
              "SUPPLY-SIDE POLICY 6 - Infrastructure Investment: Build roads, railways, broadband → Lower transport costs → Productivity increases. Example: China high-speed rail (2008-present) → 40,000km network, economic integration",
              "SUPPLY-SIDE POLICY 7 - R&D Subsidies: Support innovation and technology → New products and processes. Example: US government funded internet, GPS, touchscreens → Tech boom",
              "SUPPLY-SIDE POLICY 8 - Industrial Policy: Support strategic industries → Competitive advantage. Example: South Korea supported Samsung, Hyundai → Global leaders",
              "SUPPLY-SIDE POLICIES - Advantages: (1) Increases potential output (no inflation), (2) Improves competitiveness, (3) Sustainable long-term growth, (4) Can reduce unemployment and inflation simultaneously",
              "SUPPLY-SIDE POLICIES - Disadvantages: (1) Long time lags (years to see results), (2) Expensive (education, infrastructure), (3) Uncertain outcomes (may not work), (4) Equity concerns (tax cuts benefit rich, deregulation may harm workers)",
              "POLICY CONFLICTS - Phillips Curve Trade-off: Short-run inverse relationship between unemployment and inflation. Lower unemployment → Higher inflation (demand-pull). Lower inflation → Higher unemployment (reduced AD)",
              "POLICY CONFLICTS - Growth vs Inflation: Rapid growth → Demand-pull inflation. To control inflation, must slow growth (raise interest rates). Example: UK 1980s boom → 10% inflation → Recession to control it",
              "POLICY CONFLICTS - Growth vs Current Account: Rapid growth → Higher imports (marginal propensity to import) → Current account deficit worsens. Example: UK chronic current account deficit due to high import demand",
              "POLICY CONFLICTS - Unemployment vs Current Account: Reducing unemployment (expansionary policy) → Higher imports → Worse current account. Improving current account (contractionary policy) → Higher unemployment",
              "POLICY MIX - Combining Policies: Use fiscal, monetary, and supply-side policies together for better outcomes. Example: Expansionary fiscal + Tight monetary = Growth without inflation",
              "POLICY EVALUATION - Time Lags: (1) Recognition lag (identify problem), (2) Decision lag (agree on policy), (3) Implementation lag (put policy in place), (4) Impact lag (policy takes effect). Total: 6-24 months",
              "POLICY EVALUATION - Effectiveness Factors: (1) Size of multiplier (higher MPC = more effective fiscal policy), (2) Consumer confidence (low confidence = monetary policy less effective), (3) Spare capacity (supply-side policies need time), (4) Global conditions (recession abroad limits export growth)",
              "REAL-WORLD CASE - UK COVID-19 Response (2020-2021): Combined policy approach. Fiscal: Furlough scheme (£70bn), business grants. Monetary: Interest rates cut to 0.1%, QE £450bn. Result: GDP fell 11% (2020) but recovered to pre-pandemic level by 2022. Inflation rose to 11% (2022) - policy too loose?"
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
            videos: [
              { title: "Balance of Payments (Current, Financial and Capital Account)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=bel_y5ka80M" },
              { title: "Current Account of the Balance of Payments", channel: "tutor2u", url: "https://www.youtube.com/watch?v=mvq6Fjzdjd8" },
              { title: "Balance of Payments (BOP) Accounts- Macro 6.1", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=W0YwGLz50TA" },
              { title: "A Level Economics - The Balance Of Payments", channel: "tutor2u", url: "https://www.youtube.com/watch?v=1SiX1OlUomM" },
              { title: "Balance of Payments Accounts | A Level Economics", channel: "tutor2u", url: "https://www.youtube.com/watch?v=KjqjEYJFefg" }
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
            videos: [
              { title: "Theme 3.2 – Business Growth | Edexcel A-Level Business/Econ", channel: "BizCons", url: "https://www.youtube.com/watch?v=_CRxKBi8m1o" },
              { title: "Y2 9) Objectives of Firms - Profit Max, Rev Max, Sales Max", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=AZr_038EMsU" },
              { title: "Business Growth: Organic Growth - A Level and IB Economics", channel: "Economics Help", url: "https://www.youtube.com/watch?v=0iWV98mJNBk" },
              { title: "3.2 Business Growth in 9 minutes! (Edexcel Recap)", channel: "BizCons", url: "https://www.youtube.com/watch?v=um-y90oEC3Y" }
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
            videos: [
              { title: "What Are the FOUR Market Structures in Economics?", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=u1xIZOieOUw" },
              { title: "Y2 23) Monopolistic Competition (垄断竞争详解)", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=DHgSBazfTEk" },
              { title: "Business Growth and Competitive Advantage", channel: "Pearson Edexcel", url: "https://www.youtube.com/watch?v=-r1WTAw9QMQ" }
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
            videos: [
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
            videos: [
              { title: "Demand for Labour - Marginal Revenue Product (MRP)", channel: "tutor2u", url: "https://www.youtube.com/watch?v=uNSvpfBrVDo" },
              { title: "Labor Markets and Minimum Wage: Crash Course Economics", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=mWwXmH-n5Bo" },
              { title: "Monopsony - Labour Market Impact", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=Apng99ArphY" },
              { title: "Y1 21) Types and Causes of Unemployment in Labour Market", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=DWLv6JHa7YE" },
              { title: "Introduction to labor markets | Microeconomics", channel: "Economics with Hello", url: "https://www.youtube.com/watch?v=Cm69zTuUzMI" }
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
            videos: [
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
            overview: { zh: "学习全球化的原因、表现及其影响。", en: "Learn about the causes, manifestations and impacts of globalisation, with detailed case study of China's WTO accession." },
            keyPoints: [
              "Globalisation: Increasing interconnectedness and integration of world economies through trade, investment, technology, and cultural exchange",
              "Causes of globalisation - Technology: Improvements in transport (containerization, air freight), communication (internet, mobile phones), information technology (e-commerce, digital platforms)",
              "Causes of globalisation - Trade Liberalisation: Reduction in tariffs and trade barriers through WTO, regional trade agreements (EU, NAFTA, ASEAN), removal of capital controls",
              "Causes of globalisation - Capital Mobility: Free movement of finance across borders, growth of multinational corporations (MNCs), foreign direct investment (FDI)",
              "Causes of globalisation - Political Changes: Collapse of communism (1989-1991), market-oriented reforms in China and India, deregulation and privatization",
              "Global value chains (GVCs): Production process fragmented and spread across multiple countries. Example: iPhone designed in USA, components from Japan/Korea/Taiwan, assembled in China, sold globally",
              "Multinational corporations (MNCs): Firms operating in multiple countries through subsidiaries, branches, or joint ventures. Examples: Apple, Toyota, Unilever, McDonald's",
              "REAL-WORLD CASE STUDY - China's WTO Accession (2001): After 15 years of negotiations, China joined World Trade Organization on December 11, 2001, marking a watershed moment in globalisation",
              "CHINA WTO - Background: China began market reforms in 1978 under Deng Xiaoping, but remained outside global trading system. Applied to join GATT/WTO in 1986",
              "CHINA WTO - Commitments: Reduce average tariff from 15.3% to 9.8%, open services sector (banking, insurance, telecoms), eliminate export subsidies, strengthen intellectual property protection, allow foreign investment in more sectors",
              "CHINA WTO - Impact on Trade: China's exports exploded from $266 billion (2001) to $3.36 trillion (2022), becoming world's largest exporter. Share of global exports rose from 4% to 15%",
              "CHINA WTO - Impact on FDI: Foreign direct investment surged from $47 billion (2001) to $189 billion (2022). MNCs established manufacturing bases in China to access cheap labor and huge market",
              "CHINA WTO - Impact on Employment: Manufacturing employment increased by 50 million jobs (2001-2010). Hundreds of millions lifted out of poverty. Rural-urban migration accelerated",
              "CHINA WTO - Impact on Global Economy: Lower prices for consumers worldwide (clothing, electronics, toys). Global inflation reduced by 2-3% due to cheap Chinese goods. Supply chains restructured around China",
              "CHINA WTO - Winners in Developed Countries: Consumers (lower prices, more choice), MNCs (access to Chinese market and cheap production), importers and retailers (Walmart, Amazon)",
              "CHINA WTO - Losers in Developed Countries: Manufacturing workers (job losses, wage stagnation), industrial regions (Rust Belt in USA, Northern England), traditional industries (textiles, steel)",
              "CHINA WTO - Trade Tensions: US-China trade deficit grew from $83 billion (2001) to $382 billion (2022). Accusations of unfair practices (currency manipulation, IP theft, state subsidies). Led to Trump tariffs (2018-2019)",
              "CHINA WTO - Environmental Impact: China became world's largest CO2 emitter (2006), producing 30% of global emissions. Severe air and water pollution. But also became leader in renewable energy",
              "CHINA WTO - Lessons: (1) Trade integration can drive rapid economic growth, (2) Globalisation creates winners and losers within countries, (3) Need for adjustment policies to help displaced workers, (4) Trade tensions arise when benefits are unequally distributed",
              "Benefits of globalisation - Economic Growth: Access to larger markets, economies of scale, increased competition drives efficiency, technology and knowledge transfer",
              "Benefits of globalisation - Consumers: Lower prices due to competition and cheaper production, greater variety and choice, access to foreign goods and services",
              "Benefits of globalisation - Developing Countries: Employment opportunities in export industries, FDI brings capital and technology, integration into global value chains, poverty reduction",
              "Benefits of globalisation - Innovation: Competition drives innovation, knowledge spillovers across borders, R&D collaboration, faster diffusion of new technologies",
              "Costs of globalisation - Inequality: Between countries (some benefit more than others), within countries (skilled workers gain, unskilled lose), wealth concentration in MNCs",
              "Costs of globalisation - Job Losses: Deindustrialization in developed countries, structural unemployment, wage stagnation for low-skilled workers, decline of manufacturing communities",
              "Costs of globalisation - Cultural: Homogenisation (spread of Western culture), loss of local traditions and languages, dominance of global brands, erosion of cultural diversity",
              "Costs of globalisation - Environmental: Increased carbon emissions from transport, pollution from manufacturing, resource depletion, race to the bottom (countries lower environmental standards to attract investment)",
              "Costs of globalisation - Economic Instability: Financial contagion (2008 crisis spread globally), vulnerability to external shocks, loss of policy autonomy, dependence on global supply chains (COVID-19 disruptions)",
              "Anti-globalisation movement: Protests against WTO, IMF, World Bank (Seattle 1999, Genoa 2001). Concerns about corporate power, inequality, environmental damage, loss of sovereignty",
              "Fair trade movement: Ensures better prices, working conditions, and terms of trade for producers in developing countries. Certification schemes (Fairtrade, Rainforest Alliance). Focus on coffee, cocoa, bananas",
              "Measuring globalisation: Trade openness = (Exports + Imports) / GDP × 100%. FDI flows as % of GDP. Number of MNCs. Internet connectivity. Migration flows"
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
            videos: [
              { title: "Globalisation", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=8lM7Y2hT5Kp" },
              { title: "Multinational Corporations", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5lM7Y2hT3Kp" }
            ]
          },
          {
            id: "e4c2", num: 2,
            title: { zh: "国际贸易", en: "International Trade" },
            overview: { zh: "学习国际贸易理论与政策。", en: "Comprehensive study of international trade theory, policy instruments, and real-world trade disputes, including graphical analysis and case studies." },
            keyPoints: [
              "Absolute advantage: Ability to produce more output with the same inputs, or produce same output with fewer inputs. Country has absolute advantage if it is more productive. Example: If UK produces 10 cars/hour and France produces 6 cars/hour, UK has absolute advantage in cars",
              "Comparative advantage: Lower opportunity cost of production, basis for mutually beneficial trade. Even if one country has absolute advantage in all goods, both can gain from trade by specializing in goods with lowest opportunity cost. Discovered by David Ricardo (1817)",

              "COMPARATIVE ADVANTAGE - Calculation Method: (1) Calculate opportunity cost for each good in each country, (2) Country with lower opportunity cost has comparative advantage in that good, (3) Each country should specialize in good where it has comparative advantage, (4) Trade at any exchange rate between the two opportunity costs",
              "COMPARATIVE ADVANTAGE - Numerical Example: Country A: 1 wheat costs 2 cloth (opportunity cost). Country B: 1 wheat costs 0.5 cloth. Country B has comparative advantage in wheat (lower opportunity cost 0.5 < 2). Country A has comparative advantage in cloth. Both gain by specializing and trading",
              "COMPARATIVE ADVANTAGE - Assumptions: (1) Two countries, two goods, (2) Constant opportunity costs (straight-line PPF), (3) No transport costs, (4) Perfect factor mobility within countries, (5) No barriers to trade. In reality, these assumptions don't fully hold but principle still applies",

              "Gains from trade: Both countries can consume beyond their PPF through specialization and trade. Total world output increases. Consumers benefit from lower prices and greater variety. Example: If UK specializes in services and imports manufactured goods, UK consumers access cheaper goods than if produced domestically",
              "Terms of trade (ToT): Ratio of export prices to import prices, formula: ToT = (Index of export prices / Index of import prices) × 100. Improvement in ToT means exports buy more imports. Example: If oil prices rise and a country exports oil, its ToT improves",
              "Factors affecting terms of trade: (1) Changes in global demand/supply for exports/imports, (2) Exchange rate changes, (3) Inflation differentials, (4) Productivity changes, (5) Trade policies",

              "GRAPHICAL ANALYSIS - Tariff Effects: Supply-demand diagram shows: (1) World price below domestic equilibrium, (2) Tariff shifts world supply up by tariff amount, (3) Domestic price rises, (4) Quantity demanded falls, quantity supplied domestically rises, (5) Imports fall (gap between Qd and Qs narrows), (6) Consumer surplus falls (area under demand curve), (7) Producer surplus rises (area above supply curve), (8) Government revenue = tariff × quantity imported (rectangle), (9) Deadweight loss = two triangles (production inefficiency + consumption loss)",
              "GRAPHICAL ANALYSIS - Quota Effects: Similar to tariff but: (1) No government revenue (quota rent goes to importers or foreign exporters), (2) Fixed quantity limit regardless of demand changes, (3) Creates artificial scarcity, (4) Import licenses become valuable and may lead to corruption",

              "Trade protectionism: Government policies restricting imports to protect domestic industries. Methods include tariffs, quotas, subsidies, regulations, voluntary export restraints (VERs)",
              "Tariffs: Taxes on imported goods. Effects: (1) Raises domestic price, (2) Reduces quantity imported, (3) Increases domestic production, (4) Reduces consumer surplus, (5) Increases producer surplus, (6) Creates government revenue, (7) Creates deadweight loss. Example: US steel tariffs (2018) - 25% tariff raised prices, helped US steel producers but hurt car manufacturers",
              "Quotas: Quantity limits on imports. Effects: (1) Creates scarcity and higher prices, (2) Import licenses become valuable, (3) No government revenue (unless licenses auctioned), (4) More restrictive than tariffs if demand grows, (5) Prone to corruption. Example: EU sugar quotas protected inefficient European producers for decades",
              "Subsidies: Government payments to domestic producers, lowers their costs and allows them to compete with imports. Effects: (1) Increases domestic production, (2) May lead to overproduction and waste, (3) Costs government budget, (4) Can trigger WTO disputes. Example: EU Common Agricultural Policy (CAP) - €55bn/year subsidies led to butter mountains and wine lakes",
              "Non-tariff barriers: (1) Regulations and standards (safety, environmental, health), (2) Administrative barriers (customs delays, paperwork), (3) Government procurement preferences (buy domestic), (4) Voluntary export restraints (VERs). Often more restrictive than tariffs and harder to measure",

              "Arguments for protection - Infant industry: New industries need temporary protection to develop economies of scale and compete internationally. Once mature, protection removed. Criticism: Industries may never become competitive, protection becomes permanent. Example: South Korea protected car industry (1960s-1980s), now globally competitive (Hyundai, Kia)",
              "Arguments for protection - National security: Strategic industries (defense, food, energy) should not depend on imports. Criticism: Difficult to define 'strategic', can be abused. Example: US protects steel industry citing national security",
              "Arguments for protection - Anti-dumping: Prevent foreign firms selling below cost to drive out domestic competitors. WTO allows anti-dumping duties if dumping proven. Criticism: Hard to prove, often used as disguised protectionism. Example: EU anti-dumping duties on Chinese solar panels (2013)",
              "Arguments for protection - Protection of domestic jobs: Save jobs in import-competing industries. Criticism: Costs jobs in export industries and raises prices for consumers. Example: US tire tariffs (2009) saved 1,200 jobs but cost consumers $1.1bn ($900,000 per job saved)",
              "Arguments for protection - Prevent unfair competition: Counter low wages, poor working conditions, lax environmental standards abroad. Criticism: Developing countries argue this denies them their comparative advantage",
              "Arguments for protection - Raise government revenue: Tariffs provide revenue, especially in developing countries with weak tax systems. Criticism: Inefficient way to raise revenue, distorts trade",

              "Arguments against protection - Higher prices for consumers: Protection raises domestic prices, reduces consumer surplus, regressive effect (hurts poor more). Example: EU sugar quotas raised prices 300% above world level",
              "Arguments against protection - Reduced competition: Domestic firms become complacent without foreign competition, less innovation, lower quality. Example: British car industry declined behind tariff walls (1960s-1970s)",
              "Arguments against protection - Retaliation: Trading partners impose retaliatory tariffs, trade war escalates, everyone loses. Example: US-China trade war (2018-2020) - tit-for-tat tariffs hurt both economies",
              "Arguments against protection - Inefficient resource allocation: Resources trapped in uncompetitive industries instead of moving to efficient sectors. Opportunity cost of protection",
              "Arguments against protection - Deadweight loss: Protection creates economic inefficiency (production and consumption losses) with no offsetting gain",

              "World Trade Organization (WTO): Established 1995, 164 members (2023). Functions: (1) Administers trade agreements, (2) Forum for trade negotiations, (3) Settles trade disputes, (4) Monitors trade policies, (5) Provides technical assistance to developing countries. Principles: Non-discrimination (MFN, national treatment), reciprocity, transparency",
              "WTO dispute settlement: Countries can challenge trade barriers. Panel of experts investigates, makes ruling. If violation found, country must remove barrier or face authorized retaliation. Example: US-EU banana dispute (1990s), Boeing-Airbus subsidies dispute (2004-2020)",
              "Trade agreements - Multilateral: WTO agreements apply to all members. Most-favored-nation (MFN) principle - tariff cuts extended to all. Doha Round (2001-) stalled over agriculture",
              "Trade agreements - Regional: Free trade areas (NAFTA/USMCA, ASEAN), customs unions (EU), common markets. Deeper integration than WTO. Criticism: Trade diversion (inefficient partner replaces efficient non-member)",
              "Trade agreements - Bilateral: Between two countries. Faster to negotiate than multilateral. Example: UK-Australia FTA (2021), US-South Korea FTA (2012)",

              "REAL EXAMPLE - US-China Trade War (2018-2020): Largest trade war in history. Timeline: (1) March 2018 - US imposes 25% tariff on steel, 10% on aluminum, (2) July 2018 - US tariffs on $34bn Chinese goods, China retaliates, (3) September 2018 - US tariffs on $200bn more goods, (4) May 2019 - US raises tariffs to 25%, China retaliates, (5) January 2020 - Phase One deal, partial de-escalation. Impact: (1) US imports from China fell 16% (2019), (2) US exports to China fell 11%, (3) US consumers paid $46bn more due to tariffs, (4) US manufacturing employment unchanged (tariffs didn't bring jobs back), (5) Trade diverted to Vietnam, Mexico. Lesson: Trade wars have no winners",
              "REAL EXAMPLE - Brexit Trade Impact (2016-2023): UK left EU single market and customs union (January 2021). Effects: (1) UK-EU trade fell 25% (2021), (2) New customs checks caused delays and costs, (3) Services trade barriers (financial services lost passporting rights), (4) Northern Ireland Protocol created internal UK border, (5) UK signed new trade deals (Australia, Japan) but smaller than EU market. UK-EU Trade and Cooperation Agreement (TCA) avoided tariffs but created non-tariff barriers. Lesson: Leaving trade bloc has significant costs even with FTA",
              "REAL EXAMPLE - WTO Banana Dispute (1993-2012): EU gave preferential access to bananas from former colonies (Africa, Caribbean), discriminating against Latin American producers (Chiquita, Dole). US challenged on behalf of companies. WTO ruled against EU multiple times. EU finally reformed system (2012). Lesson: WTO can enforce rules even against powerful blocs, but takes many years",
              "REAL EXAMPLE - Japan's Rice Protection: Japan protects rice farmers with 778% tariff (world's highest). Rice prices 5x world level. Costs consumers $6bn/year. Reason: Cultural importance, rural votes, food security. Criticism: Inefficient, regressive (hurts poor), prevents developing countries from exporting. Lesson: Political factors often override economic logic in trade policy"
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
            videos: [
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
            videos: [
              { title: "Balance of Payments", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5nM8Y2hT4Lr" },
              { title: "Current Account", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=3mN8Y2hT3Kq" },
              { title: "Trade Deficits", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=4nL8Y2hT4Lr" }
            ]
          },
          {
            id: "e4c4", num: 4,
            title: { zh: "汇率", en: "Exchange Rates" },
            overview: { zh: "学习汇率制度与汇率决定因素。", en: "Comprehensive study of exchange rate systems, determinants, and effects, including graphical analysis and major currency crises." },
            keyPoints: [
              "Exchange rate: Price of one currency in terms of another, expressed as units of domestic currency per unit of foreign currency. Example: £1 = $1.30 means 1 pound buys 1.30 dollars",
              "Appreciation: Currency becomes more valuable (fewer units needed to buy foreign currency). Example: £1 = $1.30 → $1.40 means pound appreciated (stronger)",
              "Depreciation: Currency becomes less valuable (more units needed to buy foreign currency). Example: £1 = $1.30 → $1.20 means pound depreciated (weaker)",
              "Revaluation: Government increases fixed exchange rate value. Devaluation: Government decreases fixed exchange rate value",

              "GRAPHICAL ANALYSIS - Foreign Exchange Market: Supply and demand diagram with exchange rate on vertical axis, quantity of currency on horizontal axis. Demand for pounds comes from: (1) Foreign buyers of UK exports, (2) Foreign investors buying UK assets, (3) Speculators expecting pound to rise. Supply of pounds comes from: (1) UK buyers of imports, (2) UK investors buying foreign assets, (3) Speculators expecting pound to fall. Equilibrium where demand = supply determines exchange rate",
              "GRAPHICAL ANALYSIS - Appreciation: Demand curve shifts right (or supply shifts left) → exchange rate rises. Example: If UK interest rates rise → foreign investors demand more pounds to buy UK bonds → demand curve shifts right → pound appreciates",
              "GRAPHICAL ANALYSIS - Depreciation: Supply curve shifts right (or demand shifts left) → exchange rate falls. Example: If UK imports rise → more pounds supplied to buy foreign currency → supply curve shifts right → pound depreciates",

              "FLOATING EXCHANGE RATE SYSTEM - Definition: Exchange rate determined by market forces (supply and demand) without government intervention. Also called 'free float' or 'clean float'. Examples: US dollar, British pound, Japanese yen, Euro (all float against each other)",
              "FLOATING EXCHANGE RATE - Advantages: (1) Automatic adjustment - trade imbalances self-correct (deficit → depreciation → exports cheaper → deficit reduces), (2) Monetary policy independence - central bank can set interest rates for domestic objectives without worrying about exchange rate, (3) No need for foreign exchange reserves, (4) No speculative attacks on currency peg",
              "FLOATING EXCHANGE RATE - Disadvantages: (1) Uncertainty - volatile exchange rates make trade and investment risky, (2) Inflation risk - depreciation raises import prices, (3) Speculation - can cause excessive volatility, (4) May not self-correct if Marshall-Lerner condition not met",

              "FIXED EXCHANGE RATE SYSTEM - Definition: Exchange rate pegged to another currency (usually US dollar) or basket of currencies. Central bank intervenes to maintain peg by buying/selling foreign currency. Examples: Hong Kong dollar (pegged to USD since 1983), Saudi riyal (pegged to USD), Danish krone (pegged to Euro)",
              "FIXED EXCHANGE RATE - How it works: If currency under pressure to depreciate → central bank buys domestic currency (sells foreign reserves) to increase demand and maintain peg. If currency under pressure to appreciate → central bank sells domestic currency (buys foreign reserves) to increase supply",
              "FIXED EXCHANGE RATE - Advantages: (1) Certainty - stable exchange rate encourages trade and investment, (2) Discipline - prevents government from pursuing inflationary policies, (3) Anchor for inflation - importing low inflation from anchor country",
              "FIXED EXCHANGE RATE - Disadvantages: (1) Loss of monetary policy independence - interest rates must match anchor country to maintain peg, (2) Requires large foreign exchange reserves, (3) Vulnerable to speculative attacks if peg seen as unsustainable, (4) No automatic adjustment for trade imbalances",

              "MANAGED FLOAT (DIRTY FLOAT) - Definition: Mostly floating but central bank intervenes occasionally to smooth excessive volatility or achieve policy objectives. Most common system in practice. Examples: China (managed float since 2005), India, Singapore",
              "MANAGED FLOAT - Intervention methods: (1) Direct intervention - buying/selling currency in forex market, (2) Interest rate changes - raise rates to attract capital inflows and appreciate currency, (3) Capital controls - restrict currency flows, (4) Verbal intervention - central bank statements to influence expectations",

              "Factors affecting exchange rates - Interest rates: Higher interest rates attract foreign capital (hot money flows) seeking higher returns → increased demand for currency → appreciation. Example: If Bank of England raises rates from 0.5% to 5% while Fed keeps rates at 2%, investors buy pounds to earn higher returns → pound appreciates",
              "Factors affecting exchange rates - Inflation rates: Higher inflation reduces competitiveness → exports fall, imports rise → currency depreciates. Purchasing Power Parity (PPP) theory: exchange rates adjust to equalize prices across countries. Example: If UK inflation 10%, US inflation 2%, pound should depreciate 8% to maintain PPP",
              "Factors affecting exchange rates - Current account balance: Trade deficit (imports > exports) → more currency supplied than demanded → depreciation. Trade surplus → appreciation. Example: Germany's persistent trade surplus → Euro pressure to appreciate",
              "Factors affecting exchange rates - Economic performance: Strong growth attracts investment → currency appreciates. Recession → capital outflows → depreciation. Example: US tech boom (1990s) → dollar appreciated as investors bought US stocks",
              "Factors affecting exchange rates - Speculation: If speculators expect currency to rise → buy now → self-fulfilling prophecy (demand increases → currency rises). Herd behavior can cause overshooting. Example: George Soros bet against pound (1992) → other speculators followed → forced UK out of ERM",
              "Factors affecting exchange rates - Government intervention: Central bank buying currency → appreciation. Selling currency → depreciation. Effectiveness depends on reserves and credibility",
              "Factors affecting exchange rates - Political stability: Political uncertainty → capital flight → depreciation. Example: Brexit referendum (2016) → pound fell 10% overnight due to uncertainty",

              "Effects of appreciation - On trade: Imports cheaper (SPICED: Strong Pound Imports Cheaper Exports Dearer) → import volume rises. Exports more expensive → export volume falls. Current account worsens (assuming Marshall-Lerner condition holds)",
              "Effects of appreciation - On inflation: Import prices fall → lower cost-push inflation. Reduced AD → lower demand-pull inflation. Good for controlling inflation. Example: Strong dollar (2014-2016) helped keep US inflation low",
              "Effects of appreciation - On growth: Exports fall → AD falls → GDP growth slows. Import-competing industries suffer. But cheaper imports increase real incomes and consumption. Net effect depends on trade elasticities",
              "Effects of appreciation - On employment: Export industries and import-competing industries lose jobs. But consumers benefit from cheaper imports. Manufacturing typically hurt more than services",

              "Effects of depreciation - On trade: Exports cheaper → export volume rises. Imports more expensive → import volume falls. Current account improves (but J-curve effect means short-run worsening before improvement)",
              "Effects of depreciation - On inflation: Import prices rise → cost-push inflation. If economy near full capacity, increased AD → demand-pull inflation. Bad for inflation control. Example: UK post-Brexit depreciation (2016) → inflation rose from 0.5% to 3%",
              "Effects of depreciation - On growth: Exports rise → AD rises → GDP growth increases. Expenditure-switching effect (consumers buy domestic instead of expensive imports). Good for growth if spare capacity exists",
              "Effects of depreciation - On employment: Export industries and import-competing industries gain jobs. Manufacturing benefits. But real wages fall due to higher import prices",

              "J-CURVE EFFECT - Definition: Currency depreciation initially worsens trade balance before improving. Short-run: Existing contracts already agreed at old prices, quantities don't adjust immediately, but import prices rise → trade balance worsens. Long-run: Quantities adjust (exports rise, imports fall) → trade balance improves. Time lag typically 6-18 months",
              "J-CURVE EFFECT - Marshall-Lerner Condition: For depreciation to improve trade balance in long run, sum of price elasticities of demand for exports and imports must exceed 1. If demand inelastic, depreciation worsens trade balance even in long run. Example: Oil-importing countries - oil demand inelastic, so depreciation worsens trade balance",

              "REAL EXAMPLE - 1997 Asian Financial Crisis: Currency crisis that devastated East Asian economies. Timeline: (1) Thai baht under speculative attack (July 1997) → Thailand abandoned peg → baht collapsed 50%, (2) Contagion spread to Indonesia, South Korea, Malaysia, Philippines, (3) Indonesian rupiah fell 80%, Korean won fell 50%, (4) Capital flight - foreign investors withdrew $100bn, (5) IMF bailouts ($110bn) with harsh conditions (austerity, high interest rates). Causes: (1) Fixed exchange rates overvalued, (2) Large current account deficits, (3) Short-term foreign debt, (4) Weak banking systems, (5) Crony capitalism. Impact: GDP fell 10-15%, unemployment tripled, poverty doubled. Lesson: Fixed pegs vulnerable to speculative attacks if fundamentals weak",
              "REAL EXAMPLE - 2015 Swiss Franc Shock: Swiss National Bank (SNB) abandoned Euro peg without warning (January 15, 2015). Background: SNB had pegged franc at 1.20 per Euro (2011) to prevent excessive appreciation hurting exports. Maintained peg by buying Euros (reserves grew to 500bn francs). Result: Franc appreciated 30% in minutes (1.20 → 0.85 per Euro). Impact: (1) Swiss exporters devastated, (2) Foreign currency borrowers (Polish mortgages in francs) faced huge losses, (3) Some forex brokers bankrupted. Reason for abandonment: ECB about to launch QE → SNB would need unlimited Euro purchases to maintain peg. Lesson: Even well-resourced central banks cannot maintain unsustainable pegs forever",
              "REAL EXAMPLE - Plaza Accord (1985): G5 countries (US, Japan, Germany, France, UK) agreed to depreciate US dollar. Background: Dollar overvalued (appreciated 50% in 1980-85) → huge US trade deficit. Agreement: Coordinated intervention to sell dollars. Result: Dollar fell 50% against yen and mark (1985-87). Impact on Japan: Yen appreciation hurt exports → Bank of Japan cut rates to 2.5% → asset price bubble → bubble burst (1991) → lost decades. Lesson: Exchange rate manipulation can have unintended long-term consequences",
              "REAL EXAMPLE - Black Wednesday (1992): UK forced out of European Exchange Rate Mechanism (ERM). Background: UK joined ERM (1990), pegged pound at 2.95 marks, but UK inflation higher than Germany → pound overvalued. September 16, 1992: Speculators (George Soros) bet against pound → Bank of England spent £27bn reserves defending peg, raised interest rates to 15%, but failed. UK abandoned ERM, pound fell 15%. Impact: Short-term pain but long-term gain - UK economy recovered faster than Eurozone. Lesson: Markets can overwhelm central banks if peg unsustainable"
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
            videos: [
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
            videos: [
              { title: "Poverty - Types and Causes", channel: "Economics Help", url: "https://www.youtube.com/watch?v=__pjfn1gf1g" },
              { title: "Distribution of Income and Wealth with Reasons for Inequality", channel: "tutor2u", url: "https://www.youtube.com/watch?v=cBNbU-6RhkM" },
              { title: "Lorenz Curve and Gini Coefficient - Measures of Income Inequality", channel: "tutor2u", url: "https://www.youtube.com/watch?v=ns9f2FOc26M" },
              { title: "Policies to Redistribute Income and Wealth with Evaluation", channel: "tutor2u", url: "https://www.youtube.com/watch?v=m_Jwn2H801I" },
              { title: "A-Level economics - 4.2 Poverty and Inequality", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=GUtkVnws-Co" }
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
            videos: [
              { title: "Economic Development", channel: "EconplusDal", url: "https://www.youtube.com/watch?v=5rN8Y2hT4Lm" },
              { title: "What are Emerging Economies? - A Level Economics", channel: "tutor2u", url: "https://www.youtube.com/watch?v=aRoPZFbUL_s" },
              { title: "A level Business/Economics Revision - Emerging Economies", channel: "BizCons", url: "https://www.youtube.com/watch?v=ISRf9oQW_tY" },
              { title: "Emerging Economies | A-Level & IB Business", channel: "Business (IB)", url: "https://www.youtube.com/watch?v=wFvjOrcXE5s" },
              { title: "Emerging Economies - A Level Edexcel", channel: "Mr Finn's Economics", url: "https://www.youtube.com/watch?v=ZBTbyKlt6Bw" }
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
            videos: [
              { title: "Edexcel A-Level History: Causes of the French Revolution", channel: "Edexcel", url: "https://www.youtube.com/watch?v=lTTvKwCylFY" },
              { title: "A-Level History: The Causes of the French Revolution", channel: "A-Level History", url: "https://www.youtube.com/watch?v=H3b_QwN7pX2" }
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
            videos: [
              { title: "Edexcel A-Level History: The First World War Overview", channel: "Edexcel", url: "https://www.youtube.com/watch?v=dHSQAEam2yc" },
              { title: "A-Level History: The Origins of the First World War", channel: "A-Level History", url: "https://www.youtube.com/watch?v=W8n_PvR4qZ5" }
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
            videos: [
              { title: "Edexcel A-Level History: The Russian Revolution of 1917", channel: "Edexcel", url: "https://www.youtube.com/watch?v=U2Q145uD_ys" },
              { title: "A-Level History: The Russian Revolution of 1917", channel: "A-Level History", url: "https://www.youtube.com/watch?v=R2m_RwL5mY8" }
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
            videos: [
              { title: "Edexcel A-Level History: The Weimar Republic 1918-1933", channel: "Edexcel", url: "https://www.youtube.com/watch?v=8ZzEZK4YeeQ" },
              { title: "A-Level History: The Second World War Explained", channel: "A-Level History", url: "https://www.youtube.com/watch?v=W5v_PwH8pX3" }
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
            videos: [
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
            videos: [
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
            videos: [
              { title: "Civil Rights Movement", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=6HDp1l0V3s" }
            ]
          },
          // Cold War Chapters
          {
            id: "h2c4", num: 4,
            title: { zh: "冷战的起源", en: "Origins of the Cold War" },
            overview: { zh: "学习冷战起源和东西方对抗的开始。", en: "Learn about the origins of the Cold War and the beginning of East-West confrontation." },
            keyPoints: [
              "Post-WWII power vacuum in Europe",
              "Truman Doctrine and Marshall Plan",
              "Berlin Blockade and Airlift",
              "Formation of NATO and Warsaw Pact",
              "Ideological differences: Capitalism vs Communism"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解冷战的复杂起因",
            examTips: "分析各方的动机和行动",
            videos: [
              { title: "Edexcel A-Level History: Origins of the Cold War", channel: "Edexcel", url: "https://www.youtube.com/watch?v=y9HjvHZfCUI" }
            ]
          },
          {
            id: "h2c5", num: 5,
            title: { zh: "超级大国关系 (1941-1991)", en: "Superpower Relations 1941-91" },
            overview: { zh: "学习美苏超级大国之间的关系演变。", en: "Learn about the evolution of US-Soviet superpower relations." },
            keyPoints: [
              "Cuban Missile Crisis",
              "Vietnam War and containment policy",
              "Détente period",
              "Arms race and nuclear proliferation",
              "End of Cold War: Gorbachev, fall of Berlin Wall"
            ],
            difficulty: "Advanced",
            hardPoints: "理解缓和时期与紧张时期的交替",
            examTips: "分析重大危机的影响",
            videos: [
              { title: "Edexcel A-Level History: Superpower Relations 1941-91", channel: "Edexcel", url: "https://www.youtube.com/watch?v=wVqziNV7dGY" }
            ]
          },
          {
            id: "h2c6", num: 6,
            title: { zh: "越南战争", en: "The Vietnam War Conflict" },
            overview: { zh: "学习越南战争的起因、过程和影响。", en: "Learn about the causes, process and impact of the Vietnam War." },
            keyPoints: [
              "French colonialism and Vietnam independence",
              "US involvement and escalation",
              "Vietnamization and Nixon's policy",
              "Anti-war movement in US",
              "War's impact on US politics and society"
            ],
            difficulty: "Advanced",
            hardPoints: "理解战争的国内影响",
            examTips: "分析美国政策的成败",
            videos: [
              { title: "Edexcel A-Level History: The Vietnam War Conflict", channel: "Edexcel", url: "https://www.youtube.com/watch?v=Y2IcmLkuhG0" }
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
            videos: [
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
            videos: [
              { title: "A-Level History Edexcel: Music Through the Decades", channel: "Edexcel", url: "https://www.youtube.com/watch?v=i14EzM3HocM" },
              { title: "Cultures, Subcultures, and Countercultures: Crash Course Sociology", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=RV50AV7-Iwc" }
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
            videos: [
              { title: "Decolonisation Overview", channel: "BBC", url: "https://www.youtube.com/watch?v=LYH7h9jG" },
              { title: "Wind of Change Speech", channel: "British Pathé", url: "https://www.youtube.com/watch?v=wT1X5cEe" }
            ]
          },
          // Civil Rights Chapters
          {
            id: "h3c4", num: 4,
            title: { zh: "民权运动 (1865-1977)", en: "Civil Rights Movement (1865-1977)" },
            overview: { zh: "学习美国民权运动的历史，从重建时期到20世纪60年代的高潮。", en: "Learn about the American Civil Rights Movement from Reconstruction to the 1960s高潮." },
            keyPoints: [
              "Reconstruction era (1865-77): Constitutional amendments, Jim Crow laws",
              "Plessy v. Ferguson (1896) and 'separate but equal'",
              "NAACP and legal challenges",
              "Brown v. Board of Education (1954)",
              "Montgomery Bus Boycott and Martin Luther King Jr.",
              "Civil Rights Act (1964), Voting Rights Act (1965)"
            ],
            difficulty: "Intermediate",
            hardPoints: "理解法律诉讼与街头抗议的策略",
            examTips: "分析不同阶段的目标和成就",
            videos: [
              { title: "Edexcel A Level History - Civil Rights Topic 1 revision (1865-77)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=wmXaeoo0MvA" },
              { title: "Edexcel A Level History - Civil Rights Topic 3 revision (1933-41)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=aWLL7oBRHGw" },
              { title: "Edexcel A Level History - Civil Rights Topic 5 revision (2004-09)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=R_chdbGnALg" }
            ]
          },
          {
            id: "h3c5", num: 5,
            title: { zh: "流行文化", en: "Popular Culture" },
            overview: { zh: "学习20世纪流行文化的发展和社会影响。", en: "Learn about the development and social impact of 20th century popular culture." },
            keyPoints: [
              "Jazz Age and 1920s culture",
              "Rock and roll revolution of 1950s",
              "Beatles and 1960s counterculture",
              "Hip hop and postmodern culture",
              "Globalization of popular culture"
            ],
            difficulty: "Foundation",
            hardPoints: "理解文化与社会变革的关系",
            examTips: "分析流行文化的多元影响",
            videos: [
              { title: "A-Level History Edexcel: Music Through the Decades", channel: "Edexcel", url: "https://www.youtube.com/watch?v=i14EzM3HocM" },
              { title: "Cultures, Subcultures, and Countercultures: Crash Course Sociology", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=RV50AV7-Iwc" }
            ]
          },
          {
            id: "h3c6", num: 6,
            title: { zh: "冷战", en: "The Cold War" },
            overview: { zh: "学习冷战时期的历史和超级大国之间的对抗。", en: "Learn about the Cold War period and superpower confrontation." },
            keyPoints: [
              "Origins of Cold War: Yalta, Potsdam, Iron Curtain",
              "Berlin Blockade and NATO formation",
              "Korean War, Vietnam War",
              "Cuban Missile Crisis and nuclear brinkmanship",
              "Détente and renewed tensions",
              "End of Cold War: Gorbachev, Berlin Wall, Soviet collapse"
            ],
            difficulty: "Advanced",
            hardPoints: "理解冷战的周期性特点",
            examTips: "分析重大事件的影响",
            videos: [
              { title: "The Cold War - OverSimplified (Part 1)", channel: "OverSimplified", url: "https://www.youtube.com/watch?v=I79TpDe3t2g" },
              { title: "Cold War in 9 Minutes - Manny Man Does History", channel: "Manny Man Does History", url: "https://www.youtube.com/watch?v=wVqziNV7dGY" }
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
            videos: [
              { title: "The Decolonisation of India Explained", channel: "Geography Now", url: "https://www.youtube.com/watch?v=3Mgw_QHkPVE" },
              { title: "The British Empire 1763-1914: Reasons for Invasion of Egypt", channel: "Edexcel", url: "https://www.youtube.com/watch?v=aUiPPcWJeSc" }
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
            videos: [
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
            videos: [
              { title: "German Unification", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=Q2W7dN3" },
              { title: "Nazi Germany", channel: "John Green", url: "https://www.youtube.com/watch?v=hH1g1s6" }
            ]
          },
          // Historical Controversies Chapters
          {
            id: "h4c4", num: 4,
            title: { zh: "非殖民化", en: "Decolonisation" },
            overview: { zh: "学习大英帝国非殖民化的过程和影响。", en: "Learn about the process and impact of British decolonisation." },
            keyPoints: [
              "Post-WWII pressure for independence",
              "Key independence movements: India, Kenya, Zimbabwe",
              "Suez Crisis (1956) and decline of British power",
              "Wind of Change speech and African independence",
              "Impact on Britain and former colonies"
            ],
            difficulty: "Advanced",
            hardPoints: "分析非殖民化的多重原因",
            examTips: "评估英国政策的得失",
            videos: [
              { title: "The Decolonisation of India Explained", channel: "Geography Now", url: "https://www.youtube.com/watch?v=3Mgw_QHkPVE" },
              { title: "The British Empire 1763-1914: Reasons for Invasion of Egypt", channel: "Edexcel", url: "https://www.youtube.com/watch?v=aUiPPcWJeSc" }
            ]
          },
          {
            id: "h4c5", num: 5,
            title: { zh: "殖民地印度", en: "Colonial India" },
            overview: { zh: "学习英国殖民统治下的印度历史。", en: "Learn about the history of India under British colonial rule." },
            keyPoints: [
              "British East India Company rule",
              "1857 Rebellion and British Crown rule",
              "Gandhi and independence movement",
              "Partition and independence (1947)",
              "Post-independence India and Pakistan"
            ],
            difficulty: "Advanced",
            hardPoints: "理解甘地的非暴力策略",
            examTips: "分析殖民统治的长远影响",
            videos: [
              { title: "History Summarized: Colonial India", channel: "World History", url: "https://www.youtube.com/watch?v=x-cbIenKTM0" },
              { title: "Battle of Dien Bien Phu Vietnam and the Fall of French Indochina", channel: "Edexcel", url: "https://www.youtube.com/watch?v=Yi8Av0e0T4Y" }
            ]
          },
          {
            id: "h4c6", num: 6,
            title: { zh: "苏联解体", en: "Collapse of the Soviet Union" },
            overview: { zh: "学习苏联解体和冷战结束的历史。", en: "Learn about the collapse of the Soviet Union and the end of the Cold War." },
            keyPoints: [
              "Gorbachev's reforms: Perestroika and Glasnost",
              "Eastern Europe revolutions (1989)",
              "Fall of Berlin Wall (1989)",
              "Dissolution of Soviet Union (1991)",
              "Legacy and new world order"
            ],
            difficulty: "Advanced",
            hardPoints: "理解苏联解体的复杂原因",
            examTips: "分析冷战结束的影响",
            videos: [
              { title: "Perestroika & Glasnost (The End of the Soviet Union)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=femvIHkVQG8" },
              { title: "Superpower Relations/Cold War - The End of the Soviet Union", channel: "Edexcel", url: "https://www.youtube.com/watch?v=TSWsW61NCHA" },
              { title: "How and Why Did The Soviet Union Collapse", channel: "Edexcel", url: "https://www.youtube.com/watch?v=qZdijf1U7OY" }
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
            videos: [
              { title: "UK Democracy Overview", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=4GBbK7Wzxzw" },
              { title: "Electoral Systems Explained", channel: "CGP Grey", url: "https://www.youtube.com/watch?v=7K7G9Qk6X3w" },
              { title: "A-Level Politics: UK Democracy and the Electoral System", channel: "A-Level Politics", url: "https://www.youtube.com/watch?v=P3n_QwR5qZ7" }
            ]
          },
          {
            id: "p1c2", num: 2,
            title: { zh: "核心政治理论", en: "Core Political Ideas" },
            overview: { zh: "深入学习三大核心政治思想：自由主义、保守主义和社会主义的历史发展、核心价值观、主要分支和代表人物。", en: "In-depth study of three core political ideologies: Liberalism, Conservatism, and Socialism, including their historical development, core values, main branches, and key thinkers." },
            keyPoints: [
              "LIBERALISM - Historical Development: Emerged from the Enlightenment (17th-18th century), influenced by thinkers like John Locke who challenged absolute monarchy and advocated natural rights (life, liberty, property)",
              "LIBERALISM - Core Values: Individual freedom and autonomy, equality of rights and opportunities, rule of law, tolerance and pluralism, rationalism and progress",
              "LIBERALISM - Classical Liberalism: Emphasizes negative freedom (freedom from interference), minimal state intervention, free-market capitalism, laissez-faire economics. Key thinkers: John Locke (natural rights, social contract), Adam Smith (invisible hand, free markets), John Stuart Mill (harm principle, utilitarianism)",
              "LIBERALISM - Modern Liberalism: Emphasizes positive freedom (freedom to achieve potential), accepts state intervention to promote equality and welfare, supports welfare state and social justice. Key thinkers: John Rawls (justice as fairness, veil of ignorance), T.H. Green (positive freedom), John Maynard Keynes (government intervention in economy)",
              "LIBERALISM - Key Debates: Negative vs positive freedom, extent of state intervention, individual rights vs collective welfare, equality of opportunity vs equality of outcome",
              "CONSERVATISM - Historical Development: Emerged as a reaction to the French Revolution (1789), Edmund Burke criticized radical change and defended tradition, organic society, and gradual reform",
              "CONSERVATISM - Core Values: Tradition and preservation of established institutions, pragmatism over ideology, organic society (society as a living organism that evolves naturally), hierarchy and authority, human imperfection (skepticism about human nature)",
              "CONSERVATISM - Traditional Conservatism: Emphasizes tradition, established institutions (monarchy, church, aristocracy), paternalism (duty of the wealthy to care for the poor), organic change (gradual evolution, not revolution). Key thinkers: Edmund Burke (tradition, prejudice, little platoons), Michael Oakeshott (politics of imperfection)",
              "CONSERVATISM - Neo-conservatism: Combines traditional conservative values with free-market economics, strong national defense, assertive foreign policy, emphasis on law and order. Emerged in 1970s-1980s (Reagan, Thatcher). Key ideas: rolling back the welfare state, privatization, deregulation, traditional family values",
              "CONSERVATISM - One-Nation Conservatism: Emphasizes social cohesion, paternalistic duty to help the poor, accepts welfare state to prevent social unrest. Key thinker: Benjamin Disraeli (one nation, not two nations of rich and poor)",
              "SOCIALISM - Historical Development: Emerged from the Industrial Revolution (19th century) as a response to capitalism's inequalities, influenced by Karl Marx's critique of capitalism and advocacy for workers' revolution",
              "SOCIALISM - Core Values: Social equality and reduction of class divisions, collective ownership of means of production, cooperation over competition, social justice and redistribution of wealth, solidarity and community",
              "SOCIALISM - Revolutionary Socialism/Communism: Advocates violent overthrow of capitalism, establishment of dictatorship of the proletariat, abolition of private property, classless society. Key thinkers: Karl Marx (historical materialism, class struggle, surplus value), Friedrich Engels, Vladimir Lenin (vanguard party)",
              "SOCIALISM - Social Democracy/Democratic Socialism: Advocates gradual, parliamentary reform rather than revolution, mixed economy (public and private ownership), extensive welfare state, progressive taxation. Key thinkers: Eduard Bernstein (evolutionary socialism), Clement Attlee (post-war Labour government, NHS)",
              "SOCIALISM - Third Way: Combines market economy with social justice, accepts capitalism but seeks to humanize it, emphasis on equality of opportunity rather than outcome, active welfare state (welfare-to-work). Key thinker: Anthony Giddens (adviser to Tony Blair)",
              "COMPARISON - Role of the State: Liberalism (minimal state/enabling state), Conservatism (maintains order and tradition), Socialism (extensive intervention/ownership)",
              "COMPARISON - View of Equality: Classical Liberalism (equality of opportunity, meritocracy), Modern Liberalism (foundational equality, welfare support), Conservatism (natural hierarchy, inequality is inevitable), Socialism (equality of outcome, redistribution)",
              "COMPARISON - Attitude to Change: Classical Liberalism (progressive reform), Modern Liberalism (gradual reform for social justice), Conservatism (gradual, organic change, skeptical of radical reform), Revolutionary Socialism (revolutionary transformation), Social Democracy (evolutionary reform)",
              "COMPARISON - Economic System: Classical Liberalism (free-market capitalism), Modern Liberalism (regulated capitalism, welfare state), Conservatism (pragmatic, accepts mixed economy), Socialism (public ownership, planned economy or mixed economy)",
              "COMPARISON - View of Human Nature: Liberalism (rational, self-interested, capable of progress), Conservatism (imperfect, fallible, needs guidance), Socialism (cooperative, shaped by economic conditions, capable of altruism)",
              "KEY THINKERS SUMMARY - Liberalism: John Locke (natural rights, limited government), John Stuart Mill (harm principle, individual liberty), John Rawls (justice as fairness, original position)",
              "KEY THINKERS SUMMARY - Conservatism: Edmund Burke (tradition, organic society, prejudice), Michael Oakeshott (skepticism, pragmatism), Benjamin Disraeli (one-nation conservatism)",
              "KEY THINKERS SUMMARY - Socialism: Karl Marx (class struggle, historical materialism), Eduard Bernstein (evolutionary socialism), Anthony Giddens (third way, social investment state)"
            ],
            definitions: [
              { term: "Negative Freedom", definition: "Freedom from external interference or coercion (classical liberal concept)" },
              { term: "Positive Freedom", definition: "Freedom to achieve one's potential, requiring enabling conditions like education and welfare (modern liberal concept)" },
              { term: "Social Contract", definition: "Agreement between individuals and government where people surrender some freedoms in exchange for protection of remaining rights" },
              { term: "Laissez-faire", definition: "Economic policy of minimal government intervention in the market" },
              { term: "Paternalism", definition: "Authority figures making decisions for others' benefit, like a father caring for children" },
              { term: "Organic Society", definition: "Society viewed as a living organism that evolves naturally, not through rational planning" },
              { term: "Class Struggle", definition: "Marxist concept of conflict between bourgeoisie (owners) and proletariat (workers) driving historical change" },
              { term: "Means of Production", definition: "Resources needed to produce goods (factories, land, machinery)" },
              { term: "Welfare State", definition: "System where government provides social services (healthcare, education, unemployment benefits)" }
            ],
            difficulty: "Intermediate",
            hardPoints: "Distinguishing between branches within each ideology (Classical vs Modern Liberalism, Traditional vs Neo-conservatism, Revolutionary vs Democratic Socialism); Understanding how ideologies differ on key concepts (freedom, equality, state role); Applying ideological perspectives to contemporary political issues",
            examTips: "Be able to compare and contrast all three ideologies on key themes (state role, equality, human nature, change); Know key thinkers and their specific contributions; Use examples to illustrate ideological positions; Understand internal tensions within each ideology (e.g., classical vs modern liberalism); Practice applying ideologies to real-world policies (welfare reform, taxation, healthcare)",
            videos: [
              { title: "Political Ideologies Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=5q7j8D1vH8" },
              { title: "Liberalism Explained", channel: "Philosophy Tube", url: "https://www.youtube.com/watch?v=e-mL4LzVXY" },
              { title: "A-Level Politics: Core Political Ideologies (Liberalism)", channel: "A-Level Politics", url: "https://www.youtube.com/watch?v=I8b_PvN4mY2" },
              { title: "Conservatism Explained", channel: "Philosophy Tube", url: "https://www.youtube.com/watch?v=8SOQduoLgRw" },
              { title: "Socialism Explained", channel: "Philosophy Tube", url: "https://www.youtube.com/watch?v=vyl2DeKT-Vs" },
              { title: "Karl Marx and Marxism", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=fSQgCy_iIcc" }
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
              { title: "Social Psychology Overview", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=YO4RbT4Eps" },
              { title: "Milgram Experiment", channel: "Veritasium", url: "https://www.youtube.com/watch?v=m7wF2j0B4" },
              { title: "A-Level Psychology: Social Influence and Conformity", channel: "A-Level Psychology", url: "https://www.youtube.com/watch?v=S8n_QwN5pX4" }
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
            videos: [
              { title: "How Memory Works", channel: "TED-Ed", url: "https://www.youtube.com/watch?v=2zCwS14qSqM" },
              { title: "Memory and Forgetting", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=2mYKrB9K4" },
              { title: "A-Level Psychology: Memory Models and Forgetting", channel: "A-Level Psychology", url: "https://www.youtube.com/watch?v=M3b_PvR7mY8" }
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
            videos: [
              { title: "Research Methods in Psychology", channel: "Psychology Today", url: "https://www.youtube.com/watch?v=3XW8Qk9P4" },
              { title: "A-Level Psychology: Research Methods Masterclass", channel: "A-Level Psychology", url: "https://www.youtube.com/watch?v=R5m_RwL4qZ2" }
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
            videos: [
              { title: "Biological Psychology", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=4K8G7Lm" },
              { title: "A-Level Psychology: Biopsychology and the Brain", channel: "A-Level Psychology", url: "https://www.youtube.com/watch?v=B2v_PwH5pX9" }
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
            videos: [
              { title: "Learning Theories", channel: "Simply Psychology", url: "https://www.youtube.com/watch?v=5L8H9Mk" },
              { title: "A-Level Psychology: Learning Theories and Conditioning", channel: "A-Level Psychology", url: "https://www.youtube.com/watch?v=L7n_QwN8mY3" }
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
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
            videos: [
              { title: "Complex Numbers (Year 1) in 14 minutes", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=-AqvC88Udig" },
              { title: "Edexcel AS Level Further Maths: 1.1 Imaginary and Complex Numbers", channel: "Edexcel", url: "https://www.youtube.com/watch?v=DwpRYP-7Lrk" },
              { title: "Further Maths A-Level: Introduction to Complex Numbers", channel: "Further Maths", url: "https://www.youtube.com/watch?v=C4m_PwR7pX2" }
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
            videos: [
              { title: "Matrices in 33 minutes - A-Level Further Maths, Core Pure 1", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=DWYAMr6eI-4" },
              { title: "Edexcel AS Level Further Maths: 6.1 Introduction to Matrices", channel: "Edexcel", url: "https://www.youtube.com/watch?v=MPTQd2_E6uY" },
              { title: "Further Maths A-Level: Matrix Operations and Transformations", channel: "Further Maths", url: "https://www.youtube.com/watch?v=M9b_QwN5qZ8" }
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
            videos: [
              { title: "Proof by Induction in 20 minutes - A-Level Further Maths", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=zRHuTNF1x9c" },
              { title: "A Level Further Maths | Core Pure | Introduction to Proof by Induction", channel: "Edexcel", url: "https://www.youtube.com/watch?v=P-WBmCB0Y5k" },
              { title: "Further Maths A-Level: Mathematical Proof by Induction", channel: "Further Maths", url: "https://www.youtube.com/watch?v=P2n_RvL4mY5" }
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
            videos: [
              { title: "Everything you NEED to memorise for A-Level Further Maths (Includes Series)", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=KUA2TUwOAK4" },
              { title: "Edexcel Further maths - Core Pure 1 - Series - Part 1", channel: "Edexcel", url: "https://www.youtube.com/watch?v=KN5o1nyhY8o" },
              { title: "Further Maths A-Level: Series and Method of Differences", channel: "Further Maths", url: "https://www.youtube.com/watch?v=S5v_PwH8pX3" }
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
            videos: [
              { title: "A Level Further Maths | Core Pure | Introduction to Polar Coordinates", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=0p0dVsqu_Gs" },
              { title: "1. Polar Coordinates: Further Pure Maths 1 | A Level Further Maths", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=GlwJdoKfKYA" },
              { title: "Further Maths A-Level: Polar Coordinates Basics", channel: "Further Maths", url: "https://www.youtube.com/watch?v=P8m_QwR5qZ7" }
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
            videos: [
              { title: "Hyperbolic Functions in 26 minutes - A-Level Further Maths", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=xsKIq-zZJ5I" },
              { title: "Hyperbolic Calculus - Integrating with Hyperbolic Functions", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=MZm6sbR4RDI" },
              { title: "Introduction to Hyperbolic Functions (CORE 2)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=6y9jJttxXL8" }
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
            videos: [
              { title: "Differential Equations in 37 minutes - A-Level Further Maths", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=ytPNQnoctko" },
              { title: "Differential Equations 1 - First Order, Reverse Product", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=c5PlWkg38Zk" },
              { title: "Modelling with Differential Equations - A-Level Further Maths", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=YdY8kI657CQ" }
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
            videos: [
              { title: "Vectors in 1 hour - A-Level Further Maths, Core Pure Year 1", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=zqAoTdvTL9c" },
              { title: "Systems of Linear Equations - Edexcel A-level Further Maths", channel: "Edexcel", url: "https://www.youtube.com/watch?v=KOQGdtIHps4" },
              { title: "VECTORS Top 10 Must Knows (Ultimate Study Guide)", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=l9ioZA9brtc" }
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
            videos: [
              { title: "Momentum & Impulse 1 - Momentum and Impulse in 1D", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=erMZ617QQ94" },
              { title: "1.1 Momentum in one Dimension (FM1 - Chapter 1)", channel: "Edexcel", url: "https://www.youtube.com/watch?v=VUwWWGVZwOg" },
              { title: "Impulse and Momentum - Formulas and Equations", channel: "PhysicsOnline", url: "https://www.youtube.com/watch?v=FYKoU0sb9ks" },
              { title: "Further Mechanics A-Level: Momentum and Impulse", channel: "Further Mechanics", url: "https://www.youtube.com/watch?v=M3n_PvN7mY2" }
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
            videos: [
              { title: "Further Mechanics Centripetal Force & Circular Motion", channel: "A-Level Maths", url: "https://www.youtube.com/watch?v=vSDsRGz7gQc" },
              { title: "A Level Physics Revision: All of Circular Motion", channel: "A-Level Physics", url: "https://www.youtube.com/watch?v=9n4xhxYtARg" },
              { title: "Further Mechanics - Session 1 - Circular Motion", channel: "Edexcel", url: "https://www.youtube.com/watch?v=DAf1kYi42oA" },
              { title: "Further Mechanics A-Level: Circular Motion Principles", channel: "Further Mechanics", url: "https://www.youtube.com/watch?v=C7b_RwL4pX8" }
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
            videos: [
              { title: "Edexcel A Level Further Maths Further Statistics 1 - Discrete Random Variables", channel: "Edexcel", url: "https://www.youtube.com/watch?v=o71L8JeSBGQ" },
              { title: "A Level Further Maths - Further Stats 1 - Introducing Discrete Random Variables", channel: "Edexcel", url: "https://www.youtube.com/watch?v=YUUdUvlF0sU" },
              { title: "Expected value of a discrete random variable - Further Statistics", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=M4ylCzZ0N70" },
              { title: "Further Statistics A-Level: Discrete Random Variables", channel: "Further Statistics", url: "https://www.youtube.com/watch?v=D2m_PwH5qZ4" }
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
            videos: [
              { title: "Edexcel A Level Further Maths Further Statistics 1 - Hypothesis Testing", channel: "Edexcel", url: "https://www.youtube.com/watch?v=sqVH8COWE5I" },
              { title: "A Level Further Maths - Further Stats 1 - Testing a Hypothesis", channel: "Edexcel", url: "https://www.youtube.com/watch?v=fWzwFLHrcC0" },
              { title: "Hypothesis Testing Problems - Z Test & T Statistics", channel: "ExamSolutions", url: "https://www.youtube.com/watch?v=zJ8e_wAWUzE" },
              { title: "Further Statistics A-Level: Hypothesis Testing Explained", channel: "Further Statistics", url: "https://www.youtube.com/watch?v=H9n_QwN8mY5" }
            ]
          }
        ]
      }
    }
  }
};

export default SUBJECTS;
