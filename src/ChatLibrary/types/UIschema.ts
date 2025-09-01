import { z } from "zod"

// Recursive definition for UI Component
export const Z_UI_Component: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(), // Required id
		type: z.string(), // e.g., div, button
		props: z
			.object({
				className: z.string().optional(),
				style: z.record(z.string(),z.any()).optional(), // React.CSSProperties → allow any key-value
				onClick: z.string().optional(),
			})
			.catchall(z.any())
			.optional(),
		children: z.array(z.union([Z_UI_Component, z.string()])).optional(),
	})
)

export type T_UI_Component = z.infer<typeof Z_UI_Component>

// UISchema definition (if needed in DB)
export const UISchemaSchema = z.object({
	id: z.string(),
	userId: z.string(),
	uiId: z.string(),
	name: z.string(),
	component: Z_UI_Component,
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type T_UI_Schema = z.infer<typeof UISchemaSchema>