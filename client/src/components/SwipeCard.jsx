import { forwardRef, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import styles from './SwipeCard.module.css';

const SwipeCard = forwardRef(function SwipeCard({ fragrance, onSwipe, onCardLeftScreen, isTop }, ref) {
  // Use a ref + direct DOM mutation so indicator changes never trigger a React re-render.
  // Re-renders during a drag cause spring animation stutters that feel like "locking".
  const wrapRef = useRef(null);

  const setDir = (dir) => {
    if (wrapRef.current) wrapRef.current.dataset.dir = dir ?? '';
  };

  return (
    <TinderCard
      ref={ref}
      className={`${styles.swipe} ${isTop ? '' : styles.swipeBg}`}
      onSwipe={(dir) => { setDir(''); onSwipe(dir, fragrance); }}
      onCardLeftScreen={() => onCardLeftScreen(fragrance.id)}
      onSwipeRequirementFulfilled={setDir}
      onSwipeRequirementUnfulfilled={() => setDir('')}
      swipeRequirementType="velocity"
      swipeThreshold={0.4}
      flickOnSwipe
    >
      <div className={styles.card}>
        {/* All 4 indicators pre-rendered; shown via CSS data-dir — zero JS re-render */}
        <div className={styles.indicators} ref={wrapRef} data-dir="">
          <div className={`${styles.ind} ${styles.indLike}`}>❤️ <span>LIKE</span></div>
          <div className={`${styles.ind} ${styles.indNope}`}>✕ <span>NOPE</span></div>
          <div className={`${styles.ind} ${styles.indSuper}`}>⭐ <span>SUPER</span></div>
          <div className={`${styles.ind} ${styles.indSkip}`}>? <span>SKIP</span></div>
        </div>

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
            <NoteRow label="Top"   value={fragrance.notes.top} />
            <NoteRow label="Heart" value={fragrance.notes.heart} />
            <NoteRow label="Base"  value={fragrance.notes.base} />
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
