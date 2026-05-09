export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Literature",
  "English",
  "Computer Science",
  "General",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_EMOJI: Record<string, string> = {
  Mathematics: "📐",
  Physics: "⚡",
  Chemistry: "⚗️",
  Biology: "🔬",
  History: "📚",
  Geography: "🌍",
  Literature: "📖",
  English: "🇬🇧",
  "Computer Science": "💻",
  General: "📝",
};

export const SUBJECT_GRADIENT: Record<string, string> = {
  Mathematics: "from-blue-500 to-indigo-600",
  Physics: "from-yellow-500 to-orange-500",
  Chemistry: "from-purple-500 to-violet-600",
  Biology: "from-green-500 to-emerald-600",
  History: "from-amber-500 to-orange-600",
  Geography: "from-teal-500 to-cyan-600",
  Literature: "from-rose-500 to-pink-600",
  English: "from-sky-500 to-blue-600",
  "Computer Science": "from-slate-600 to-gray-700",
  General: "from-indigo-500 to-purple-600",
};
