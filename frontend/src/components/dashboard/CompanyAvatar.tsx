const AVATAR_COLORS = [
  "bg-red-100 text-red-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-violet-100 text-violet-600",
  "bg-pink-100 text-pink-600",
];

const getColorForName = (name: string) => {
  const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[charCodeSum % AVATAR_COLORS.length];
};

interface CompanyAvatarProps {
  companyName: string;
}

export const CompanyAvatar = ({ companyName }: CompanyAvatarProps) => {
  const initial = companyName.trim().charAt(0).toUpperCase();

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getColorForName(
        companyName
      )}`}
    >
      {initial}
    </div>
  );
};