export const colorsList = [
    '#EB4034',
    '#EB7734',
    '#EBC034',
    '#FFFF00',
    '#D3EB34',
    '#96EB34',
    '#30B027',
    '#27B097',
    '#2797B0',
    '#273BB0',
    '#784FD6',
    '#773D9C',
    '#B662BF',
    '#ED72D0',
    '#B82562',
    '#99DDFF',
    '#ABE8A9',
    '#E6E287',
    '#77768C',
    '#DDDDDD'
] as const;

export type CategoryColor = typeof colorsList[number];
