module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['component', {
      libraryName: '@dogsmall/xx-ui',
      libDir: 'lib',
      styleLibrary: {
        name: 'styles',
        base: false,
        path: '[module].css'
      }
    }]
  ]
}
