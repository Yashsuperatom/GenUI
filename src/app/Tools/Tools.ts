"use client"

import { tool as createTool } from 'ai';
import { z } from 'zod';
import {getLayout} from '@/lib/layout'


export const UIBlockSchema = z.object({
  type:z.string(),
  props : z.record(z.string(),z.any()).optional(),
  Children : z.any().optional(),
});



export const FetchLayoutTool = createTool({
  
  description: "Fetch a predefined dashboard layout from the local registry",
  inputSchema: z.object({
    layout: z.string().describe("The layout ID, e.g. dashboard1, dashboard2, dashboard3, dashboard4"),
  }),

  execute: async ({ layout }) => {
  const layoutJson = await getLayout(layout);
  if (!layoutJson) throw new Error(`Layout ${layout} not found`);
   console.log(" TOOL CALLED: layout =", layout);
  
   return {
      type: "tool-ui-block",  
      output: layoutJson, 
    };
}
})

export const tools = {
 "layout" : FetchLayoutTool ,
}

