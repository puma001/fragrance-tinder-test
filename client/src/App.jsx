import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import SwipeCard from './components/SwipeCard.jsx';
import styles from './App.module.css';
import { fragrances as FRAGRANCES } from './data/fragrances.js';
import { computeProfile } from './utils/profile.js';

const ACTION_LABEL = { right: 'like', left: 'dislike', up: 'superlike', down: 'skip' };
const LS_KEY = 'ft_reactions';
const LS_ONBOARDED = 'ft_onboarded';

function loadReactions() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

export default function App() {
  const [fragrances] = useState(FRAGRANCES);
  const [currentIndex, setCurrentIndex] = useState(FRAGRANCES.length - 1);
  const [lastAction, setLastAction] = useState(null);
  const [profile, setProfile] = useState(null);
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem(LS_ONBOARDED));
  const currentIndexRef = useRef(FRAGRANCES.length - 1);
  const reactionsRef = useRef(loadReactions());
  const swipingRef = useRef(false);

  const cardRefs = useMemo(
    () => Object.fromEntries(fragrances.map(f => [f.id, createRef()])),
    []
  );

  // Auto-compute profile when all cards are done
  useEffect(() => {
    if (currentIndex < 0 && !profile) {
      setProfile(computeProfile(reactionsRef.current, fragrances));
    }
  }, [currentIndex, profile]);

  const updateIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const handleSwipe = (dir, fragrance) => {
    const action = ACTION_LABEL[dir] || 'skip';
    setLastAction({ action, name: fragrance.name });
    reactionsRef.current = { ...reactionsRef.current, [fragrance.id]: action };
    localStorage.setItem(LS_KEY, JSON.stringify(reactionsRef.current));
    // Pre-advance the ref immediately so the next button tap targets the right card.
    // React state update (re-render) happens in handleCardLeftScreen after animation.
    const idx = fragrances.findIndex(f => f.id === fragrance.id);
    currentIndexRef.current = idx - 1;
    swipingRef.current = false; // card committed — release guard instantly
  };

  const handleCardLeftScreen = (fragranceId) => {
    const idx = fragrances.findIndex(f => f.id === fragranceId);
    setCurrentIndex(idx - 1); // triggers re-render to unmount swiped card
  };

  const swipe = async (dir) => {
    if (swipingRef.current) return;
    const idx = currentIndexRef.current;
    if (idx < 0 || idx >= fragrances.length) return;
    swipingRef.current = true;
    const ref = cardRefs[fragrances[idx].id];
    if (ref?.current?.swipe) await ref.current.swipe(dir);
    // Guard is released in handleCardLeftScreen when the card physically leaves
  };

  const restart = () => {
    localStorage.removeItem(LS_KEY);
    reactionsRef.current = {};
    setProfile(null);
    setLastAction(null);
    updateIndex(fragrances.length - 1);
  };

  const done = currentIndex < 0 && !profile;
  const showing = currentIndex >= 0;

  const finishOnboarding = () => {
    localStorage.setItem(LS_ONBOARDED, '1');
    setOnboarded(true);
  };

  if (!onboarded) return <Onboarding onStart={finishOnboarding} />;
  if (profile) return <ProfileScreen profile={profile} onRestart={restart} />;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>🌸 Fragrance Tinder</h1>
        {showing && (
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${((fragrances.length - 1 - currentIndex) / fragrances.length) * 100}%` }}
            />
            <span className={styles.progressLabel}>
              {fragrances.length - 1 - currentIndex} / {fragrances.length}
            </span>
          </div>
        )}
      </header>

      <main className={styles.cardArea}>
        {done && <p className={styles.message}>Analyzing your profile…</p>}

        {showing && (
          <div className={styles.stack}>
            {fragrances.map((fragrance, index) =>
              index <= currentIndex ? (
                <SwipeCard
                  key={fragrance.id}
                  ref={cardRefs[fragrance.id]}
                  fragrance={fragrance}
                  onSwipe={handleSwipe}
                  onCardLeftScreen={handleCardLeftScreen}
                  isTop={index === currentIndex}
                />
              ) : null
            )}
          </div>
        )}
      </main>

      {showing && (
        <>
          {lastAction && (
            <div className={`${styles.toast} ${styles[`toast_${lastAction.action}`]}`}>
              {lastAction.action === 'like' && '❤️'}
              {lastAction.action === 'superlike' && '⭐'}
              {lastAction.action === 'dislike' && '✕'}
              {lastAction.action === 'skip' && '?'}
              {' '}{lastAction.name}
            </div>
          )}

          <footer className={styles.actions}>
            <button className={`${styles.btn} ${styles.btnDislike}`} onClick={() => swipe('left')} title="Nope">
              <span>✕</span>
            </button>
            <button className={`${styles.btn} ${styles.btnSkip}`} onClick={() => swipe('down')} title="Don't know">
              <span>?</span>
            </button>
            <button className={`${styles.btn} ${styles.btnSuper}`} onClick={() => swipe('up')} title="Super like">
              <span>⭐</span>
            </button>
            <button className={`${styles.btn} ${styles.btnLike}`} onClick={() => swipe('right')} title="Like">
              <span>❤️</span>
            </button>
          </footer>

          <div className={styles.hints}>
            <span>← Nope</span>
            <span>↓ Skip</span>
            <span>↑ Super</span>
            <span>→ Like</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────

const FAMILY_META = {
  fresh:    { label: 'Fresh',    color: '#38bdf8', emoji: '🌿' },
  woody:    { label: 'Woody',    color: '#a16207', emoji: '🌳' },
  floral:   { label: 'Floral',   color: '#ec4899', emoji: '🌸' },
  oriental: { label: 'Oriental', color: '#f59e0b', emoji: '🌙' },
  spicy:    { label: 'Spicy',    color: '#ef4444', emoji: '🌶️' },
  aquatic:  { label: 'Aquatic',  color: '#06b6d4', emoji: '💧' },
};

// ── Onboarding ────────────────────────────────────────────────────────────────

function Onboarding({ onStart }) {
  return (
    <div className={styles.onboarding}>
      <div className={styles.obCard}>
        <div className={styles.obHero}>
          <div className={styles.obLogo}>🌸</div>
          <h1 className={styles.obTitle}>Fragrance Tinder</h1>
          <p className={styles.obSub}>Swipe through 30 iconic scents.<br />We'll build your fragrance profile.</p>
        </div>

        <div className={styles.obGestures}>
          <div className={styles.obRow}>
            <GestureCard dir="right" color="#22c55e" icon="❤️" label="Like" hint="You'd wear this" />
            <GestureCard dir="left"  color="#ef4444" icon="✕"  label="Nope" hint="Not for you" />
          </div>
          <div className={styles.obRow}>
            <GestureCard dir="up"   color="#3b82f6" icon="⭐" label="Super" hint="You love it" />
            <GestureCard dir="down" color="#94a3b8" icon="?"  label="Skip"  hint="Not sure" />
          </div>
        </div>

        <p className={styles.obNote}>Swipe cards or use the buttons. Takes about 2 minutes.</p>

        <button className={styles.obBtn} onClick={onStart}>
          Start Exploring →
        </button>
      </div>
    </div>
  );
}

function GestureCard({ color, icon, label, hint }) {
  return (
    <div className={styles.gestureCard} style={{ borderColor: `${color}44`, background: `${color}11` }}>
      <span className={styles.gestureIcon}>{icon}</span>
      <span className={styles.gestureLabel} style={{ color }}>{label}</span>
      <span className={styles.gestureHint}>{hint}</span>
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────

function ProfileScreen({ profile, onRestart }) {
  const { personality, familyScores, topSeason, topIntensity, superliked, liked } = profile;
  const topPicks = [...superliked, ...liked].slice(0, 5);

  // Normalise family scores to % for bar chart
  const families = Object.entries(familyScores).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const maxScore = families[0]?.[1] || 1;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileHero}>
          <div className={styles.profileIcon}>{personality.icon}</div>
          <h2 className={styles.profileName}>{personality.name}</h2>
          <p className={styles.profileDesc}>{personality.desc}</p>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Fragrance DNA</h3>
          <div className={styles.bars}>
            {families.map(([family, score]) => {
              const meta = FAMILY_META[family] || { label: family, color: '#a78bfa', emoji: '✨' };
              return (
                <div key={family} className={styles.barRow}>
                  <span className={styles.barEmoji}>{meta.emoji}</span>
                  <span className={styles.barLabel}>{meta.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${(score / maxScore) * 100}%`, background: meta.color }}
                    />
                  </div>
                  <span className={styles.barScore}>+{score}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Style</h3>
          <div className={styles.styleTags}>
            <StyleTag icon="💧" label={topIntensity} sub="Intensity" />
            <StyleTag icon="🗓" label={topSeason} sub="Season" />
            {superliked.length > 0 && <StyleTag icon="⭐" label={`${superliked.length} Super Liked`} sub="Obsessions" />}
          </div>
        </section>

        <MatchResults superliked={superliked} liked={liked} />

        <button className={styles.restartBtn} onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  );
}

// ── Match Results (Shopping List) ────────────────────────────────────────────

const TIER_META = {
  luxury:     { label: 'Luxury',     icon: '💎', color: '#d4af37', bg: 'rgba(212,175,55,0.12)',  border: 'rgba(212,175,55,0.25)' },
  premium:    { label: 'Premium',    icon: '✨', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
  accessible: { label: 'Accessible', icon: '💡', color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)' },
};

function MatchResults({ superliked, liked }) {
  const matches = [
    ...superliked.map(f => ({ ...f, reaction: 'superlike' })),
    ...liked.map(f => ({ ...f, reaction: 'like' })),
  ];
  if (matches.length === 0) return null;

  // Group by tier for summary
  const byTier = matches.reduce((acc, f) => {
    const t = f.tier || 'accessible';
    (acc[t] = acc[t] || []).push(f);
    return acc;
  }, {});

  const totalLow = Math.min(...matches.map(f => f.price || 0));
  const totalHigh = matches.reduce((s, f) => s + (f.price || 0), 0);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>🛍️ Your Shopping List</h3>

      <div className={styles.matchSummary}>
        <span className={styles.matchCount}>{matches.length} fragrances matched</span>
        <span className={styles.matchBudget}>
          From <strong>${totalLow}</strong> · Full list ~<strong>${totalHigh.toLocaleString()}</strong>
        </span>
      </div>

      {['luxury', 'premium', 'accessible'].map(tier => {
        const group = byTier[tier];
        if (!group?.length) return null;
        const meta = TIER_META[tier];
        return (
          <div key={tier} className={styles.tierGroup}>
            <div className={styles.tierHeader} style={{ color: meta.color }}>
              <span>{meta.icon} {meta.label}</span>
              <span className={styles.tierCount}>{group.length}</span>
            </div>
            {group.map(f => <MatchCard key={f.id} fragrance={f} />)}
          </div>
        );
      })}
    </section>
  );
}

function MatchCard({ fragrance: f }) {
  const tier = TIER_META[f.tier] || TIER_META.accessible;
  const searchQuery = encodeURIComponent(`${f.name} ${f.brand} perfume buy`);
  const searchUrl = `https://www.google.com/search?q=${searchQuery}&tbm=shop`;

  return (
    <div className={styles.matchCard}>
      <div className={styles.matchCardLeft} style={{ background: f.color }}>
        <span className={styles.matchEmoji}>{f.emoji}</span>
      </div>

      <div className={styles.matchInfo}>
        <div className={styles.matchHeader}>
          <span className={styles.matchName}>{f.name}</span>
          <span className={styles.matchReaction}>
            {f.reaction === 'superlike' ? '⭐' : '❤️'}
          </span>
        </div>
        <span className={styles.matchBrand}>{f.brand}</span>

        <div className={styles.matchMeta}>
          <span
            className={styles.matchTierBadge}
            style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.border}` }}
          >
            {tier.icon} {tier.label}
          </span>
          <span className={styles.matchPrice}>${f.price} · {f.size}</span>
        </div>

        <div className={styles.matchRetailers}>
          {(f.retailers || []).slice(0, 3).map(r => (
            <span key={r} className={styles.retailerChip}>{r}</span>
          ))}
        </div>
      </div>

      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.shopBtn}
        title="Search on Google Shopping"
      >
        Shop →
      </a>
    </div>
  );
}

function StyleTag({ icon, label, sub }) {
  return (
    <div className={styles.styleTag}>
      <span className={styles.styleTagIcon}>{icon}</span>
      <span className={styles.styleTagLabel}>{label}</span>
      <span className={styles.styleTagSub}>{sub}</span>
    </div>
  );
}
