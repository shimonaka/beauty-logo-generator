import { StyleOption, ColorOption, StyleId, ColorId } from './types';

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'luxury', label: '上品・ラグジュアリー', description: 'elegant luxury style', fontFamily: 'Noto Serif JP' },
  { id: 'natural', label: 'ナチュラル・オーガニック', description: 'natural organic style', fontFamily: 'Zen Maru Gothic' },
  { id: 'minimal', label: 'モダン・ミニマル', description: 'modern minimalist style', fontFamily: 'Noto Sans JP' },
  { id: 'casual', label: 'ポップ・カジュアル', description: 'playful casual style', fontFamily: 'Kosugi Maru' },
  { id: 'edgy', label: 'クール・エッジー', description: 'cool edgy style', fontFamily: 'M PLUS 1p' },
  { id: 'feminine', label: 'フェミニン・ロマンティック', description: 'feminine romantic style', fontFamily: 'Klee One' },
];

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'gold', label: 'ゴールド・ベージュ', hex: '#D4AF37' },
  { id: 'monotone', label: 'モノトーン', hex: '#333333' },
  { id: 'pastel', label: 'パステル', hex: '#FBCFE8' },
  { id: 'earth', label: 'アースカラー', hex: '#78350F' },
  { id: 'vivid', label: 'ビビッド', hex: '#F43F5E' },
  { id: 'dark', label: 'ダークトーン', hex: '#1E293B' },
];

export const STYLE_PROMPTS: Record<StyleId, string> = {
  luxury: 'elegant luxury style with serif typography, gold accents, and refined ornamental details',
  natural: 'natural organic style with botanical elements, soft hand-drawn feel, and leaf or floral motifs',
  minimal: 'modern minimalist style with clean sans-serif typography, geometric shapes, and ample white space',
  casual: 'playful casual style with rounded friendly typography, fun shapes, and approachable cheerful design',
  edgy: 'cool edgy style with bold angular typography, sharp lines, and urban street-inspired aesthetics',
  feminine: 'feminine romantic style with delicate script typography, soft curves, floral ornaments, and graceful details',
};

export const COLOR_PROMPTS: Record<ColorId, string> = {
  gold: 'using warm gold, champagne, and beige tones',
  monotone: 'using black, white, and gray monochrome palette',
  pastel: 'using soft pastel colors such as light pink, lavender, and mint',
  earth: 'using earthy tones such as olive green, terracotta, and warm brown',
  vivid: 'using vibrant vivid colors such as hot pink, electric blue, or bright orange',
  dark: 'using dark sophisticated tones such as deep navy, charcoal, and dark burgundy',
};

export const LOADING_HINTS = [
  "💡 SNSのアイコンに設定すると、お店の認知度がぐっと上がります",
  "💡 ホットペッパービューティーのトップ画像に入れると印象が変わります",
  "💡 予約サイトやGoogleビジネスプロフィールにも使えます",
  "💡 ロゴ入りのショップカードがあると、お客様の再来店率が上がります",
  "💡 ホームページのヘッダーに配置すると、プロ感が一気に出ます",
  "💡 求人チラシにロゴがあると、応募者に「ちゃんとしたサロン」と伝わります"
];

export const MAX_DAILY_LIMIT = 3;
export const MAX_REGEN_PER_SESSION = 2;
