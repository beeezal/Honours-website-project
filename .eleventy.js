import mathjaxPlugin from 'eleventy-plugin-mathjax';
import markdownItSup from  'markdown-it-sup';

export default function(eleventyConfig) {
  // Pass through files
  eleventyConfig.addPassthroughCopy('src/assets');

  // Layouts alias
  eleventyConfig.addLayoutAlias('base', 'base.html');

    // Add Markdown-it plugins
    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItSup));
    
    // Add MathJax plugin
    eleventyConfig.addPlugin(mathjaxPlugin);

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


  