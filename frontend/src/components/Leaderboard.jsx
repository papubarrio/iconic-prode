import { S, B, calcPoints } from "../styles";
import { useIsMobile } from "../hooks";

export default function Leaderboard({ allBets, results, currentUser }) {
  const isMobile = useIsMobile();
  const scores = {};
  allBets.forEach(bet => {
    const result = results.find(r => r.match_id === bet.match_id);
    const pts = calcPoints(bet.home_score, bet.away_score, result?.home_score, result?.away_score);
    if (!scores[bet.user_id]) {
      scores[bet.user_id] = { display_name: bet.display_name, pts: 0, exact: 0, winner: 0 };
    }
    if (pts !== null) {
      scores[bet.user_id].pts += pts;
      if (pts === 3) scores[bet.user_id].exact++;
      if (pts === 1) scores[bet.user_id].winner++;
    }
  });

  const board = Object.entries(scores)
    .map(([uid, s]) => ({ uid: parseInt(uid), ...s }))
    .sort((a, b) => b.pts - a.pts);

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardHeaderTitle}>Tabla de posiciones</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
          {board.length} participantes
        </span>
      </div>

      {board.length === 0 && (
        <div style={{ padding: 32, textAlign: "center", color: B.gray50, fontSize: 14 }}>
          Todavía no hay resultados confirmados. ¡Las posiciones aparecerán al cierre de los primeros partidos!
        </div>
      )}

      {board.length > 0 && (
        <div style={{ padding: "16px 20px", background: B.bluePale, borderBottom: `1px solid ${B.grayBorder}`, display: "grid", gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.blue }}>Premios para los 3 primeros puestos</div>
          <div style={{ fontSize: 13, color: B.gray70, lineHeight: 1.5 }}>
            <strong>1er puesto:</strong> Camiseta original titular de la Selección Argentina + Caja de Champagne Salentein Brut Nature. <a href="https://www.adidas.com.ar/camiseta-titular-de-la-seleccion-argentina-26/JM5900.html" target="_blank" rel="noreferrer" style={{ color: B.blue }}>Ver</a>
          </div>
          <div style={{ fontSize: 13, color: B.gray70, lineHeight: 1.5 }}>
            <strong>2do puesto:</strong> Pelota de fútbol Trionda de la Copa del Mundo + Caja de vino Salentein Reserva. <a href="https://www.adidas.com.ar/pelota-trionda-league-copa-mundial-de-la-fifa-26/JD8030.html" target="_blank" rel="noreferrer" style={{ color: B.blue }}>Ver</a>
          </div>
          <div style={{ fontSize: 13, color: B.gray70, lineHeight: 1.5 }}>
            <strong>3er puesto:</strong> Set de mate + Caja de Vino El Portillo. <a href="https://www.mercadolibre.com.ar/set-matero-termo-mate-y-bombilla-ozz-color-negro/p/MLA65933359?pdp_filters=item_id:MLA2901055438#is_advertising=true&searchVariation=MLA65933359&backend_model=search-backend&be_origin=backend&position=1&search_layout=grid&type=pad&tracking_id=25eddca5-4a8c-4e63-863b-f1c499ccb7bd&ad_domain=VQCATCORE_LST&ad_position=1&ad_click_id=MGM0MTVhZDUtZDZhYi00YjdiLWI3ZjItYTk5NDM4MjA2YWUz" target="_blank" rel="noreferrer" style={{ color: B.blue }}>Ver</a>
          </div>
        </div>
      )}

      {board.map((p, i) => (
        <div key={p.uid} style={{ ...S.podiumRow(i + 1), padding: isMobile ? "12px 14px" : "14px 20px" }}>
          <div style={{ ...S.rankNum(i + 1), marginRight: isMobile ? 10 : 16 }}>
            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
          </div>
          <div style={{ ...S.playerName, fontSize: isMobile ? 13 : 15 }}>
            {p.display_name}
            {p.uid === currentUser.id && (
              <span style={{ fontSize: 12, color: B.blue, fontWeight: 700, marginLeft: 6, background: B.bluePale, borderRadius: 10, padding: "1px 7px" }}>vos</span>
            )}
            {isMobile && (
              <div style={{ fontSize: 12, color: B.gray50, marginTop: 2 }}>
                🎯 {p.exact} · ✓ {p.winner}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ ...S.ptsTotal, fontSize: isMobile ? 18 : 22 }}>{p.pts}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: B.gray50, marginLeft: 3, alignSelf: "flex-end", paddingBottom: 2 }}>pts</span>
            </div>
            {!isMobile && (
              <div style={{ fontSize: 13, color: B.gray50, marginTop: 2 }}>
                🎯 {p.exact} exactos · ✓ {p.winner} ganadores
              </div>
            )}
          </div>
        </div>
      ))}

      {board.length > 0 && (
        <div style={{ padding: "12px 20px", background: B.bluePale, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, color: B.blue, fontWeight: 600 }}>🎯 Resultado exacto = <strong>3 pts</strong></div>
          <div style={{ fontSize: 14, color: B.blue, fontWeight: 600 }}>✓ Ganador/empate correcto = <strong>1 pt</strong></div>
          <div style={{ fontSize: 14, color: B.blue, fontWeight: 600 }}>✗ Incorrecto = <strong>0 pts</strong></div>
        </div>
      )}
    </div>
  );
}
