export function getNavLinkClass({
  isPending,
  isActive,
}: {
  isPending: boolean;
  isActive: boolean;
}): string {
  if (isPending) return "text-blue-500";

  return isActive
    ? "text-blue-500 font-bold"
    : "text-gray-700 hover:text-blue-500";
}
