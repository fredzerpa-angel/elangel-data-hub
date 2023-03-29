export const formatUserInfoToModalSchema = info => Object.fromEntries(Object.entries(info).map(([key, value]) => {
  return [key, { value }]
}))

export const formatUserInfoToMongoSchema = info => Object.fromEntries(Object.entries(info).map(([key, { value }]) => {
  return [key, value]
}))