import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context){const notes=(await getCollection('notes',({data})=>!data.draft)).sort((a,b)=>b.data.published-a.data.published);return rss({title:'Kyle Chan Research Notes',description:'生成式 AI × 投資研究筆記',site:context.site,items:notes.map(n=>({title:n.data.title,description:n.data.description,pubDate:n.data.published,link:n.data.legacyPath??`/notes/${n.id}/`}))});}
