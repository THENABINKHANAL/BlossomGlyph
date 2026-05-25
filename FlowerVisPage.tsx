// src/pages/FlowerVisPage.tsx
import { useMemo, useState } from 'react';
import FlowerGlyphControl from '../components/FlowerGlyphControl';

type ItemValue = { inner: number; outer: number };
type ThemeKey = 'dark' | 'light';

const MAX_ITEMS = 20;
const SLIDER_MIN = 0;
const SLIDER_MAX = 30;

function randomFlowerColor() {
  const hue = Math.floor(Math.random() * 360);
  const sat = 65 + Math.random() * 20;
  const light = 45 + Math.random() * 15;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function makeRandomCategoryColors() {
  const next: Record<string, string> = {};
  for (let i = 1; i <= MAX_ITEMS; i += 1) {
    next[`_${i}`] = randomFlowerColor();
  }
  return next;
}

const THEME_PRESETS: Record<
  ThemeKey,
  {
    panelBg: string;
    panelText: string;
    panelBorder: string;
    cardBg: string;
    cardBorder: string;
    subtleText: string;
    buttonBg: string;
    buttonText: string;
    buttonBorder: string;
  }
> = {
  dark: {
    panelBg: 'rgba(17,24,39,0.7)',
    panelText: '#ffffff',
    panelBorder: 'rgba(255,255,255,0.12)',
    cardBg: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.08)',
    subtleText: 'rgba(255,255,255,0.9)',
    buttonBg: '#0b1221',
    buttonText: '#ffffff',
    buttonBorder: '#334155',
  },
  light: {
    panelBg: 'rgba(248,250,252,0.92)',
    panelText: '#0f172a',
    panelBorder: 'rgba(15,23,42,0.16)',
    cardBg: 'rgba(15,23,42,0.04)',
    cardBorder: 'rgba(15,23,42,0.12)',
    subtleText: '#334155',
    buttonBg: '#e2e8f0',
    buttonText: '#0f172a',
    buttonBorder: '#cbd5e1',
  },
};

export default function FlowerVisPage() {
  const [itemCount, setItemCount] = useState(5);
  const [theme, setTheme] = useState<ThemeKey>('dark');
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    () => makeRandomCategoryColors()
  );
  const [items, setItems] = useState<ItemValue[]>(
    () => Array.from({ length: MAX_ITEMS }, () => ({ inner: 3, outer: 5 }))
  );
  const palette = THEME_PRESETS[theme];

  const updateItem = (index: number, key: keyof ItemValue, value: number) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const dataSlice = useMemo(() => {
    const obj: Record<string, ItemValue> = {};
    for (let i = 0; i < itemCount; i += 1) {
      obj[`_${i + 1}`] = items[i];
    }
    return obj;
  }, [itemCount, items]);

  return (
    <>
      <FlowerGlyphControl
        dataSlice={dataSlice}
        legendOffset={{ x: 12, y: 120 }}
        isDataImportExport={false}
        showOuterCircle={false}
        colorMode={theme}
        categoryColors={categoryColors}
      />

      <div
        style={{
          position: 'fixed',
          left: 12,
          top: 12,
          zIndex: 10,
          background: palette.panelBg,
          color: palette.panelText,
          border: `1px solid ${palette.panelBorder}`,
          padding: '12px 14px',
          borderRadius: 10,
          backdropFilter: 'blur(4px)',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          width: 320,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>Flower Data Controls</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCategoryColors(makeRandomCategoryColors())}
              style={{
                background: palette.buttonBg,
                color: palette.buttonText,
                border: `1px solid ${palette.buttonBorder}`,
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Randomize Colors
            </button>
            <button
              type="button"
              onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
              style={{
                background: palette.buttonBg,
                color: palette.buttonText,
                border: `1px solid ${palette.buttonBorder}`,
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {theme === 'dark' ? 'Dark -> Light' : 'Light -> Dark'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, marginBottom: 6, color: palette.subtleText }}>
            Number of items: <strong>{itemCount}</strong>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_ITEMS}
            step={1}
            value={itemCount}
            onChange={e => setItemCount(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {Array.from({ length: itemCount }, (_, idx) => {
          const label = `Item ${idx + 1}`;
          const current = items[idx];
          return (
            <div
              key={label}
              style={{
                padding: '10px 12px',
                marginBottom: 10,
                borderRadius: 8,
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 11,
                  }}
                >
                  {idx + 1}
                </span>
                {label}
              </div>

              <div style={{ fontSize: 12, color: palette.subtleText, marginBottom: 4 }}>
                Outer (0-30): <strong>{current.outer}</strong>
              </div>
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={1}
                value={current.outer}
                onChange={e =>
                  updateItem(idx, 'outer', Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, Number(e.target.value))))
                }
                style={{ width: '100%' }}
              />

              <div
                style={{
                  fontSize: 12,
                  color: palette.subtleText,
                  margin: '10px 0 4px',
                }}
              >
                Inner (0-100): <strong>{current.inner}</strong>
              </div>
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={1}
                value={current.inner}
                onChange={e =>
                  updateItem(idx, 'inner', Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, Number(e.target.value))))
                }
                style={{ width: '100%' }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
