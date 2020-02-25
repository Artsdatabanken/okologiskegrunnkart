// TODO: Flyttes fjernes?
export default function metaSjekk(meta) {
  Object.values(meta).forEach(lag => {
    lag.opacity = 0.9;
  });
  return meta;
}
