import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        acc["../../components/" + file] = content;
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
const resolveContentPath = (contentType: 'essays' | 'notes', slug: string) => {
  const paths = [
    // Try the build directory first
    path.join(process.cwd(), 'app', 'content', contentType, `${slug}.mdx`),
    // Then try the source directory
    path.join(__dirname, '..', 'content', contentType, `${slug}.mdx`),
  ];

  for (const contentPath of paths) {
    if (fs.existsSync(contentPath)) {
      return contentPath;
    }
  }
  throw new Error(`Content not found for ${contentType}/${slug}`);
};

export const getEssayBySlug = async (slug: string) => {
  try {
    const notePath = resolveContentPath('essays', slug);
    const source = await fs.promises.readFile(notePath, 'utf8');
    const { code, frontmatter } = await bundleMDX({
      source,
      files,
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          // Add your remark plugins here
        ];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          // Add your rehype plugins here
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

export const getNotesBySlug = async (slug: string) => {
  try {
    const notePath = resolveContentPath('notes', slug);
    const source = await fs.promises.readFile(notePath, 'utf8');
    console.log(__dirname);
    const { code, frontmatter } = await bundleMDX({
      source,
      files,
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          // Add your remark plugins here
        ];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          // Add your rehype plugins here
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