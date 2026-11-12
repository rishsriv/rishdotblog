import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve all component files dynamically with fallback for build
const getComponentFiles = () => {
  // if dev environemtn
  let componentsPath;
  if (process.env.NODE_ENV === 'development') {
    // the path is relative to /app/utils/mdx.server.ts
    componentsPath = path.join(__dirname, '../components');
  } else {
    // the path is relative to /build/server
    componentsPath = path.join(__dirname, '../../app/components');
  }
  try {
    if (fs.existsSync(componentsPath)) {
      const componentFiles = fs.readdirSync(componentsPath);
      return componentFiles.reduce((acc, file) => {
        const filePath = path.join(componentsPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        // @ts-ignore
        acc["../components/" + file] = content;
        return acc;
      }, {});
    }
  } catch (error) {
    console.warn('Components directory not found, continuing without components');
  }
  return {};
};

const files = getComponentFiles();

// Helper function to resolve content paths
const resolveContentPath = (slug: string, subdir = '') => {
  // slugs come straight from the URL, so only allow simple slugs
  if (!/^[a-z0-9-]+$/i.test(slug)) return undefined;
  const paths = [
    // Try the build directory first
    path.join(process.cwd(), 'app', 'content', subdir, `${slug}.mdx`),
    // Then try the source directory
    path.join(__dirname, '..', 'content', subdir, `${slug}.mdx`),
  ];

  for (const contentPath of paths) {
    if (fs.existsSync(contentPath)) {
      return contentPath;
    }
  }
};

export const getPostBySlug = async (slug: string, subdir = '') => {
  try {
    const notePath = resolveContentPath(slug, subdir);
    // @ts-ignore
    const source = await fs.promises.readFile(notePath, 'utf8');
    const { code, frontmatter } = await bundleMDX({
      source,
      files,
      mdxOptions(options) {
        options.remarkPlugins = [
          remarkFrontmatter, remarkMdxFrontmatter, remarkGfm,
        ];
        options.rehypePlugins = [
          rehypePrettyCode
        ];
        return options;
      },
    });

    return { code, frontmatter };
  } catch (error) {
    console.error('Error processing MDX:');
    return null;
  }
};