const PROFILE_LOCAL_KEY = "dished_chef_profile_extra";

export interface ProfileExtras {
  experience: string;
  cuisines: string[];
  phone: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  defaultExpiryHours: number; // 1-72, default 10
}

export function loadProfileExtras(userId: number): ProfileExtras {
  try {
    const raw = localStorage.getItem(`${PROFILE_LOCAL_KEY}_${userId}`);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      experience:         parsed.experience        ?? "",
      cuisines:           parsed.cuisines          ?? [],
      phone:              parsed.phone             ?? "",
      phoneVerified:      parsed.phoneVerified     ?? false,
      emailVerified:      parsed.emailVerified     ?? false,
      defaultExpiryHours: parsed.defaultExpiryHours ?? 10,
    };
  } catch { return { experience: "", cuisines: [], phone: "", phoneVerified: false, emailVerified: false, defaultExpiryHours: 10 }; }
}

export function saveProfileExtras(userId: number, extras: Partial<ProfileExtras>) {
  const current = loadProfileExtras(userId);
  localStorage.setItem(`${PROFILE_LOCAL_KEY}_${userId}`, JSON.stringify({ ...current, ...extras }));
}

/** Returns true when the profile is complete enough to allow posting */
export function isProfileComplete(userId: number, profileSaved: boolean): boolean {
  if (!profileSaved) return false;
  const ex = loadProfileExtras(userId);
  return ex.emailVerified && ex.phoneVerified;
}
