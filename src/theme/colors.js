import { colors } from 'vuetify/lib';

const themeColors = {
  origin: {
    dark: false,
    label: '亮黃',
    theme: {
      primary: colors.amber.accent1,
      secondary: colors.shades.white,
      accent: colors.shades.white,
      error: colors.red.accent2,
      warning: colors.amber.darken2,
      info: colors.blue.base,
      success: colors.green.base,
    },
  },
  lightOrange: {
    dark: false,
    label: '淺橘',
    theme: {
      primary: colors.orange.darken1,
      secondary: colors.orange.lighten3,
      accent: colors.orange.lighten5,
      error: colors.red.lighten1,
      warning: colors.yellow.darken3,
      info: colors.blue.darken1,
      success: colors.green.darken1,
    },
  },
  deepGreen: {
    dark: true,
    label: '深綠',
    theme: {
      primary: colors.teal.darken4,
      secondary: colors.teal.darken3,
      accent: '#042f28',
      error: colors.deepOrange.lighten1,
      warning: colors.yellow.lighten1,
      info: colors.lightBlue.lighten3,
      success: colors.lightGreen.lighten1,
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
      warning: colors.yellow.darken3,
      info: colors.lightBlue.darken2,
      success: colors.green.lighten1,
    },
  },
  lightGrey: {
    dark: false,
    label: '淺灰',
    theme: {
      primary: colors.blueGrey.darken1,
      secondary: colors.blueGrey.lighten3,
      accent: colors.blueGrey.lighten5,
      error: colors.red.darken1,
      warning: colors.yellow.darken3,
      info: colors.blue.darken1,
      success: colors.green.darken2,
    },
  },
  deepGrey: {
    dark: true,
    label: '深灰',
    theme: {
      primary: colors.blueGrey.darken3,
      secondary: colors.blueGrey.darken2,
      accent: colors.blueGrey.darken1,
      error: colors.red.lighten2,
      warning: colors.orange.lighten2,
      info: colors.blue.lighten2,
      success: colors.green.lighten2,
    },
  },
};

const themePrimaryColor = {};
Object.keys(themeColors).forEach((item) => {
  const primaryKey = `theme${item.slice(0, 1).toUpperCase() + item.slice(1)}`;
  themePrimaryColor[primaryKey] = themeColors[item].theme.primary;
});
Object.keys(themeColors).map((item) => {
  themeColors[item].theme = {
    ...themeColors[item].theme,
    ...themePrimaryColor,
  };
  return item;
});

export default themeColors;
