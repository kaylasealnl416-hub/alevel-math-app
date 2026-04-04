/**
 * Desmos 数学图形嵌入组件
 * 根据章节 ID 自动匹配预设的交互式图形，仅数学科目显示
 */

const DESMOS_GRAPHS = {
  p1c2: {
    title: "Interactive: Quadratic Functions",
    desc: "Drag sliders to explore how a, b, c affect the parabola y = ax² + bx + c.",
    url: "https://www.desmos.com/calculator/fun1gu0mce",
  },
  p1c4: {
    title: "Interactive: Graph Transformations",
    desc: "See how translations, stretches and reflections transform a function.",
    url: "https://www.desmos.com/calculator/5vkqhoa0ij",
  },
  p1c5: {
    title: "Interactive: Straight Lines",
    desc: "Explore gradient, y-intercept, and parallel/perpendicular lines.",
    url: "https://www.desmos.com/calculator/jru8msfxlr",
  },
  p1c6: {
    title: "Interactive: Trigonometric Functions",
    desc: "Visualise sin, cos and tan on the unit circle and as graphs.",
    url: "https://www.desmos.com/calculator/rnqhgewtrs",
  },
  p1c8: {
    title: "Interactive: Differentiation & Tangent Lines",
    desc: "See how the gradient of a tangent line changes along a curve.",
    url: "https://www.desmos.com/calculator/i1fxrksph0",
  },
  p1c9: {
    title: "Interactive: Integration & Area Under Curves",
    desc: "Visualise definite integrals as the area between a curve and the x-axis.",
    url: "https://www.desmos.com/calculator/tgyr42ozjt",
  },
  p2c2: {
    title: "Interactive: Circle Equations",
    desc: "Explore (x-a)² + (y-b)² = r² by dragging the centre and radius.",
    url: "https://www.desmos.com/calculator/psokl6nyij",
  },
  p2c3: {
    title: "Interactive: Exponentials & Logarithms",
    desc: "Compare exponential growth/decay with logarithmic curves.",
    url: "https://www.desmos.com/calculator/3yihbqkbfn",
  },
  p2c6: {
    title: "Interactive: Trigonometric Identities",
    desc: "Visualise sin²x + cos²x = 1 and other key identities.",
    url: "https://www.desmos.com/calculator/rnqhgewtrs",
  },
  p3c2: {
    title: "Interactive: Functions & Inverses",
    desc: "Explore composite functions and see how a function relates to its inverse.",
    url: "https://www.desmos.com/calculator/h1gkxmkjhp",
  },
  p4c6: {
    title: "Interactive: Polar Coordinates",
    desc: "Plot polar curves like r = a + b·cos(θ) and explore cardioids and roses.",
    url: "https://www.desmos.com/calculator/mp3tsrqwkm",
  },
};

export default function DesmosEmbed({ chapterId }) {
  const graph = DESMOS_GRAPHS[chapterId];
  if (!graph) return null;

  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: "#e8f0fe",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>
          📊
        </div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#202124" }}>
          {graph.title}
        </h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5f6368", lineHeight: 1.6 }}>
        {graph.desc}
      </p>
      <div style={{
        width: "100%", aspectRatio: "16/9", borderRadius: 12,
        overflow: "hidden", border: "1px solid #dadce0", background: "#fff",
      }}>
        <iframe
          src={graph.url}
          title={graph.title}
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          loading="lazy"
        />
      </div>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <a
          href={graph.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#1a73e8", textDecoration: "none", fontWeight: 500 }}
        >
          Open in Desmos →
        </a>
      </div>
    </section>
  );
}
