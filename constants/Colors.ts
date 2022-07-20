const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    btnBackground: 'hsl(213,10%,18%)',
    btnText: 'hsl(0,0%,100%)',
  },
  dark: { // unused in this app
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    btnBackground: 'hsl(0,50%,50%)',
    btnText: 'hsl(0,0%,0%)', // TODO: test dark mode btn color scheme
  },
};
