export function exclude<M, Key extends keyof M>(
  model: M,
  keys: Key[]
): Omit<M, Key> {
  for (const key of keys) {
    delete model[key];
  }
  return model;
}
