import OpenAI from "openai";

// Follow these instructions when using this blueprint:
// 1. the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// 2. Use the response_format: { type: "json_object" } option
// 3. Request output in JSON format in the prompt
// 4. gpt-5 doesn't support temperature parameter, do not use it.

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface WebsiteGeneration {
  html: string;
  css: string;
  js: string;
}

export async function generateWebsite(
  businessDescription: string,
  templateType: string
): Promise<WebsiteGeneration> {
  const systemPrompt = `You are an expert web developer specializing in creating professional, responsive, and beautiful single-page websites. Generate a complete, modern, and production-ready website based on the business description provided.

The website must:
- Be fully responsive (mobile, tablet, desktop)
- Use modern HTML5 semantic elements
- Have beautiful CSS with gradients, shadows, and smooth animations
- Include a professional color scheme that can be easily customized via CSS variables
- Have clear sections: Hero, Services/Products, About, Contact
- Include a contact form (no backend, just HTML)
- Use modern fonts and typography
- Be accessible (ARIA labels, semantic HTML)
- Have smooth scroll behavior
- Include meta tags for SEO

Template type: ${templateType}

You must respond with valid JSON in this exact format:
{
  "html": "complete HTML string",
  "css": "complete CSS string",
  "js": "complete JavaScript string (if needed, otherwise empty string)"
}

The HTML should be a complete document starting with <!DOCTYPE html>.
The CSS should use CSS variables for colors: --primary-color, --secondary-color, --accent-color so they can be easily customized.
Make it professional, modern, and impressive.`;

  const userPrompt = `Business description: ${businessDescription}

Create a stunning, professional website for this business. Make it look like it was designed by a top agency.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content) as WebsiteGeneration;

    // Validate that we have HTML at minimum
    if (!result.html || result.html.trim().length === 0) {
      throw new Error("Generated website has no HTML content");
    }

    return {
      html: result.html,
      css: result.css || "",
      js: result.js || "",
    };
  } catch (error) {
    console.error("Error generating website with OpenAI:", error);
    throw new Error(
      `Failed to generate website: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function customizeWebsiteColors(
  originalCss: string,
  colors: { primary?: string; secondary?: string; accent?: string }
): Promise<string> {
  // Simple CSS variable replacement
  let customizedCss = originalCss;

  if (colors.primary) {
    customizedCss = customizedCss.replace(
      /--primary-color:\s*[^;]+;/g,
      `--primary-color: ${colors.primary};`
    );
  }

  if (colors.secondary) {
    customizedCss = customizedCss.replace(
      /--secondary-color:\s*[^;]+;/g,
      `--secondary-color: ${colors.secondary};`
    );
  }

  if (colors.accent) {
    customizedCss = customizedCss.replace(
      /--accent-color:\s*[^;]+;/g,
      `--accent-color: ${colors.accent};`
    );
  }

  return customizedCss;
}

export async function customizeWebsiteTexts(
  originalHtml: string,
  texts: Record<string, string>
): Promise<string> {
  if (!texts || Object.keys(texts).length === 0) {
    return originalHtml;
  }

  const systemPrompt = `You are a web content editor. You will receive HTML content and a set of text replacements to apply.

Your task:
1. Identify the main content sections in the HTML (hero title, tagline, about section, services, contact info)
2. Apply the requested text changes intelligently, replacing similar content with the new text
3. Maintain all HTML structure, classes, and styling
4. Only modify the text content, never the HTML tags or attributes
5. Return the complete modified HTML

You must respond with valid JSON in this exact format:
{
  "html": "complete modified HTML string"
}`;

  const userPrompt = `Original HTML:
${originalHtml}

Text replacements to apply:
${JSON.stringify(texts, null, 2)}

Apply these text changes to the HTML where appropriate, maintaining all structure and styling.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content) as { html: string };
    return result.html || originalHtml;
  } catch (error) {
    console.error("Error customizing website texts:", error);
    // Return original HTML if customization fails
    return originalHtml;
  }
}

export async function customizeWebsiteImages(
  originalHtml: string,
  images: Record<string, string>
): Promise<string> {
  if (!images || Object.keys(images).length === 0) {
    return originalHtml;
  }

  // Simple image replacement using regex
  let customizedHtml = originalHtml;

  // Replace logo first, then hero (order matters)
  if (images.logo && images.logo.trim()) {
    // Replace logo image (with logo class or id)
    customizedHtml = customizedHtml.replace(
      /(<img[^>]*(?:class=["'][^"']*logo[^"']*["']|id=["']logo["'])[^>]*src=["'])[^"']*([^>]*>)/i,
      `$1${images.logo}$2`
    );
  }

  if (images.hero && images.hero.trim()) {
    // Replace hero image (first image that is NOT a logo)
    // Look for images with hero/banner class first
    const heroMatch = customizedHtml.match(/(<img[^>]*(?:class=["'][^"']*(?:hero|banner)[^"']*["'])[^>]*src=["'])[^"']*([^>]*>)/i);
    if (heroMatch) {
      customizedHtml = customizedHtml.replace(
        /(<img[^>]*(?:class=["'][^"']*(?:hero|banner)[^"']*["'])[^>]*src=["'])[^"']*([^>]*>)/i,
        `$1${images.hero}$2`
      );
    } else {
      // Fallback: replace first image that doesn't contain "logo" in class/id
      customizedHtml = customizedHtml.replace(
        /(<img(?![^>]*(?:class|id)=["'][^"']*logo[^"']*["'])[^>]*src=["'])[^"']*([^>]*>)/i,
        `$1${images.hero}$2`
      );
    }
  }

  return customizedHtml;
}
