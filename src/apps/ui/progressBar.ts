export function ProgressBar(
  current: number,
  total: number,
  length: number = 10
) {
  const progress = Math.round((current / total) * length);
  const emptyProgress = length - progress;

  const progressBar = "█".repeat(progress);
  const emptyBar = "░".repeat(emptyProgress);

  return `[${progressBar}${emptyBar}]`;
}
