import { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './SwipeCard.module.css';

// Thresholds
const VEL_THRESHOLD  = 0.35;  // px/ms — flick speed to commit
const DIST_THRESHOLD = 90;    // px  — distance to commit without speed
const ROT_FACTOR     = 0.07;  // card rotation per px of horizontal drag
const FLY_DIST       = 700;   // px the card travels off-screen

function getDir(dx, dy) {
  if (Math.abs(dy) > Math.abs(dx) * 1.4) return dy < 0 ? 'up' : 'down';
  return dx > 0 ? 'right' : 'left';
}

const SwipeCard = forwardRef(function SwipeCard({ fragrance, onSwipe, onCardLeftScreen, isTop }, ref) {
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const drag = useRef({ active: false, swiped: false, sx: 0, sy: 0, lx: 0, ly: 0, vx: 0, vy: 0, lt: 0 });

  function setT(x, y, rot, transition = 'none') {
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = transition;
    el.style.transform  = `translate(${x}px,${y}px) rotate(${rot}deg)`;
  }

  function setDir(dir) {
    if (indicatorRef.current) indicatorRef.current.dataset.dir = dir ?? '';
  }

  function flyOut(dir) {
    const d = drag.current;
    if (d.swiped) return Promise.resolve();
    d.swiped = true;
    setDir('');

    const tx = dir === 'right' ? FLY_DIST : dir === 'left' ? -FLY_DIST : 0;
    const ty = dir === 'up'    ? -FLY_DIST : dir === 'down' ? FLY_DIST : -40;
    const rot = dir === 'right' ? 22 : dir === 'left' ? -22 : 0;

    setT(tx, ty, rot, 'transform 0.32s cubic-bezier(0.2,0,0.8,1)');

    return new Promise(resolve => {
      setTimeout(() => {
        onSwipe(dir, fragrance);
        onCardLeftScreen(fragrance.id);
        resolve();
      }, 320);
    });
  }

  useImperativeHandle(ref, () => ({ swipe: flyOut }));

  function onDown(e) {
    if (!isTop) return;
    const d = drag.current;
    if (d.swiped) return;
    d.active = true;
    d.sx = d.lx = e.clientX;
    d.sy = d.ly = e.clientY;
    d.vx = d.vy = 0;
    d.lt = Date.now();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.transition = 'none';
  }

  function onMove(e) {
    const d = drag.current;
    if (!d.active || d.swiped) return;
    const now = Date.now(), dt = Math.max(now - d.lt, 1);
    d.vx = (e.clientX - d.lx) / dt;
    d.vy = (e.clientY - d.ly) / dt;
    d.lx = e.clientX; d.ly = e.clientY; d.lt = now;

    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    setT(dx, dy, dx * ROT_FACTOR);

    const mag = Math.sqrt(dx * dx + dy * dy);
    setDir(mag > 24 ? getDir(dx, dy) : '');
  }

  function onUp(e) {
    const d = drag.current;
    if (!d.active || d.swiped) return;
    d.active = false;

    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    const vel = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (vel > VEL_THRESHOLD || dist > DIST_THRESHOLD) {
      flyOut(getDir(dx, dy));
    } else {
      setDir('');
      setT(0, 0, 0, 'transform 0.28s cubic-bezier(0.175,0.885,0.32,1.275)');
    }
  }

  const imgSlug = fragrance.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const localSrc  = `/fragrances/${imgSlug}.jpg`;
  const picsumSrc = `https://picsum.photos/seed/${imgSlug}/400/500`;

  return (
    <div ref={containerRef} className={`${styles.swipe} ${isTop ? '' : styles.swipeBg}`}>
      <div
        className={styles.card}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className={styles.indicators} ref={indicatorRef} data-dir="">
          <div className={`${styles.ind} ${styles.indLike}`}>❤️ <span>LIKE</span></div>
          <div className={`${styles.ind} ${styles.indNope}`}>✕ <span>NOPE</span></div>
          <div className={`${styles.ind} ${styles.indSuper}`}>⭐ <span>SUPER</span></div>
          <div className={`${styles.ind} ${styles.indSkip}`}>? <span>SKIP</span></div>
        </div>

        <div className={styles.image} style={{ background: fragrance.color || '#1a1a2e' }}>
          <img
            src={localSrc}
            alt={fragrance.name}
            className={styles.cardImg}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = picsumSrc; }}
            draggable={false}
          />
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
    </div>
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
