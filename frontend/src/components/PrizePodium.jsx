import { S, B } from "../styles";
import { useIsMobile } from "../hooks";

const prizes = [
  {
    rank: 1,
    medal: "🥇",
    title: "1st Place",
    description: "TBD — Stay tuned for an amazing prize!",
    images: [],
  },
  {
    rank: 2,
    medal: "🥈",
    title: "2nd Place",
    description: "TBD — Stay tuned for an amazing prize!",
    images: [],
  },
  {
    rank: 3,
    medal: "🥉",
    title: "3rd Place",
    description: "TBD — Stay tuned for an amazing prize!",
    images: [],
  },
];

export default function PrizePodium() {
  const isMobile = useIsMobile();

  return (
    <div style={{ ...S.card, marginBottom: 20 }}>
      <div style={S.cardHeader}>
        <span style={S.cardHeaderTitle}>Prizes</span>
      </div>
      <div style={{ padding: "20px", display: "grid", gap: 18 }}>
        <div style={{ color: B.gray70, fontSize: 13, lineHeight: 1.6 }}>
          The top 3 predictors at the end of the tournament win special prizes. Stay tuned for the full prize reveal!
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
            <div
              key={prize.rank}
              style={{
                ...S.card,
                border: `2px solid ${prize.rank === 1 ? B.gold : prize.rank === 2 ? B.blueLight : B.grayBorder}`,
                padding: 16,
                flex: isMobile ? "none" : 1,
                minWidth: isMobile ? "auto" : 200,
                maxWidth: isMobile ? "100%" : 300,
                boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36 }}>{prize.medal}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#2a2a2a" }}>{prize.title}</div>
              <div style={{ color: B.gray70, fontSize: 13, lineHeight: 1.5 }}>
                {prize.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
