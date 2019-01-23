import colors from 'vuetify/es5/util/colors';

const themeColors = {
  origin: {
    dark: false,
    label: '亮黃',
    theme: {
      primary: colors.amber.accent1,
      secondary: colors.shades.white,
      accent: colors.shades.white,
      error: colors.red.accent2,
      warning: colors.amber.base,
      info: colors.blue.base,
      success: colors.green.base,
    },
  },
  lightBlue: {
    dark: false,
    label: '水藍',
    theme: {
      primary: colors.lightBlue.base,
      secondary: colors.lightBlue.lighten3,
      accent: colors.blueGrey.lighten5,
      error: colors.red.lighten1,
      warning: colors.yellow.lighten1,
      info: colors.lightBlue.lighten1,
      success: colors.green.lighten1,
    },
  },
  deepGreen: {
    dark: true,
    label: '深綠',
    theme: {
      primary: colors.teal.darken4,
      secondary: colors.teal.darken3,
      accent: '#042f28',
      error: colors.deepOrange.darken3,
      warning: colors.yellow.darken3,
      info: colors.lightBlue.darken3,
      success: colors.lightGreen.darken3,
    },
  },
  lightGrey: {
    dark: false,
    label: '淺灰',
    theme: {
      primary: colors.blueGrey.darken1,
      secondary: colors.blueGrey.lighten3,
      accent: colors.blueGrey.lighten5,
      error: colors.red.base,
      warning: colors.yellow.base,
      info: colors.blue.base,
      success: colors.green.base,
    },
  },
  deepGrey: {
    dark: true,
    label: '深灰',
    theme: {
      primary: colors.blueGrey.darken3,
      secondary: colors.blueGrey.darken2,
      accent: colors.blueGrey.darken1,
      error: colors.red.darken3,
      warning: colors.orange.darken3,
      info: colors.blue.darken3,
      success: colors.green.darken3,
    },
  },
};

const themePrimaryColor = {};
Object.keys(themeColors).forEach((item) => {
  const primaryKey = `theme${item.slice(0, 1).toUpperCase() + item.slice(1)}`;
  themePrimaryColor[primaryKey] = themeColors[item].theme.primary;
});
Object.keys(themeColors).map((item) => {
  themeColors[item].theme = { ...themeColors[item].theme, ...themePrimaryColor };
  return item;
});

export default themeColors;
