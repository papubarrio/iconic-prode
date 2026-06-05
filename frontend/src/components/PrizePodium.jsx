import { S, B } from "../styles";
import { useIsMobile } from "../hooks";

const prizes = [
  { rank: 1, medal: "🥇", title: "1st Place", amount: "$150", color: "#b8860b", bg: "#fffbea", border: "#f0c040" },
  { rank: 2, medal: "🥈", title: "2nd Place", amount: "$75",  color: "#5a7a8a", bg: "#f0f6fa", border: "#9ab8c8" },
  { rank: 3, medal: "🥉", title: "3rd Place", amount: "$25",  color: "#8a6040", bg: "#fdf6f0", border: "#c8a070" },
];

function GiftCardTicket({ prize, isMobile }) {
  return (
    <div
      style={{
        flex: isMobile ? "none" : 1,
        minWidth: isMobile ? "auto" : 180,
        maxWidth: isMobile ? "100%" : 280,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
        border: `2px dashed ${prize.border}`,
        background: prize.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header strip */}
      <div
        style={{
          background: prize.color,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 22 }}>{prize.medal}</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
          {prize.title}
        </span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>🎁</span>
      </div>

      {/* Perforated divider */}
      <div
        style={{
          borderTop: `2px dashed ${prize.border}`,
          margin: "0 16px",
        }}
      />

      {/* Body */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          flex: 1,
        }}
      >
        <div style={{ color: prize.color, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
          Gift Card
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, color: prize.color, lineHeight: 1.1 }}>
          {prize.amount}
        </div>
        <div style={{ color: "#aaa", fontSize: 11 }}>
          · · · · · · · · · · · · ·
        </div>
        <div style={{ color: "#888", fontSize: 11, letterSpacing: 1 }}>
          ICONIC WORKSPACES
        </div>
      </div>
    </div>
  );
}

export default function PrizePodium() {
  const isMobile = useIsMobile();

  return (
    <div style={{ ...S.card, marginBottom: 20 }}>
      <div style={S.cardHeader}>
        <span style={S.cardHeaderTitle}>Prizes</span>
      </div>
      <div style={{ padding: "20px", display: "grid", gap: 18 }}>
        <div style={{ color: B.gray70, fontSize: 13, lineHeight: 1.6 }}>
          The top 3 predictors win an Iconic Workspaces gift card. Total prize pool: <strong>$250</strong>.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "stretch",
            gap: 14,
            justifyContent: "center",
          }}
        >
          {prizes.map((prize) => (
            <GiftCardTicket key={prize.rank} prize={prize} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </div>
  );
}
