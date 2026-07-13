import axios from "axios";
import { load } from "cheerio";
import { YoutubeTranscript } from 'youtube-transcript';

export const titleScrapper = async (url: string): Promise<string> => {
  try {
    const { data } = await axios.get(url, {
      headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    });
    const $ = load(data);
    const title = $("title").text();
    return title;
  } catch (error) {
    console.error("Error scraping the title form URL:", error);
    throw new Error("Failed to scrape the title");
  }
};

export async function extractBlogContent(url: string): Promise<string> {
    try {
      const {data} = await axios.get(url, {
        headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
      });
      const $ = load(data);
      $("nav , header, iframe, footer, script, style, noscript, ads, .sidebar, .comments").remove();
      let content = $("article");
      if(content.length === 0) content = $("main");
      if(content.length === 0) content = $(".content, .post-content, .content");
      if(content.length === 0) content = $("body");
      
      const textBlocks: string[] =  [];
      content.find("p, h1, h2, h3, h4, h5, h6").each((_, elem) => {
        const text = $(elem).text().trim();
        if(text.length > 0){
          textBlocks.push(text);
        }
      });

      return textBlocks.join("\n");
    } catch (error) {
      console.log("Error scrapping the content from URL");
      throw new Error("Failed to scrape the content");
    }
  }
  
  export async function extractYoutubeTranscript(url: string): Promise<string> {
    try {
      const transcriptConfig = await YoutubeTranscript.fetchTranscript(url);

      const cleanTranscript = transcriptConfig
      .map((segment) => segment.text)
      .join(" ");

      const decodedTranscript = cleanTranscript
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

      return decodedTranscript.trim();
      
    } catch (error) {
      console.log("Error extracting youtube transcripts from URL");
      throw new Error("Failed to scrape transcripts");
  }
}