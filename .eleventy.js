import katex from 'katex';
import markdownItMath from 'markdown-it-texmath';
import markdownItSup from  'markdown-it-sup';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function(eleventyConfig) {
  // Pass through files
  eleventyConfig.addPassthroughCopy('src/assets');

  eleventyConfig.addPassthroughCopy({
    'node_modules/katex/dist/katex.min.css': 'assets/cssStyle/katex.min.css',
    'node_modules/katex/dist/fonts': 'assets/cssSyle/fonts'
  });

  // Layouts alias
  eleventyConfig.addLayoutAlias('base', 'layouts/base.html');

  // Add Markdown-it plugins
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.set({
      linkify: true, 
      breaks: true
    });

    mdLib.use(markdownItMath, {
      engine: katex,
      delimiters: 'dollars',
      katexOptions: { macros: { "\\R": "\\mathbb{R}" } }
    });

    mdLib.use(markdownItSup);
  });

  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["md"],
    preAttributes: {
      tabindex: 0,
      class: "code-block"
    }
  });

  // base config
  return {
    dir: {
      input: 'src',
      includes: '_includes',
      output: 'dist'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    pathPrefix: '/Honours-website-project/'
  }
};


  