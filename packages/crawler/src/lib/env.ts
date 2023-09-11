export const getEnvVar = (name: string): string => {
  const enVar = process.env[name]
  if (!enVar) {
    throw new Error(`env var ${name} not present`)
  }
  return enVar
}
