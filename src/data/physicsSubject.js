const PHYSICS_WORKED_EXAMPLES = {
  phy1c1: [
    {
      question: { en: "A trolley starts from rest and accelerates uniformly at 2.4 m s^-2 for 5.0 s. Find its final velocity and displacement." },
      answer: { en: "Use v = u + at = 0 + 2.4 x 5.0 = 12 m s^-1. Then s = ut + 1/2 at^2 = 0 + 0.5 x 2.4 x 5.0^2 = 30 m. Final velocity = 12 m s^-1; displacement = 30 m." },
    },
  ],
  phy1c2: [
    {
      question: { en: "A 40 N force acts 35 degrees above the horizontal. Calculate its horizontal and vertical components." },
      answer: { en: "Resolve using perpendicular components. Horizontal component = 40 cos 35 = 32.8 N. Vertical component = 40 sin 35 = 22.9 N. Quote components with directions, not just magnitudes." },
    },
  ],
  phy1c3: [
    {
      question: { en: "A 0.20 kg trolley moving at 6.0 m s^-1 collides with a stationary 0.30 kg trolley and they stick together. Find their common velocity." },
      answer: { en: "Momentum before = 0.20 x 6.0 + 0.30 x 0 = 1.2 kg m s^-1. Combined mass = 0.50 kg. Conservation of momentum gives v = 1.2 / 0.50 = 2.4 m s^-1 in the original direction." },
    },
  ],
  phy1c4: [
    {
      question: { en: "A 60 kg student climbs 4.5 m in 12 s. Estimate the useful power output, taking g = 9.81 N kg^-1." },
      answer: { en: "Gain in gravitational potential energy = mgh = 60 x 9.81 x 4.5 = 2649 J. Power = energy / time = 2649 / 12 = 221 W. The useful power output is about 220 W." },
    },
  ],
  phy1c5: [
    {
      question: { en: "A block of volume 3.0 x 10^-4 m^3 is fully submerged in water. Calculate the upthrust and the resultant force if its weight is 3.6 N." },
      answer: { en: "Upthrust = weight of displaced water = rho V g = 1000 x 3.0 x 10^-4 x 9.81 = 2.94 N. Resultant force = 3.6 - 2.94 = 0.66 N downward." },
    },
  ],
  phy1c6: [
    {
      question: { en: "A wire of length 1.5 m and diameter 0.50 mm extends by 1.2 mm when a 20 N load is added. Estimate the Young modulus." },
      answer: { en: "Area = pi(0.25 x 10^-3)^2 = 1.96 x 10^-7 m^2. Stress = 20 / area = 1.02 x 10^8 Pa. Strain = 1.2 x 10^-3 / 1.5 = 8.0 x 10^-4. Young modulus = stress / strain = 1.27 x 10^11 Pa." },
    },
  ],
  phy2c1: [
    {
      question: { en: "A sound wave has frequency 500 Hz and wavelength 0.68 m. Calculate the wave speed." },
      answer: { en: "Use v = f lambda. v = 500 x 0.68 = 340 m s^-1. Check that Hz is s^-1, so the units become m s^-1." },
    },
  ],
  phy2c2: [
    {
      question: { en: "A string fixed at both ends has length 0.80 m and vibrates in its fundamental mode at 120 Hz. Find the wave speed." },
      answer: { en: "For the fundamental mode, L = lambda / 2, so lambda = 2L = 1.60 m. Wave speed v = f lambda = 120 x 1.60 = 192 m s^-1." },
    },
  ],
  phy2c3: [
    {
      question: { en: "Light forms a first-order maximum at 20 degrees using a grating with 600 lines mm^-1. Estimate the wavelength." },
      answer: { en: "Grating spacing d = 1 / (600 x 10^3) = 1.67 x 10^-6 m. Using n lambda = d sin theta with n = 1 gives lambda = 1.67 x 10^-6 x sin 20 = 5.70 x 10^-7 m." },
    },
  ],
  phy2c4: [
    {
      question: { en: "Photons of energy 4.0 eV strike a metal with work function 2.3 eV. Find the maximum kinetic energy of the emitted electrons in joules." },
      answer: { en: "Maximum kinetic energy = photon energy - work function = 4.0 - 2.3 = 1.7 eV. Convert to joules: 1.7 x 1.60 x 10^-19 = 2.72 x 10^-19 J." },
    },
  ],
  phy2c5: [
    {
      question: { en: "A charge of 2.4 C passes through a lamp in 0.80 s when the potential difference is 6.0 V. Calculate the current and power." },
      answer: { en: "Current I = Q / t = 2.4 / 0.80 = 3.0 A. Power P = VI = 6.0 x 3.0 = 18 W." },
    },
  ],
  phy2c6: [
    {
      question: { en: "A 2.0 m wire has resistance 12 ohm and diameter 0.40 mm. Calculate its resistivity." },
      answer: { en: "Area A = pi(0.20 x 10^-3)^2 = 1.26 x 10^-7 m^2. Resistivity rho = RA / L = 12 x 1.26 x 10^-7 / 2.0 = 7.5 x 10^-7 ohm m." },
    },
  ],
  phy3c1: [
    {
      question: { en: "Plan the variables for investigating how pendulum period depends on length." },
      answer: { en: "Independent variable: pendulum length. Dependent variable: period, found by timing several oscillations and dividing by the number. Control variables: bob mass, release angle, timing method and pivot type. Use at least five lengths and repeat timings." },
    },
  ],
  phy3c2: [
    {
      question: { en: "A micrometer gives diameter readings of 0.52 mm, 0.51 mm and 0.53 mm. State the mean diameter and a sensible reading uncertainty." },
      answer: { en: "Mean diameter = (0.52 + 0.51 + 0.53) / 3 = 0.52 mm. With a 0.01 mm resolution micrometer and small scatter, a sensible reading uncertainty is about +/- 0.01 mm." },
    },
  ],
  phy3c3: [
    {
      question: { en: "A length is 0.500 +/- 0.002 m and a time for 10 oscillations is 20.0 +/- 0.2 s. Calculate both percentage uncertainties." },
      answer: { en: "Length percentage uncertainty = 0.002 / 0.500 x 100 = 0.40%. Time percentage uncertainty = 0.2 / 20.0 x 100 = 1.0%. The period T = t / 10 has the same percentage uncertainty as t." },
    },
  ],
  phy3c4: [
    {
      question: { en: "A force-extension graph has best-fit gradient 25 N m^-1. What physical quantity does this represent for a spring?" },
      answer: { en: "Hooke's law is F = kx. On a graph of F against x, the gradient equals k. Therefore the spring constant is 25 N m^-1." },
    },
  ],
  phy3c5: [
    {
      question: { en: "In a falling-ball viscosity experiment, students time the ball by eye between two marks. Identify one limitation and one targeted improvement." },
      answer: { en: "Limitation: reaction time creates a large uncertainty in the time interval, especially if the distance is short. Improvement: use light gates or video analysis, or increase the distance after terminal velocity has been reached." },
    },
  ],
  phy3c6: [
    {
      question: { en: "In a Young modulus practical, a force-extension graph has gradient 1.0 x 10^4 N m^-1 for a wire of length 2.0 m and area 2.0 x 10^-7 m^2. Find E." },
      answer: { en: "For a wire, E = stress / strain = (F/A) / (x/L) = (F/x)(L/A). The graph gradient is F/x, so E = 1.0 x 10^4 x 2.0 / (2.0 x 10^-7) = 1.0 x 10^11 Pa." },
    },
  ],
  phy4c1: [
    {
      question: { en: "A 0.15 kg ball travelling at +20 m s^-1 rebounds at -15 m s^-1. Calculate the impulse on the ball." },
      answer: { en: "Impulse = change in momentum = m(v - u) = 0.15(-15 - 20) = -5.25 N s. The negative sign shows the impulse acts opposite to the initial direction." },
    },
  ],
  phy4c2: [
    {
      question: { en: "A 0.80 kg object moves in a horizontal circle of radius 0.50 m at 4.0 m s^-1. Find the centripetal force." },
      answer: { en: "Use F = mv^2 / r. F = 0.80 x 4.0^2 / 0.50 = 25.6 N. The force is directed towards the centre of the circle." },
    },
  ],
  phy4c3: [
    {
      question: { en: "Parallel plates have a potential difference of 1200 V and separation 0.040 m. Find the electric field strength and the force on a 2.0 microC charge." },
      answer: { en: "E = V / d = 1200 / 0.040 = 3.0 x 10^4 N C^-1. Force F = EQ = 3.0 x 10^4 x 2.0 x 10^-6 = 0.060 N." },
    },
  ],
  phy4c4: [
    {
      question: { en: "A 2200 microF capacitor discharges through a 4.7 kOhm resistor from 6.0 V. Estimate the voltage after 20 s." },
      answer: { en: "Time constant RC = 4700 x 2200 x 10^-6 = 10.34 s. V = V0 e^(-t/RC) = 6.0 e^(-20/10.34) = 0.87 V, to two significant figures." },
    },
  ],
  phy4c5: [
    {
      question: { en: "A 5.0 cm wire carries 3.0 A at right angles to a 0.18 T magnetic field. Calculate the magnetic force." },
      answer: { en: "Use F = BIl sin theta. Since theta = 90 degrees, sin theta = 1. F = 0.18 x 3.0 x 0.050 = 0.027 N." },
    },
  ],
  phy4c6: [
    {
      question: { en: "A nuclear reaction has mass defect 0.0050 u. Estimate the energy released in MeV using 1 u = 931.5 MeV c^-2." },
      answer: { en: "Energy released = mass defect x 931.5 MeV = 0.0050 x 931.5 = 4.66 MeV. The mass decrease appears as released energy." },
    },
  ],
  phy5c1: [
    {
      question: { en: "How much energy is needed to raise the temperature of 0.50 kg of water by 18 degrees C? Use c = 4200 J kg^-1 K^-1." },
      answer: { en: "Use Delta E = mc Delta theta. Delta E = 0.50 x 4200 x 18 = 37,800 J, or 3.8 x 10^4 J to two significant figures." },
    },
  ],
  phy5c2: [
    {
      question: { en: "A gas has pressure 1.2 x 10^5 Pa, volume 2.5 x 10^-3 m^3 and temperature 300 K. Estimate the number of molecules." },
      answer: { en: "Use pV = NkT. N = pV / kT = (1.2 x 10^5 x 2.5 x 10^-3) / (1.38 x 10^-23 x 300) = 7.25 x 10^22 molecules." },
    },
  ],
  phy5c3: [
    {
      question: { en: "The activity of a source falls from 800 Bq to 100 Bq in 18 h. Find the half-life." },
      answer: { en: "800 to 400 is one half-life, 400 to 200 is two, and 200 to 100 is three. Three half-lives take 18 h, so one half-life is 18 / 3 = 6.0 h." },
    },
  ],
  phy5c4: [
    {
      question: { en: "An oscillator has period 0.80 s and amplitude 0.040 m. Find its angular frequency and maximum acceleration." },
      answer: { en: "Angular frequency omega = 2 pi / T = 2 pi / 0.80 = 7.85 rad s^-1. Maximum acceleration = omega^2 A = 7.85^2 x 0.040 = 2.47 m s^-2." },
    },
  ],
  phy5c5: [
    {
      question: { en: "A driven oscillator shows a large peak in amplitude at 12 Hz. Explain what happens to the peak when damping is increased." },
      answer: { en: "The 12 Hz peak is resonance, where driving frequency is close to natural frequency. Increasing damping reduces the maximum amplitude and makes the resonance curve broader, so energy is dissipated faster." },
    },
  ],
  phy5c6: [
    {
      question: { en: "Estimate the orbital speed of a satellite at radius 7.0 x 10^6 m from Earth's centre. Use GM = 3.99 x 10^14 m^3 s^-2." },
      answer: { en: "For a circular orbit, gravitational force provides centripetal force, giving v = sqrt(GM / r). v = sqrt(3.99 x 10^14 / 7.0 x 10^6) = 7.5 x 10^3 m s^-1." },
    },
  ],
  phy5c7: [
    {
      question: { en: "A star has surface temperature 5800 K. Estimate the wavelength of peak emission using Wien's law." },
      answer: { en: "Wien's law gives lambda_max T = 2.898 x 10^-3 m K. lambda_max = 2.898 x 10^-3 / 5800 = 5.0 x 10^-7 m, in the visible region." },
    },
  ],
  phy6c1: [
    {
      question: { en: "Describe a graph-based plan to determine g using a simple pendulum." },
      answer: { en: "Measure period T for several lengths L by timing many oscillations. Plot T^2 against L because T^2 = (4 pi^2 / g)L. The gradient equals 4 pi^2 / g, so g = 4 pi^2 / gradient." },
    },
  ],
  phy6c2: [
    {
      question: { en: "A wire diameter is 0.50 +/- 0.01 mm. Estimate the percentage uncertainty in its cross-sectional area." },
      answer: { en: "Percentage uncertainty in diameter = 0.01 / 0.50 x 100 = 2.0%. Since area is proportional to diameter squared, percentage uncertainty in area = 2 x 2.0% = 4.0%." },
    },
  ],
  phy6c3: [
    {
      question: { en: "A capacitor discharge follows V = V0 e^(-t/RC). What graph should be plotted to determine RC?" },
      answer: { en: "Take natural logs: ln V = ln V0 - t / RC. Plot ln V on the y-axis against t on the x-axis. The gradient is -1 / RC, so RC = -1 / gradient." },
    },
  ],
  phy6c4: [
    {
      question: { en: "A micrometer has a positive zero error, so all measured wire diameters are too large if uncorrected. Explain the effect on calculated Young modulus." },
      answer: { en: "If diameter is too large, calculated area is too large. Stress = F/A is then underestimated, while strain is unchanged. Therefore the calculated Young modulus is underestimated." },
    },
  ],
  phy6c5: [
    {
      question: { en: "In a capacitor discharge practical, why is a graph of ln V against t better than using a single pair of readings?" },
      answer: { en: "A graph uses all data points, reveals outliers and tests whether the relationship is exponential. The gradient gives -1/RC, so random error is reduced compared with relying on one voltage and one time." },
    },
  ],
  phy6c6: [
    {
      question: { en: "Write the structure of a strong practical evaluation answer for a method with large timing uncertainty." },
      answer: { en: "Give a limitation, its consequence and a targeted improvement: reaction time makes the measured time too uncertain; this increases percentage uncertainty in the calculated constant; use light gates or video timing to reduce timing uncertainty." },
    },
  ],
}

const chapter = (data) => ({
  ...data,
  examples: data.examples || PHYSICS_WORKED_EXAMPLES[data.id] || [],
  youtube: data.youtube || [],
  videos: data.videos || [],
})

export const PHYSICS_SUBJECT = {
  id: "physics",
  name: { zh: "物理", en: "Physics" },
  nameFull: { zh: "爱德思IAL物理", en: "Pearson Edexcel IAL Physics" },
  icon: "⚛️",
  color: "#0F766E",
  bgColor: "#CCFBF1",
  level: "IAL (International A-Level) - 2018 Syllabus",
  official: {
    qualification: "Pearson Edexcel International Advanced Level Physics (2018)",
    specificationCode: "ial18-physics",
    asCashIn: "XPH11",
    aLevelCashIn: "YPH11",
    source: "Pearson qualifications",
    url: "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/physics-2018.html",
  },
  books: {
    Unit1: {
      id: "Unit1",
      title: { zh: "力学与材料", en: "Mechanics and Materials" },
      subtitle: { zh: "IAS Unit 1 · WPH11/01", en: "IAS Unit 1 · WPH11/01" },
      color: "#0F766E",
      exam: { code: "WPH11/01", level: "IAS", duration: 90, marks: 80, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy1c1", num: 1,
          title: { zh: "运动学与运动图像", en: "Motion, SUVAT and Kinematics Graphs" },
          overview: { zh: "学习一维匀加速运动、位移-时间图、速度-时间图和加速度-时间图。", en: "Covers one-dimensional motion, SUVAT equations, and interpretation of displacement-time, velocity-time and acceleration-time graphs." },
          keyPoints: [
            "SUVAT equations apply only to motion with constant acceleration in one dimension",
            "The gradient of a displacement-time graph gives velocity; the gradient of a velocity-time graph gives acceleration",
            "The area under a velocity-time graph gives displacement; the area under an acceleration-time graph gives change in velocity",
            "Non-uniform motion requires tangent gradients and graphical area estimates rather than direct SUVAT substitution",
            "Projectile motion is analysed by treating horizontal and vertical components independently",
            "Units, prefixes, significant figures and uncertainty should be tracked throughout numerical answers",
          ],
          formulas: [
            { name: "SUVAT", expr: "v = u + at; s = ut + 1/2 at^2; v^2 = u^2 + 2as; s = (u + v)t/2" },
            { name: "Graph gradient", expr: "gradient = change in y / change in x" },
            { name: "Projectile components", expr: "ux = u cos(theta), uy = u sin(theta)" },
          ],
          difficulty: "Foundation",
          hardPoints: "Choosing the correct graph quantity; keeping signs consistent; recognising when SUVAT is invalid because acceleration is not constant.",
          examTips: "For graph questions, state the physical meaning of gradient or area before calculating. In projectile questions, write horizontal and vertical equations separately.",
        }),
        chapter({
          id: "phy1c2", num: 2,
          title: { zh: "矢量、抛体与受力图", en: "Vectors, Projectiles and Free-Body Diagrams" },
          overview: { zh: "掌握标量与矢量、分解矢量、合成力以及自由体图。", en: "Develops scalar/vector distinction, vector resolution, resultants, projectiles and free-body diagrams." },
          keyPoints: [
            "Scalar quantities have magnitude only; vector quantities have magnitude and direction",
            "A vector can be resolved into two perpendicular components using sine and cosine",
            "A resultant vector can be found by scale drawing or by perpendicular component calculation",
            "Free-body diagrams should show all forces acting on the object, not forces exerted by the object",
            "Weight acts through the centre of gravity and is calculated from W = mg",
            "Projectiles have constant horizontal velocity when air resistance is neglected and vertical acceleration equal to g",
          ],
          formulas: [
            { name: "Weight", expr: "W = mg" },
            { name: "Resultant at right angles", expr: "R = sqrt(A^2 + B^2)" },
            { name: "Vector components", expr: "Fx = F cos(theta), Fy = F sin(theta)" },
          ],
          difficulty: "Foundation",
          hardPoints: "Choosing the correct angle when resolving vectors; not mixing up forces on the object with forces by the object.",
          examTips: "Draw the free-body diagram first. Label the positive direction before applying equations.",
        }),
        chapter({
          id: "phy1c3", num: 3,
          title: { zh: "牛顿定律、动量、力矩与平衡", en: "Newton's Laws, Momentum, Moments and Equilibrium" },
          overview: { zh: "学习牛顿第二定律、终端速度、动量守恒、力矩和平衡条件。", en: "Covers Newton's laws, terminal velocity, momentum, conservation of momentum, moments and equilibrium." },
          keyPoints: [
            "Newton's second law is used as sum of forces equals mass times acceleration when mass is constant",
            "Terminal velocity occurs when resultant force becomes zero during motion through a fluid",
            "Momentum is conserved in a closed system when no external resultant force acts",
            "The moment of a force equals force times perpendicular distance from the pivot",
            "An object in equilibrium has zero resultant force and zero resultant moment",
            "Collisions and explosions require a clear before-and-after momentum statement",
          ],
          formulas: [
            { name: "Newton's second law", expr: "ΣF = ma" },
            { name: "Momentum", expr: "p = mv" },
            { name: "Moment", expr: "moment = Fd" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Using a consistent sign convention in momentum problems; selecting the pivot that removes unknown forces in moments problems.",
          examTips: "For equilibrium, write both force balance and moment balance. For momentum, define direction and show before/after values.",
        }),
        chapter({
          id: "phy1c4", num: 4,
          title: { zh: "功、能量、功率与效率", en: "Work, Energy, Power and Efficiency" },
          overview: { zh: "理解功、动能、重力势能、功率、效率和能量转化。", en: "Introduces work done, kinetic energy, gravitational potential energy, power, efficiency and energy transfer." },
          keyPoints: [
            "Work done is energy transferred by a force moving through a distance in the direction of the force",
            "Kinetic energy depends on mass and the square of speed",
            "Gravitational potential energy changes depend on mass, gravitational field strength and height change",
            "Power is the rate of energy transfer or rate of doing work",
            "Efficiency compares useful output energy or power with total input energy or power",
            "Energy methods can often solve motion problems without finding acceleration first",
          ],
          formulas: [
            { name: "Work done", expr: "W = Fs" },
            { name: "Kinetic energy", expr: "Ek = 1/2 mv^2" },
            { name: "Gravitational potential energy", expr: "ΔEp = mgΔh" },
            { name: "Power", expr: "P = E/t = W/t" },
            { name: "Efficiency", expr: "efficiency = useful output / total input" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Choosing between force-based and energy-based methods; identifying useful output in efficiency questions.",
          examTips: "State the conservation or transfer principle explicitly. Check that energy answers are positive where only a magnitude is required.",
        }),
        chapter({
          id: "phy1c5", num: 5,
          title: { zh: "密度、流体、浮力与黏滞阻力", en: "Density, Fluids, Upthrust, Viscosity and Stokes' Law" },
          overview: { zh: "学习密度、浮力、黏滞阻力、层流和落球法测黏度。", en: "Covers density, upthrust, viscous drag, laminar flow and the falling-ball method for viscosity." },
          keyPoints: [
            "Density is mass per unit volume and links material properties to floating and sinking behaviour",
            "Upthrust equals the weight of fluid displaced by an object",
            "Stokes' law applies to small spherical objects moving slowly through a fluid in laminar flow",
            "Viscosity depends on temperature and affects terminal velocity",
            "The falling-ball method can be used to determine the viscosity of a liquid",
            "Practical answers must consider repeat readings, timing uncertainty and whether terminal velocity has been reached",
          ],
          formulas: [
            { name: "Density", expr: "rho = m / V" },
            { name: "Upthrust", expr: "upthrust = weight of fluid displaced" },
            { name: "Stokes' law", expr: "F = 6 pi eta r v" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Knowing the limits of Stokes' law; explaining terminal velocity using force balance.",
          examTips: "When using Stokes' law, mention spherical object, low speed and laminar flow if the question asks for assumptions.",
        }),
        chapter({
          id: "phy1c6", num: 6,
          title: { zh: "弹性、应力应变与杨氏模量", en: "Elasticity, Stress, Strain and Young Modulus" },
          overview: { zh: "学习胡克定律、弹性限度、应力、应变、杨氏模量和弹性势能。", en: "Covers Hooke's law, elastic limit, stress, strain, Young modulus and elastic strain energy." },
          keyPoints: [
            "Hooke's law states that extension is proportional to force up to the limit of proportionality",
            "Stress is force per unit cross-sectional area and strain is extension per original length",
            "Young modulus is stress divided by strain in the linear elastic region",
            "The area under a force-extension graph represents elastic strain energy",
            "Plastic deformation remains after force removal; elastic deformation is reversible",
            "Young modulus practical work requires accurate diameter measurement and uncertainty treatment",
          ],
          formulas: [
            { name: "Hooke's law", expr: "F = kx" },
            { name: "Stress", expr: "stress = F / A" },
            { name: "Strain", expr: "strain = Δx / x" },
            { name: "Young modulus", expr: "E = stress / strain" },
            { name: "Elastic strain energy", expr: "Eel = 1/2 FΔx" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Using cross-sectional area correctly; interpreting the changing gradient of a force-extension graph.",
          examTips: "For wire experiments, diameter uncertainty is important because area depends on radius squared.",
        }),
      ],
    },

    Unit2: {
      id: "Unit2",
      title: { zh: "波与电学", en: "Waves and Electricity" },
      subtitle: { zh: "IAS Unit 2 · WPH12/01", en: "IAS Unit 2 · WPH12/01" },
      color: "#0284C7",
      exam: { code: "WPH12/01", level: "IAS", duration: 90, marks: 80, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy2c1", num: 1,
          title: { zh: "波的性质与图像", en: "Wave Properties and Wave Graphs" },
          overview: { zh: "学习振幅、频率、周期、波速、波长、横波、纵波和波图像。", en: "Covers amplitude, frequency, period, speed, wavelength, transverse and longitudinal waves, and wave graph interpretation." },
          keyPoints: [
            "Wave speed equals frequency multiplied by wavelength",
            "Longitudinal waves involve oscillations parallel to energy transfer; transverse waves involve perpendicular oscillations",
            "Displacement-distance and displacement-time graphs show different physical information",
            "Phase difference and path difference describe relative positions in a wave cycle",
            "Intensity is power per unit area and decreases with spreading",
            "Standing waves have nodes and antinodes formed by superposition of waves travelling in opposite directions",
          ],
          formulas: [
            { name: "Wave speed", expr: "v = f lambda" },
            { name: "Period", expr: "T = 1 / f" },
            { name: "Intensity", expr: "I = P / A" },
          ],
          difficulty: "Foundation",
          hardPoints: "Separating time-period information from wavelength information; describing phase precisely.",
          examTips: "Label axes before interpreting wave graphs. Use the correct graph type when finding wavelength or period.",
        }),
        chapter({
          id: "phy2c2", num: 2,
          title: { zh: "驻波、叠加与干涉", en: "Stationary Waves, Superposition and Interference" },
          overview: { zh: "理解叠加原理、相干、干涉、路径差和驻波。", en: "Explains superposition, coherence, interference, path difference and stationary waves." },
          keyPoints: [
            "Superposition occurs when two or more waves overlap and their displacements add",
            "Coherent sources have a constant phase difference and the same frequency",
            "Constructive interference occurs for path difference equal to whole wavelengths",
            "Destructive interference occurs for path difference equal to odd half-wavelengths",
            "Standing waves form from two waves of the same frequency travelling in opposite directions",
            "The frequency of a vibrating string depends on tension, length and mass per unit length",
          ],
          formulas: [
            { name: "String wave speed", expr: "v = sqrt(T / mu)" },
            { name: "Constructive interference", expr: "path difference = n lambda" },
            { name: "Destructive interference", expr: "path difference = (n + 1/2) lambda" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Connecting path difference to phase difference; identifying nodes and antinodes on a standing wave diagram.",
          examTips: "For standing waves, draw the pattern and mark nodes before using wavelength relationships.",
        }),
        chapter({
          id: "phy2c3", num: 3,
          title: { zh: "衍射、偏振与折射", en: "Diffraction, Polarisation and Refraction" },
          overview: { zh: "学习衍射、光栅方程、偏振、折射率、临界角和全反射。", en: "Covers diffraction, diffraction grating equation, polarisation, refractive index, critical angle and total internal reflection." },
          keyPoints: [
            "Diffraction is most noticeable when the gap size is comparable with the wavelength",
            "A diffraction grating produces maxima at angles satisfying the grating equation",
            "Polarisation is evidence that electromagnetic waves are transverse",
            "Refraction changes wave speed and direction when moving between media",
            "Total internal reflection requires travel from higher to lower refractive index and angle above the critical angle",
            "Huygens' construction can explain diffraction and refraction qualitatively",
          ],
          formulas: [
            { name: "Diffraction grating", expr: "n lambda = d sin(theta)" },
            { name: "Snell's law", expr: "n1 sin(theta1) = n2 sin(theta2)" },
            { name: "Refractive index", expr: "n = c / v" },
            { name: "Critical angle", expr: "sin C = 1 / n" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Using degrees or radians consistently; selecting the correct order n in diffraction grating questions.",
          examTips: "Convert grating line density into spacing d before substitution. State both conditions for total internal reflection.",
        }),
        chapter({
          id: "phy2c4", num: 4,
          title: { zh: "光的粒子性与量子证据", en: "Particle Nature of Light and Quantum Evidence" },
          overview: { zh: "学习光电效应、光子、功函数、德布罗意波长和电子衍射证据。", en: "Covers the photoelectric effect, photons, work function, de Broglie wavelength and electron diffraction evidence." },
          keyPoints: [
            "Photon energy is proportional to frequency",
            "The photoelectric effect supports the particle model of electromagnetic radiation",
            "A threshold frequency is required before photoelectrons are emitted",
            "Increasing intensity increases emission rate only if frequency is above threshold",
            "Electron diffraction provides evidence for wave behaviour of particles",
            "The de Broglie wavelength links particle momentum with wave properties",
          ],
          formulas: [
            { name: "Photon energy", expr: "E = hf" },
            { name: "Photoelectric equation", expr: "hf = phi + 1/2 mvmax^2" },
            { name: "de Broglie wavelength", expr: "lambda = h / p" },
          ],
          difficulty: "Advanced",
          hardPoints: "Separating intensity effects from frequency effects; explaining why classical wave theory fails for photoelectric observations.",
          examTips: "In explanation questions, use threshold frequency and instantaneous emission as evidence for photons.",
        }),
        chapter({
          id: "phy2c5", num: 5,
          title: { zh: "电流、电势差、电阻与功率", en: "Current, Potential Difference, Resistance and Power" },
          overview: { zh: "掌握电流、电荷、电势差、电阻、电功率和电能。", en: "Introduces current, charge, potential difference, resistance, electrical power and energy." },
          keyPoints: [
            "Current is the rate of flow of charge",
            "Potential difference is energy transferred per unit charge",
            "Resistance is potential difference divided by current",
            "Ohmic conductors have constant resistance at constant temperature",
            "Electrical power can be found from voltage-current or resistance forms",
            "Circuit calculations require conservation of charge and energy around junctions and loops",
          ],
          formulas: [
            { name: "Current", expr: "I = ΔQ / Δt" },
            { name: "Potential difference", expr: "V = W / Q" },
            { name: "Resistance", expr: "R = V / I" },
            { name: "Electrical power", expr: "P = VI = I^2R = V^2/R" },
            { name: "Electrical energy", expr: "W = VIt" },
          ],
          difficulty: "Foundation",
          hardPoints: "Understanding potential difference as energy transfer, not force; choosing the correct power equation for given variables.",
          examTips: "For circuit questions, annotate known current and voltage values directly on the circuit diagram.",
        }),
        chapter({
          id: "phy2c6", num: 6,
          title: { zh: "电阻率、I-V 特性与分压电路", en: "Resistivity, I-V Characteristics and Potential Dividers" },
          overview: { zh: "学习电阻率、载流子模型、I-V 图线、热敏电阻、LDR 和分压器。", en: "Covers resistivity, the charge-carrier model, I-V characteristics, thermistors, LDRs and potential dividers." },
          keyPoints: [
            "Resistivity links resistance to length and cross-sectional area of a conductor",
            "The microscopic current model uses number density, charge, drift velocity and area",
            "I-V graphs reveal whether a component is ohmic or non-ohmic",
            "A filament lamp's resistance increases as temperature rises",
            "Thermistors and LDRs can be used in potential divider sensing circuits",
            "Potential divider output depends on the ratio of component resistances",
          ],
          formulas: [
            { name: "Resistivity", expr: "R = rho L / A" },
            { name: "Charge carrier current", expr: "I = nqvA" },
            { name: "Potential divider", expr: "Vout = Vin R2 / (R1 + R2)" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Explaining non-linear I-V graphs; predicting how sensor resistance changes affect output voltage.",
          examTips: "For potential dividers, redraw the two resistors vertically and mark which voltage is being measured.",
        }),
      ],
    },

    Unit3: {
      id: "Unit3",
      title: { zh: "物理实验技能 I", en: "Practical Skills in Physics I" },
      subtitle: { zh: "IAS Unit 3 · WPH13/01", en: "IAS Unit 3 · WPH13/01" },
      color: "#2563EB",
      exam: { code: "WPH13/01", level: "IAS", duration: 80, marks: 50, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy3c1", num: 1,
          title: { zh: "变量控制与实验设计", en: "Variables, Controls and Practical Planning" },
          overview: { zh: "学习自变量、因变量、控制变量、实验步骤和可重复性。", en: "Covers independent, dependent and control variables, method design, repeatability and fair testing." },
          keyPoints: [
            "A valid practical plan identifies the independent variable, dependent variable and key control variables",
            "Control variables must be linked to the physical reason they affect the result",
            "A good method includes enough repeats and a suitable range of values",
            "Apparatus choice should match required precision and measurement range",
            "Risk management should identify hazards and realistic control measures",
          ],
          formulas: [
            { name: "Mean", expr: "mean = sum of readings / number of readings" },
          ],
          difficulty: "Foundation",
          hardPoints: "Justifying controls rather than only listing them; writing a method that another student could follow.",
          examTips: "Use the words independent variable, dependent variable and control variable explicitly in planning answers.",
        }),
        chapter({
          id: "phy3c2", num: 2,
          title: { zh: "测量、仪器选择与安全", en: "Measurements, Apparatus Choice and Safety" },
          overview: { zh: "学习仪器分辨率、读数、重复测量、系统误差和实验安全。", en: "Covers instrument resolution, readings, repeats, systematic error and practical safety." },
          keyPoints: [
            "Resolution is the smallest change an instrument can reliably measure",
            "Repeated readings reduce the effect of random error",
            "Systematic errors shift all readings in the same direction and require method correction",
            "Zero error should be checked and corrected before data collection",
            "Safety answers should name both the hazard and the control measure",
          ],
          formulas: [
            { name: "Range", expr: "range = maximum reading - minimum reading" },
          ],
          difficulty: "Foundation",
          hardPoints: "Distinguishing resolution, precision, accuracy and uncertainty.",
          examTips: "When asked for improvements, suggest specific apparatus or method changes, not vague phrases such as 'be more careful'.",
        }),
        chapter({
          id: "phy3c3", num: 3,
          title: { zh: "不确定度、有效数字与误差分析", en: "Uncertainties, Significant Figures and Error Analysis" },
          overview: { zh: "学习绝对不确定度、百分比不确定度、有效数字和误差传播。", en: "Covers absolute uncertainty, percentage uncertainty, significant figures and uncertainty propagation." },
          keyPoints: [
            "Absolute uncertainty has the same unit as the measured quantity",
            "Percentage uncertainty compares absolute uncertainty with the measured value",
            "For multiplication or division, percentage uncertainties are added",
            "For repeated readings, half the range can estimate uncertainty when appropriate",
            "Final answers should use a sensible number of significant figures based on data precision",
          ],
          formulas: [
            { name: "Percentage uncertainty", expr: "% uncertainty = absolute uncertainty / measured value x 100%" },
            { name: "Repeated readings uncertainty", expr: "uncertainty ≈ range / 2" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Combining uncertainties correctly; not reporting more significant figures than the data justifies.",
          examTips: "Show the uncertainty calculation separately before rounding the final answer.",
        }),
        chapter({
          id: "phy3c4", num: 4,
          title: { zh: "图像、梯度、截距与线性化", en: "Graphs, Gradients, Intercepts and Linearisation" },
          overview: { zh: "学习数据作图、最佳拟合线、梯度、截距和线性化处理。", en: "Covers plotting data, best-fit lines, gradients, intercepts and transforming relationships into linear form." },
          keyPoints: [
            "Graph axes should include quantity and unit, with sensible scales using most of the grid",
            "A best-fit line should balance points rather than join point-to-point",
            "Gradient should be calculated using a large triangle on the best-fit line",
            "The intercept can represent a physical constant or systematic offset",
            "Linearisation converts non-linear relationships into y = mx + c form",
          ],
          formulas: [
            { name: "Straight line", expr: "y = mx + c" },
            { name: "Gradient", expr: "m = Δy / Δx" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Identifying what to plot on each axis to produce a straight line.",
          examTips: "When finding a gradient, use two points on the line of best fit, not raw data points unless they lie on the line.",
        }),
        chapter({
          id: "phy3c5", num: 5,
          title: { zh: "实验评价与改进", en: "Evaluating Methods and Improving Experiments" },
          overview: { zh: "学习评价实验方法、数据质量、异常值和改进方案。", en: "Covers evaluating methods, data quality, anomalous results and practical improvements." },
          keyPoints: [
            "Evaluation should connect a weakness to its effect on data or conclusion",
            "Anomalous results should be identified using the pattern of the full data set",
            "Reliability improves with repeats and consistent measurements",
            "Validity improves when the method measures the intended quantity with controlled variables",
            "Improvements should be realistic within a school laboratory context",
          ],
          formulas: [],
          difficulty: "Intermediate",
          hardPoints: "Writing cause-and-effect evaluation rather than generic comments.",
          examTips: "Use this pattern: weakness, effect on result, specific improvement.",
        }),
        chapter({
          id: "phy3c6", num: 6,
          title: { zh: "Unit 1-2 核心实验复习", en: "Unit 1-2 Core Practical Review" },
          overview: { zh: "复习 Unit 1 和 Unit 2 的核心实验场景与常见考法。", en: "Reviews Unit 1 and Unit 2 core practical contexts and common examination demands." },
          keyPoints: [
            "Mechanics practicals often test timing, video analysis, light gates and force measurement",
            "Materials practicals often test diameter measurement, extension and force-extension graphs",
            "Waves practicals often test oscilloscope use, standing waves and diffraction grating measurements",
            "Electricity practicals often test circuit setup, meters, I-V graphs and resistivity",
            "Practical paper questions can use familiar or unfamiliar contexts, so method reasoning matters more than memorisation",
          ],
          formulas: [],
          difficulty: "Advanced",
          hardPoints: "Transferring a known practical skill into an unfamiliar context.",
          examTips: "Revise each core practical as aim, apparatus, method, data processing, uncertainty and improvements.",
        }),
      ],
    },

    Unit4: {
      id: "Unit4",
      title: { zh: "进阶力学、场与粒子", en: "Further Mechanics, Fields and Particles" },
      subtitle: { zh: "IA2 Unit 4 · WPH14/01", en: "IA2 Unit 4 · WPH14/01" },
      color: "#7C3AED",
      exam: { code: "WPH14/01", level: "IA2", duration: 105, marks: 90, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy4c1", num: 1,
          title: { zh: "冲量与二维动量", en: "Impulse and Momentum in Two Dimensions" },
          overview: { zh: "学习冲量、动量变化、二维动量守恒和矢量分解。", en: "Covers impulse, change in momentum, conservation of momentum in two dimensions and vector resolution." },
          keyPoints: [
            "Impulse equals force multiplied by time and also equals change in momentum",
            "Momentum conservation in two dimensions requires separate component equations",
            "Vector diagrams can represent before-and-after momentum in collisions",
            "Elastic and inelastic collisions differ by kinetic energy conservation, not momentum conservation",
            "Explosions are solved using total initial momentum and final vector components",
          ],
          formulas: [
            { name: "Impulse", expr: "FΔt = Δp" },
            { name: "Momentum", expr: "p = mv" },
          ],
          difficulty: "Advanced",
          hardPoints: "Resolving momentum vectors consistently in two perpendicular directions.",
          examTips: "Write separate x and y momentum equations and keep direction signs visible.",
        }),
        chapter({
          id: "phy4c2", num: 2,
          title: { zh: "圆周运动与向心力", en: "Circular Motion and Centripetal Force" },
          overview: { zh: "学习角速度、周期、向心加速度和向心力。", en: "Covers angular speed, period, centripetal acceleration and centripetal force." },
          keyPoints: [
            "Centripetal acceleration is directed towards the centre of the circle",
            "A centripetal force is not a new force; it is the resultant force towards the centre",
            "Angular speed links angle swept per unit time to period and frequency",
            "Circular motion questions often require identifying the physical force providing centripetal force",
            "Banked tracks, satellites and charged particles can be modelled using circular motion",
          ],
          formulas: [
            { name: "Angular speed", expr: "omega = 2 pi / T = 2 pi f" },
            { name: "Speed", expr: "v = omega r" },
            { name: "Centripetal acceleration", expr: "a = v^2 / r = r omega^2" },
            { name: "Centripetal force", expr: "F = mv^2 / r = mr omega^2" },
          ],
          difficulty: "Advanced",
          hardPoints: "Identifying the resultant radial force; separating tangential speed from angular speed.",
          examTips: "Start by drawing the direction of acceleration and writing 'resultant force toward centre = mv^2/r'.",
        }),
        chapter({
          id: "phy4c3", num: 3,
          title: { zh: "电场、电势与库仑定律", en: "Electric Fields, Coulomb's Law and Electric Potential" },
          overview: { zh: "学习电场强度、点电荷场、匀强电场、电势和电势能。", en: "Covers electric field strength, point-charge fields, uniform fields, electric potential and potential energy." },
          keyPoints: [
            "Electric field strength is force per unit positive charge",
            "Coulomb's law gives the force between point charges",
            "Field lines show the direction of force on a positive test charge",
            "Uniform electric fields can be modelled between parallel plates",
            "Electric potential is work done per unit charge in bringing a positive test charge from infinity",
            "Potential difference and field strength are linked in a uniform field",
          ],
          formulas: [
            { name: "Electric field strength", expr: "E = F / Q" },
            { name: "Coulomb's law", expr: "F = Q1 Q2 / (4 pi epsilon0 r^2)" },
            { name: "Point charge field", expr: "E = Q / (4 pi epsilon0 r^2)" },
            { name: "Uniform field", expr: "E = V / d" },
            { name: "Electric potential", expr: "V = Q / (4 pi epsilon0 r)" },
          ],
          difficulty: "Advanced",
          hardPoints: "Handling signs of charge and potential; distinguishing field strength from potential.",
          examTips: "Use field diagrams for direction and equations for magnitude. State whether a force is attractive or repulsive.",
        }),
        chapter({
          id: "phy4c4", num: 4,
          title: { zh: "电容与电容放电", en: "Capacitance and Capacitor Discharge" },
          overview: { zh: "学习电容、储能、RC 放电、指数衰减和半衰期类比。", en: "Covers capacitance, stored energy, RC discharge, exponential decay and log-linear analysis." },
          keyPoints: [
            "Capacitance is charge stored per unit potential difference",
            "A capacitor stores energy in the electric field between plates",
            "During discharge, charge, current and voltage decrease exponentially",
            "The time constant RC controls the rate of discharge",
            "Log-linear graphs can be used to determine capacitance or time constant",
          ],
          formulas: [
            { name: "Capacitance", expr: "C = Q / V" },
            { name: "Stored energy", expr: "W = 1/2 QV = 1/2 CV^2 = Q^2/(2C)" },
            { name: "Discharge", expr: "Q = Q0 e^(-t/RC), I = I0 e^(-t/RC), V = V0 e^(-t/RC)" },
          ],
          difficulty: "Advanced",
          hardPoints: "Interpreting exponential decay graphs; using natural logarithms to linearise discharge data.",
          examTips: "For discharge questions, identify whether the variable is Q, I or V; the same time constant applies.",
        }),
        chapter({
          id: "phy4c5", num: 5,
          title: { zh: "磁场与电磁感应", en: "Magnetic Fields and Electromagnetic Induction" },
          overview: { zh: "学习磁通密度、载流导线受力、带电粒子受力、法拉第定律和楞次定律。", en: "Covers magnetic flux density, forces on conductors and moving charges, Faraday's law and Lenz's law." },
          keyPoints: [
            "A current-carrying conductor in a magnetic field experiences a force depending on B, I, length and angle",
            "A moving charge in a magnetic field experiences a force at right angles to velocity and field",
            "Magnetic flux linkage changes induce an emf",
            "Faraday's law links induced emf to rate of change of flux linkage",
            "Lenz's law gives the direction of induced emf by opposing the change causing it",
          ],
          formulas: [
            { name: "Force on charge", expr: "F = Bqv sin(theta)" },
            { name: "Force on wire", expr: "F = BIl sin(theta)" },
            { name: "Faraday's law", expr: "emf = -N d(phi)/dt" },
          ],
          difficulty: "Advanced",
          hardPoints: "Determining force/emf direction; explaining the negative sign in Faraday's law physically.",
          examTips: "Always state the direction rule used. For induction explanations, explicitly mention 'opposes the change'.",
        }),
        chapter({
          id: "phy4c6", num: 6,
          title: { zh: "核物理与粒子物理", en: "Nuclear and Particle Physics" },
          overview: { zh: "学习质能关系、质量亏损、结合能、粒子轨迹和基本粒子概念。", en: "Covers mass-energy, mass defect, binding energy, particle tracks and fundamental particle ideas." },
          keyPoints: [
            "Mass defect corresponds to binding energy through mass-energy equivalence",
            "Binding energy per nucleon indicates nuclear stability",
            "Charged particles curve in magnetic fields and radius links momentum to charge and field strength",
            "Nuclear equations must conserve nucleon number, charge and energy",
            "Particle interactions can be interpreted using conservation laws",
          ],
          formulas: [
            { name: "Mass-energy", expr: "ΔE = c^2 Δm" },
            { name: "Particle in magnetic field", expr: "p = BQr" },
          ],
          difficulty: "Advanced",
          hardPoints: "Converting between mass units and energy; applying conservation laws in particle reactions.",
          examTips: "For nuclear calculations, keep units explicit and check whether energy is required in joules, eV or MeV.",
        }),
      ],
    },

    Unit5: {
      id: "Unit5",
      title: { zh: "热学、辐射、振动与宇宙学", en: "Thermodynamics, Radiation, Oscillations and Cosmology" },
      subtitle: { zh: "IA2 Unit 5 · WPH15/01", en: "IA2 Unit 5 · WPH15/01" },
      color: "#DC2626",
      exam: { code: "WPH15/01", level: "IA2", duration: 105, marks: 90, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy5c1", num: 1,
          title: { zh: "热能、比热容与潜热", en: "Thermal Energy, Specific Heat Capacity and Latent Heat" },
          overview: { zh: "学习温度变化、相变、比热容、比潜热和热量实验。", en: "Covers temperature change, phase change, specific heat capacity, specific latent heat and thermal practicals." },
          keyPoints: [
            "Specific heat capacity is energy required per kilogram per kelvin temperature change",
            "Specific latent heat is energy required per kilogram for a change of state without temperature change",
            "Thermal experiments must account for energy loss to surroundings",
            "Electrical heating methods use energy input from power multiplied by time",
            "Cooling corrections and insulation improve practical validity",
          ],
          formulas: [
            { name: "Heating", expr: "ΔE = mcΔtheta" },
            { name: "Latent heat", expr: "ΔE = LΔm" },
            { name: "Electrical input", expr: "E = VIt" },
          ],
          difficulty: "Intermediate",
          hardPoints: "Separating temperature change from change of state; explaining energy losses in practical work.",
          examTips: "State whether energy changes temperature or state. Do not use both c and L for the same process step.",
        }),
        chapter({
          id: "phy5c2", num: 2,
          title: { zh: "内能、理想气体与分子动理论", en: "Internal Energy, Ideal Gases and Kinetic Theory" },
          overview: { zh: "学习内能、绝对零度、理想气体方程和分子动理论。", en: "Covers internal energy, absolute zero, the ideal gas equation and molecular kinetic theory." },
          keyPoints: [
            "Internal energy is the sum of random molecular kinetic and potential energies",
            "Absolute temperature is proportional to average molecular kinetic energy for an ideal gas",
            "The ideal gas equation links pressure, volume, number of molecules and temperature",
            "Boyle's law can be investigated by measuring pressure and volume at constant temperature",
            "Kinetic theory explains pressure through molecular collisions with container walls",
          ],
          formulas: [
            { name: "Ideal gas equation", expr: "pV = NkT" },
            { name: "Molecular kinetic theory", expr: "1/2 m<c^2> = 3/2 kT" },
          ],
          difficulty: "Advanced",
          hardPoints: "Using kelvin temperature; explaining pressure microscopically with momentum changes.",
          examTips: "Convert Celsius to kelvin before gas calculations. Identify which variables are constant.",
        }),
        chapter({
          id: "phy5c3", num: 3,
          title: { zh: "核衰变、活度与半衰期", en: "Nuclear Decay, Activity and Half-Life" },
          overview: { zh: "学习核辐射性质、核方程、活度、衰变常数和半衰期。", en: "Covers nuclear radiation properties, nuclear equations, activity, decay constant and half-life." },
          keyPoints: [
            "Radioactive decay is spontaneous and random",
            "Activity is the rate of nuclear decay",
            "Half-life can be found graphically from count-rate or activity data",
            "Alpha, beta and gamma radiation differ in ionising ability, penetration and range",
            "Gamma absorption can be investigated using absorber thickness and corrected count rate",
          ],
          formulas: [
            { name: "Activity", expr: "A = lambda N" },
            { name: "Decay law", expr: "N = N0 e^(-lambda t), A = A0 e^(-lambda t)" },
            { name: "Half-life", expr: "lambda = ln 2 / t1/2" },
          ],
          difficulty: "Advanced",
          hardPoints: "Correcting for background radiation; using logarithmic decay equations.",
          examTips: "Subtract background count before analysis. For nuclear equations, check both nucleon number and charge.",
        }),
        chapter({
          id: "phy5c4", num: 4,
          title: { zh: "简谐运动", en: "Simple Harmonic Motion" },
          overview: { zh: "学习 SHM 条件、位移、速度、加速度、周期和相位。", en: "Covers the condition for SHM, displacement, velocity, acceleration, period and phase." },
          keyPoints: [
            "Simple harmonic motion requires acceleration proportional to displacement and directed towards equilibrium",
            "Displacement, velocity and acceleration vary sinusoidally with time",
            "Maximum speed occurs at equilibrium; maximum acceleration occurs at maximum displacement",
            "Mass-spring and simple pendulum periods depend on different physical quantities",
            "Energy transfers between kinetic and potential forms during SHM",
          ],
          formulas: [
            { name: "SHM condition", expr: "F = -kx, a = -omega^2 x" },
            { name: "Angular frequency", expr: "omega = 2 pi f = 2 pi / T" },
            { name: "Mass-spring period", expr: "T = 2 pi sqrt(m/k)" },
            { name: "Pendulum period", expr: "T = 2 pi sqrt(l/g)" },
          ],
          difficulty: "Advanced",
          hardPoints: "Interpreting phase relationships between displacement, velocity and acceleration.",
          examTips: "Use the SHM condition first in proof questions: acceleration must be proportional and opposite to displacement.",
        }),
        chapter({
          id: "phy5c5", num: 5,
          title: { zh: "阻尼、共振与振动能量", en: "Damping, Resonance and Oscillation Energy" },
          overview: { zh: "学习阻尼、受迫振动、共振、能量耗散和实际应用。", en: "Covers damping, forced oscillations, resonance, energy dissipation and practical applications." },
          keyPoints: [
            "Damping reduces amplitude by transferring energy from the oscillator to the surroundings",
            "Forced oscillations occur when an external periodic force drives a system",
            "Resonance occurs when driving frequency is close to natural frequency",
            "At resonance, energy transfer is maximised and amplitude can become large",
            "Damping reduces peak amplitude and broadens the resonance response",
          ],
          formulas: [
            { name: "Oscillation energy trend", expr: "total energy proportional to amplitude^2" },
          ],
          difficulty: "Advanced",
          hardPoints: "Explaining resonance using energy transfer, not just frequency matching.",
          examTips: "In application questions, state whether resonance is useful or dangerous and explain the design response.",
        }),
        chapter({
          id: "phy5c6", num: 6,
          title: { zh: "引力场与轨道", en: "Gravitational Fields and Orbits" },
          overview: { zh: "学习引力场强、万有引力、引力势、轨道运动和卫星。", en: "Covers gravitational field strength, Newton's law of gravitation, gravitational potential, orbital motion and satellites." },
          keyPoints: [
            "Gravitational field strength is force per unit mass",
            "Newton's law of gravitation is an inverse-square law",
            "Gravitational potential is negative when zero is defined at infinity",
            "Circular orbital motion is maintained by gravitational force as centripetal force",
            "Orbital period depends on orbital radius and central mass",
          ],
          formulas: [
            { name: "Gravitational field strength", expr: "g = F / m = GM / r^2" },
            { name: "Gravitational force", expr: "F = Gm1m2 / r^2" },
            { name: "Gravitational potential", expr: "Vgrav = -GM / r" },
          ],
          difficulty: "Advanced",
          hardPoints: "Handling negative potential; combining gravitation with circular motion equations.",
          examTips: "For orbit questions, set gravitational force equal to centripetal force and cancel mass where appropriate.",
        }),
        chapter({
          id: "phy5c7", num: 7,
          title: { zh: "天体物理与宇宙学", en: "Astrophysics and Cosmology" },
          overview: { zh: "学习恒星辐射、维恩定律、斯特藩-玻尔兹曼定律、红移和宇宙膨胀。", en: "Covers stellar radiation, Wien's law, Stefan-Boltzmann law, redshift and expansion of the universe." },
          keyPoints: [
            "A black body is an ideal emitter and absorber of radiation",
            "Wien's law links peak wavelength to temperature",
            "Stefan-Boltzmann law links luminosity to surface area and temperature",
            "Redshift provides evidence for galaxies moving away from us",
            "Hubble's law supports the expanding universe model",
          ],
          formulas: [
            { name: "Stefan-Boltzmann law", expr: "L = sigma A T^4" },
            { name: "Wien's law", expr: "lambdaMax T = 2.898 x 10^-3 m K" },
            { name: "Radiation intensity", expr: "I = L / (4 pi d^2)" },
          ],
          difficulty: "Advanced",
          hardPoints: "Distinguishing luminosity, intensity and flux; interpreting redshift evidence.",
          examTips: "Track whether a question asks about source output luminosity or received intensity at distance.",
        }),
      ],
    },

    Unit6: {
      id: "Unit6",
      title: { zh: "物理实验技能 II", en: "Practical Skills in Physics II" },
      subtitle: { zh: "IA2 Unit 6 · WPH16/01", en: "IA2 Unit 6 · WPH16/01" },
      color: "#EA580C",
      exam: { code: "WPH16/01", level: "IA2", duration: 80, marks: 50, availability: "January, June, October" },
      chapters: [
        chapter({
          id: "phy6c1", num: 1,
          title: { zh: "进阶实验设计与风险控制", en: "Advanced Practical Planning and Risk Management" },
          overview: { zh: "学习 IA2 实验设计、变量控制、仪器选择和风险控制。", en: "Covers IA2 practical planning, variable control, apparatus choice and risk management." },
          keyPoints: [
            "Advanced plans should justify apparatus, measurement range and precision",
            "Risk controls must be specific to hazards such as high voltage, heat, radiation or moving masses",
            "Control variables should be linked to the equation or physical model being tested",
            "A valid method must produce data that can answer the stated aim",
            "Repeatability and reproducibility should be considered separately where relevant",
          ],
          formulas: [],
          difficulty: "Advanced",
          hardPoints: "Writing a complete method under time pressure while including safety and validity.",
          examTips: "Structure planning answers as aim, variables, apparatus, method, safety, data processing and improvements.",
        }),
        chapter({
          id: "phy6c2", num: 2,
          title: { zh: "进阶不确定度与百分比不确定度", en: "Advanced Uncertainties and Percentage Uncertainty" },
          overview: { zh: "学习复合量不确定度、百分比不确定度、重复读数和图像不确定度。", en: "Covers uncertainty in compound quantities, percentage uncertainty, repeated readings and graphical uncertainty." },
          keyPoints: [
            "Percentage uncertainty is added for multiplication, division and powers",
            "Powers multiply percentage uncertainty by the power value",
            "Repeated readings help estimate random uncertainty and identify anomalies",
            "Gradient uncertainty can be estimated using steepest and shallowest acceptable lines",
            "Dominant uncertainty should guide practical improvements",
          ],
          formulas: [
            { name: "Power uncertainty", expr: "if y = x^n, % uncertainty in y = n x % uncertainty in x" },
            { name: "Gradient uncertainty", expr: "% uncertainty = (max gradient - min gradient) / best gradient x 100%" },
          ],
          difficulty: "Advanced",
          hardPoints: "Combining uncertainties in derived quantities; estimating graph uncertainty consistently.",
          examTips: "Name the measurement with the largest percentage uncertainty and propose a targeted improvement.",
        }),
        chapter({
          id: "phy6c3", num: 3,
          title: { zh: "数据处理、梯度与对数线性化", en: "Data Processing, Gradients and Log-Linear Relationships" },
          overview: { zh: "学习 IA2 常见数据处理、指数关系、对数图线和模型验证。", en: "Covers IA2 data processing, exponential relationships, logarithmic graphs and model validation." },
          keyPoints: [
            "Exponential decay relationships can be linearised by taking natural logarithms",
            "A straight-line graph can confirm whether the proposed physical model is supported",
            "Gradient and intercept should be linked back to constants in the model",
            "Units of gradient and intercept follow from plotted axis quantities",
            "Outliers should be discussed in relation to trend and experimental conditions",
          ],
          formulas: [
            { name: "Exponential linearisation", expr: "y = y0 e^(-kx) -> ln y = ln y0 - kx" },
            { name: "Straight line model", expr: "Y = mX + c" },
          ],
          difficulty: "Advanced",
          hardPoints: "Choosing transformed axes that match the physics equation.",
          examTips: "Write the physics equation and the matching Y = mX + c form before interpreting gradient.",
        }),
        chapter({
          id: "phy6c4", num: 4,
          title: { zh: "系统误差、随机误差与方法评价", en: "Systematic Error, Random Error and Method Evaluation" },
          overview: { zh: "学习系统误差、随机误差、准确度、精密度和方法评价。", en: "Covers systematic error, random error, accuracy, precision and method evaluation." },
          keyPoints: [
            "Random errors cause scatter and can be reduced by repeats",
            "Systematic errors bias all readings and require calibration or method correction",
            "Accuracy describes closeness to the true value; precision describes spread of repeated values",
            "A strong evaluation explains how a limitation changes the final calculated result",
            "Method improvements should be specific, measurable and linked to the key uncertainty",
          ],
          formulas: [],
          difficulty: "Advanced",
          hardPoints: "Explaining the direction of effect on the calculated result.",
          examTips: "Avoid generic evaluation. Link every limitation to a measured quantity or calculated constant.",
        }),
        chapter({
          id: "phy6c5", num: 5,
          title: { zh: "Unit 4-5 核心实验复习", en: "Unit 4-5 Core Practical Review" },
          overview: { zh: "复习 Unit 4 和 Unit 5 的核心实验场景与常见考法。", en: "Reviews Unit 4 and Unit 5 core practical contexts and common examination demands." },
          keyPoints: [
            "Field practicals often test current balance, magnetic flux density and capacitor discharge",
            "Thermal practicals often test heat loss, insulation and sensor calibration",
            "Gas practicals often test pressure-volume relationships and constant-temperature assumptions",
            "Nuclear practicals require background correction and safe handling logic",
            "Oscillation practicals require timing strategy, repeated periods and damping awareness",
          ],
          formulas: [],
          difficulty: "Advanced",
          hardPoints: "Applying core practical reasoning to unfamiliar experimental setups.",
          examTips: "For each practical, revise the expected graph, gradient meaning and largest uncertainty source.",
        }),
        chapter({
          id: "phy6c6", num: 6,
          title: { zh: "实验卷答题结构", en: "Practical Exam Response Structure" },
          overview: { zh: "训练 WPH16 实验卷中的设计、计算、图像、评价和改进答题结构。", en: "Practises structured responses for design, calculation, graph, evaluation and improvement questions in WPH16." },
          keyPoints: [
            "Planning answers should be sequential enough to be repeatable",
            "Calculation answers should show substitutions, units and appropriate significant figures",
            "Graph answers should refer to scale, best-fit line, gradient and uncertainty where relevant",
            "Evaluation answers need a limitation, consequence and improvement",
            "Conclusion answers should refer back to the aim and data evidence",
          ],
          formulas: [],
          difficulty: "Advanced",
          hardPoints: "Selecting the level of detail required by the command word.",
          examTips: "Use command words carefully: describe, explain, determine, evaluate and suggest require different answer styles.",
        }),
      ],
    },
  },
}

export default PHYSICS_SUBJECT
