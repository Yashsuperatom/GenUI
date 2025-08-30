import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full  resize-none bg-transparent outline-none  placeholder:text-muted-foreground placeholder:items-center placeholder:justify-center    ",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
