export function FacePortrait({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 400" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="faceSkin" cx="45%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#e8c3a0" />
          <stop offset="55%" stopColor="#d9ab85" />
          <stop offset="100%" stopColor="#b98a66" />
        </radialGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b1a12" />
          <stop offset="100%" stopColor="#3d2818" />
        </linearGradient>
        <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d98b73" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d98b73" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2332" />
          <stop offset="100%" stopColor="#0d131f" />
        </linearGradient>
      </defs>

      <rect width="300" height="400" fill="url(#bgGrad)" />

      {/* shoulders */}
      <path d="M40 400 Q60 320 150 315 Q240 320 260 400 Z" fill="#33415c" />

      {/* neck */}
      <path d="M128 280 L128 320 Q150 335 172 320 L172 280 Z" fill="url(#faceSkin)" />

      {/* hair back */}
      <path
        d="M68 175 Q60 90 150 68 Q240 90 232 175 Q234 220 224 240 L218 190 Q215 140 150 128 Q85 140 82 190 L76 240 Q66 220 68 175 Z"
        fill="url(#hairGrad)"
      />

      {/* face shape */}
      <path
        d="M150 90 Q210 92 216 165 Q219 230 195 268 Q175 296 150 297 Q125 296 105 268 Q81 230 84 165 Q90 92 150 90 Z"
        fill="url(#faceSkin)"
      />

      {/* ears */}
      <ellipse cx="83" cy="185" rx="7" ry="14" fill="#d9ab85" />
      <ellipse cx="217" cy="185" rx="7" ry="14" fill="#d9ab85" />

      {/* cheek blush */}
      <ellipse cx="115" cy="215" rx="20" ry="14" fill="url(#cheekBlush)" />
      <ellipse cx="185" cy="215" rx="20" ry="14" fill="url(#cheekBlush)" />

      {/* eyebrows */}
      <path d="M108 168 Q123 158 140 165" stroke="#2b1a12" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M160 165 Q177 158 192 168" stroke="#2b1a12" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* eye sockets shading */}
      <ellipse cx="122" cy="188" rx="17" ry="10" fill="#00000010" />
      <ellipse cx="178" cy="188" rx="17" ry="10" fill="#00000010" />

      {/* eyes (sclera) */}
      <ellipse cx="122" cy="188" rx="14" ry="8" fill="#fdfaf6" />
      <ellipse cx="178" cy="188" rx="14" ry="8" fill="#fdfaf6" />

      {/* iris */}
      <circle cx="122" cy="188" r="5.5" fill="#4a3320" />
      <circle cx="178" cy="188" r="5.5" fill="#4a3320" />
      {/* pupil */}
      <circle cx="122" cy="188" r="2.4" fill="#150c06" />
      <circle cx="178" cy="188" r="2.4" fill="#150c06" />
      {/* eye highlight */}
      <circle cx="119.5" cy="185.5" r="1.2" fill="#ffffff" opacity="0.85" />
      <circle cx="175.5" cy="185.5" r="1.2" fill="#ffffff" opacity="0.85" />

      {/* upper lids */}
      <path d="M108 186 Q122 180 136 186" stroke="#b98a66" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M164 186 Q178 180 192 186" stroke="#b98a66" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* nose */}
      <path
        d="M150 185 Q146 215 141 227 Q150 234 159 227 Q154 215 150 185"
        fill="#c99872"
        opacity="0.55"
      />
      <ellipse cx="143" cy="228" rx="2.5" ry="1.6" fill="#a97a57" opacity="0.5" />
      <ellipse cx="157" cy="228" rx="2.5" ry="1.6" fill="#a97a57" opacity="0.5" />

      {/* lips */}
      <path
        d="M128 254 Q150 248 172 254 Q160 268 150 268 Q140 268 128 254 Z"
        fill="#a85f52"
      />
      <path d="M132 254 Q150 250 168 254" stroke="#8a4438" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* hair front */}
      <path
        d="M70 172 Q66 110 100 82 Q125 62 150 62 Q175 62 200 82 Q234 110 230 172 Q222 140 200 122 Q205 148 198 165 Q188 130 168 112 Q172 138 160 155 Q158 128 150 118 Q142 128 140 155 Q128 138 132 112 Q112 130 102 165 Q95 148 100 122 Q78 140 70 172 Z"
        fill="url(#hairGrad)"
      />
    </svg>
  );
}
