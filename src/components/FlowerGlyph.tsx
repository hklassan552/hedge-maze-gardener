import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import type { FlowerShape, FlowerSpecies } from '../constants/flowerSpecies';

/** Petal counts and silhouettes differ per species, so colour is never the only cue. */
const PETALS: Record<FlowerShape, { count: number; rx: number; ry: number; dist: number }> = {
  daisy: { count: 8, rx: 7, ry: 13, dist: 17 },
  clover: { count: 3, rx: 13, ry: 13, dist: 13 },
  buttercup: { count: 5, rx: 11, ry: 14, dist: 15 },
  forgetmenot: { count: 5, rx: 9, ry: 9, dist: 15 },
  poppy: { count: 4, rx: 15, ry: 15, dist: 13 },
  violet: { count: 5, rx: 10, ry: 12, dist: 15 },
  iris: { count: 6, rx: 7, ry: 16, dist: 16 },
  rose: { count: 0, rx: 0, ry: 0, dist: 0 },
  sunflower: { count: 12, rx: 4, ry: 16, dist: 18 },
  bluebell: { count: 3, rx: 9, ry: 15, dist: 14 },
};

/** Vector species badge, drawn with the same system as the rest of the interface. */
function FlowerGlyph({
  species,
  size,
  muted,
}: {
  species: FlowerSpecies;
  size: number;
  muted?: boolean;
}) {
  const spec = PETALS[species.id];
  const petal = muted ? 'none' : species.petal;
  const stroke = muted ? '#A7B8A2' : species.petal;
  const centre = muted ? 'none' : species.centre;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <G>
        {species.id === 'rose' ? (
          <G>
            <Circle cx={24} cy={24} r={18} fill={petal} stroke={stroke} strokeWidth={2} />
            <Circle cx={24} cy={24} r={12} fill={muted ? 'none' : species.centre} stroke={stroke} strokeWidth={2} />
            <Circle cx={24} cy={24} r={6} fill={petal} stroke={stroke} strokeWidth={2} />
          </G>
        ) : (
          Array.from({ length: spec.count }).map((_, i) => {
            const angle = (360 / spec.count) * i;
            const rad = ((angle - 90) * Math.PI) / 180;
            const cx = 24 + Math.cos(rad) * spec.dist * (species.id === 'bluebell' ? 0.6 : 0.55);
            const cy =
              24 +
              Math.sin(rad) * spec.dist * (species.id === 'bluebell' ? 0.6 : 0.55) +
              (species.id === 'bluebell' ? 6 : 0);
            return (
              <Ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={spec.rx}
                ry={spec.ry}
                fill={petal}
                stroke={stroke}
                strokeWidth={2}
                rotation={angle}
                originX={cx}
                originY={cy}
              />
            );
          })
        )}
        {species.id !== 'rose' ? (
          <Circle cx={24} cy={species.id === 'bluebell' ? 14 : 24} r={species.id === 'sunflower' ? 9 : 6} fill={centre} stroke={stroke} strokeWidth={2} />
        ) : null}
        {species.id === 'clover' ? (
          <Path d="M24 30 L24 44" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        ) : null}
      </G>
    </Svg>
  );
}

export default React.memo(FlowerGlyph);
