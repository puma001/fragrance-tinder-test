import { forwardRef, useState } from 'react';
import TinderCard from 'react-tinder-card';
import styles from './SwipeCard.module.css';

const INDICATORS = {
  right:  { label: 'LIKE',    className: styles.indLike,      icon: '❤️' },
  left:   { label: 'NOPE',   className: styles.indNope,      icon: '✕' },
  up:     { label: 'SUPER',  className: styles.indSuper,     icon: '⭐' },
  down:   { label: 'SKIP',   className: styles.indSkip,      icon: '?' },
};

const SwipeCard = forwardRef(function SwipeCard({ fragrance, onSwipe, onCardLeftScreen }, ref) {
  const [direction, setDirection] = useState(null);

  const ind = direction ? INDICATORS[direction] : null;

  return (
    <TinderCard
      ref={ref}
      className={styles.swipe}
      onSwipe={(dir) => { setDirection(null); onSwipe(dir, fragrance); }}
      onCardLeftScreen={() => onCardLeftScreen(fragrance.id)}
      onSwipeRequirementFulfilled={(dir) => setDirection(dir)}
      onSwipeRequirementUnfulfilled={() => setDirection(null)}
      swipeRequirementType="position"
      swipeThreshold={80}
    >
      <div className={styles.card}>
        {/* Swipe direction indicator */}
        {ind && (
          <div className={`${styles.indicator} ${ind.className}`}>
            <span className={styles.indIcon}>{ind.icon}</span>
            <span className={styles.indLabel}>{ind.label}</span>
          </div>
        )}

        <div className={styles.image} style={{ background: fragrance.color || '#1a1a2e' }}>
          <span className={styles.imageEmoji}>{fragrance.emoji}</span>
          <div className={styles.imageOverlay} />
          <div className={styles.typeBadge}>{fragrance.type}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <h2 className={styles.name}>{fragrance.name}</h2>
            <span className={styles.brand}>{fragrance.brand}</span>
          </div>
          <p className={styles.description}>{fragrance.description}</p>
          <div className={styles.notes}>
            <NoteRow label="Top" value={fragrance.notes.top} />
            <NoteRow label="Heart" value={fragrance.notes.heart} />
            <NoteRow label="Base" value={fragrance.notes.base} />
          </div>
          <div className={styles.tags}>
            <Tag icon="🗓" label={Array.isArray(fragrance.seasons) ? fragrance.seasons.join(' · ') : fragrance.seasons} />
            <Tag icon="💧" label={fragrance.intensity} />
          </div>
        </div>
      </div>
    </TinderCard>
  );
});

function NoteRow({ label, value }) {
  return (
    <div className={styles.noteRow}>
      <span className={styles.noteLabel}>{label}</span>
      <span className={styles.noteValue}>{value}</span>
    </div>
  );
}

function Tag({ icon, label }) {
  return <span className={styles.tag}>{icon} {label}</span>;
}

export default SwipeCard;
