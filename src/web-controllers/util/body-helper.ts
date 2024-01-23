export const missingParams = (params: string[], body: any): string => {
  const filteredParams = params.filter((param) => body[param] === undefined)

  return filteredParams.join(',')
}
