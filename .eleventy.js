export default function(eleventyConfig) {
  // Pass through files
  eleventyConfig.addPassthroughCopy('src/assets');

  // Layouts alias
  eleventyConfig.addLayoutAlias('base', 'base.html');

  // base config
  return {
    dir: {
      input: 'src',
      includes: '_includes',
      output: 'dist'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  }
};


  