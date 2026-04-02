'use client'

type ParcaTip = 'lb' | 'b' | 'deg'

interface Props {
  secilenParcalar: Record<string, ParcaTip>
  onToggle: (id: string) => void
  paintMode: ParcaTip
}

const PARCALAR = [
  { id: 'kaput', label: 'Kaput', d: 'M52,88 L52,108 Q52,114 58,116 L96,118 L96,88 Z', cx: 74, cy: 102 },
  { id: 'on-tampon', label: 'Ön T.', d: 'M52,108 Q52,120 60,122 L96,122 L96,118 L58,116 Z', cx: 74, cy: 119 },
  { id: 'sol-on-camurluk', label: '', d: 'M52,88 L52,108 L58,108 L66,88 Z', cx: 55, cy: 98 },
  { id: 'sol-on-kapi', label: 'Sol Ön', d: 'M96,72 L96,118 L140,118 L140,72 Z', cx: 118, cy: 95 },
  { id: 'sol-arka-kapi', label: 'Sol Arka', d: 'M140,72 L140,118 L182,118 L182,72 Z', cx: 161, cy: 95 },
  { id: 'sol-arka-camurluk', label: '', d: 'M182,72 L182,118 L192,116 Q198,114 198,108 L198,88 Z', cx: 188, cy: 98 },
  { id: 'tavan', label: 'Tavan', d: 'M96,36 Q100,24 150,22 Q200,24 204,36 L204,72 L96,72 Z', cx: 150, cy: 50 },
  { id: 'bagaj', label: 'Bagaj', d: 'M204,88 L204,118 L242,116 Q248,114 248,108 L248,88 Z', cx: 226, cy: 102 },
  { id: 'arka-tampon', label: 'Arka T.', d: 'M204,118 L204,122 L240,122 Q248,120 248,108 L242,116 Q248,114 248,108 Z', cx: 226, cy: 119 },
  { id: 'sag-on-camurluk', label: '', d: 'M248,88 L242,88 L234,108 L248,108 Z', cx: 244, cy: 98 },
  { id: 'sag-on-kapi', label: 'Sağ Ön', d: 'M160,72 L160,118 L204,118 L204,72 Z', cx: 182, cy: 95 },
  { id: 'sag-arka-kapi', label: 'Sağ Arka', d: 'M118,72 L118,118 L160,118 L160,72 Z', cx: 139, cy: 95 },
]

const RENKLER: Record<ParcaTip, string> = { lb: '#E8892A', b: '#378ADD', deg: '#E24B4A' }
const STROKE: Record<ParcaTip, string> = { lb: '#c06818', b: '#1a5fa0', deg: '#b02020' }

export default function CarMap({ secilenParcalar, onToggle, paintMode }: Props) {
  return (
    <svg viewBox="0 0 300 148" className="w-full select-none" style={{ touchAction: 'manipulation' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Arkaplan gövde */}
      <path d="M52,88 Q52,60 60,52 L90,36 Q110,22 150,20 Q190,22 210,36 L240,52 Q248,60 248,88 L248,112 Q248,122 238,124 L62,124 Q52,122 52,112 Z"
        fill="#1a1a18" stroke="#2a2a26" strokeWidth="1"/>

      {/* Camlar */}
      <path d="M98,36 Q102,24 150,22 Q198,24 202,36 L202,70 L98,70 Z"
        fill="#0d1a2a" stroke="#1a2d42" strokeWidth="0.6"/>
      <line x1="150" y1="22" x2="150" y2="70" stroke="#1a2d42" strokeWidth="0.5"/>
      <path d="M100,38 L148,38 L148,68 L102,68 Z" fill="#0a1520" opacity="0.5"/>
      <path d="M152,38 L200,38 L198,68 L152,68 Z" fill="#0a1520" opacity="0.5"/>

      {/* Tekerlekler */}
      <ellipse cx="92" cy="130" rx="18" ry="10" fill="#111" stroke="#2a2a26" strokeWidth="0.8"/>
      <ellipse cx="208" cy="130" rx="18" ry="10" fill="#111" stroke="#2a2a26" strokeWidth="0.8"/>
      <ellipse cx="92" cy="130" rx="10" ry="6" fill="#1a1a18" stroke="#333" strokeWidth="0.5"/>
      <ellipse cx="208" cy="130" rx="10" ry="6" fill="#1a1a18" stroke="#333" strokeWidth="0.5"/>
      <ellipse cx="92" cy="130" rx="4" ry="2.5" fill="#242422"/>
      <ellipse cx="208" cy="130" rx="4" ry="2.5" fill="#242422"/>

      {/* Far ve stop */}
      <path d="M52,90 Q50,88 50,94 L52,96 Z" fill="#E8D44D" opacity="0.6"/>
      <path d="M248,90 Q250,88 250,94 L248,96 Z" fill="#E24B4A" opacity="0.6"/>

      {/* Parçalar */}
      {PARCALAR.map(({ id, label, d, cx, cy }) => {
        const tip = secilenParcalar[id]
        return (
          <g key={id} onClick={() => onToggle(id)} style={{ cursor: 'pointer' }}>
            <path d={d}
              fill={tip ? RENKLER[tip] : 'transparent'}
              stroke={tip ? STROKE[tip] : 'rgba(255,255,255,0.08)'}
              strokeWidth={tip ? '0.8' : '0.5'}
              opacity={tip ? 0.85 : 1}
            />
            {/* Hover alanı şeffaf */}
            <path d={d} fill="transparent" stroke="none"
              style={{ cursor: 'pointer' }}
            />
            {label && tip && (
              <text x={cx} y={cy + 3} textAnchor="middle"
                fill="rgba(255,255,255,0.7)" fontSize="6"
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {label}
              </text>
            )}
          </g>
        )
      })}

      {/* Orta çizgi */}
      <line x1="96" y1="70" x2="204" y2="70" stroke="#2a2a26" strokeWidth="0.4"/>
      <line x1="96" y1="118" x2="204" y2="118" stroke="#2a2a26" strokeWidth="0.4"/>
      <line x1="140" y1="70" x2="140" y2="118" stroke="#2a2a26" strokeWidth="0.4"/>
      <line x1="182" y1="70" x2="182" y2="118" stroke="#2a2a26" strokeWidth="0.4"/>
      <line x1="160" y1="70" x2="160" y2="118" stroke="#2a2a26" strokeWidth="0.4"/>
      <line x1="118" y1="70" x2="118" y2="118" stroke="#2a2a26" strokeWidth="0.4"/>

      <text x="150" y="145" textAnchor="middle" fill="#3a3a36" fontSize="6.5">
        parçaya tıkla → işaretle
      </text>
    </svg>
  )
}
