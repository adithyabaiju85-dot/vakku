export const ANON_IDENTITY_POOL = [
  "silent_weaver_7731",
  "monsoon_poet_2209",
  "coconut_sage_8847",
  "backwater_echo_3312",
  "river_dreamer_5561",
  "quiet_hill_9923",
  "bronze_sparrow_1144",
  "old_banyan_6678",
  "night_reader_4490",
  "forgotten_star_8823",
  "hollow_reed_5502",
  "wandering_kite_3377"
];

export const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" }, // Purple
  { bg: "#E1F5EE", text: "#0F6E56" }, // Teal
  { bg: "#FAECE7", text: "#993C1D" }, // Coral
  { bg: "#FBEAF0", text: "#993556" }, // Pink
  { bg: "#FAEEDA", text: "#854F0B" }, // Amber
  { bg: "#EAF3DE", text: "#3B6D11" }  // Green
];

/**
 * Gets initials from an anonymous name (e.g., "silent_weaver_7731" -> "SW")
 */
export function getInitials(name: string): string {
  if (!name) return "AN";
  const parts = name.split("_");
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

/**
 * Deterministically gets the color pair index for an anonymous username
 */
export function getColorPairForName(name: string): { bg: string; text: string } {
  const index = ANON_IDENTITY_POOL.indexOf(name);
  if (index === -1) {
    // Hash fallback if not in pool
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[colorIndex];
  }
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/**
 * Returns a random anonymous identity from the pool
 */
export function getRandomIdentity(): string {
  const randomIndex = Math.floor(Math.random() * ANON_IDENTITY_POOL.length);
  return ANON_IDENTITY_POOL[randomIndex];
}
