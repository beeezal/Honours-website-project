import mathjaxPlugin from 'eleventy-plugin-mathjax';
import markdownItSup from  'markdown-it-sup';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function(eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: data => {
      // If file is in a chapter_* directory and not named index.md, don't create a page
      if (data.page.inputPath.includes("/chapter") && 
          !data.page.fileSlug.includes("index")) {
        return false;
      }
      return data.permalink;
    }
  });
  // Pass through files
  eleventyConfig.addPassthroughCopy('src/assets');

  // Layouts alias
  eleventyConfig.addLayoutAlias('base', 'base.html');

  // Add Markdown-it plugins
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItSup));
    
  // Add MathJax plugin
  eleventyConfig.addPlugin(mathjaxPlugin);

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
    htmlTemplateEngine: 'njk'
  }
};


  