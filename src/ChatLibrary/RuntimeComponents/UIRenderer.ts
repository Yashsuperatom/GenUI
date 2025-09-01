'use client'

import React from 'react'
import { T_UI_Component  ,Z_UI_Component} from '@/ChatLibrary/types/UIschema'

interface UIRendererProps {
	schema: T_UI_Component
	handlers?: Record<string, Function>
	isStreaming?: boolean
}

// Validate safely
const safeParseComponent = (component: any) => {
	const result = Z_UI_Component.safeParse(component)
	return result.success ? result.data : null
}

const UIRenderer = ({ schema, handlers = {}, isStreaming = false }: UIRendererProps) => {
	const renderComponent = (component: T_UI_Component | string, key?: number | string): React.ReactNode => {
		if (typeof component === 'string') return component
		if (!component || typeof component !== 'object') return null

		const { type, props = {}, children = [] } = component
		if (!type || typeof type !== 'string') return null

		const normalizedType = type.toLowerCase().trim()

		const validHtmlTags = new Set([
			'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'button', 'input', 'textarea', 'select', 'option', 'label',
			'form', 'fieldset', 'legend', 'img', 'a', 'ul', 'ol', 'li',
			'table', 'thead', 'tbody', 'tr', 'td', 'th', 'nav', 'header',
			'footer', 'main', 'section', 'article', 'aside', 'br', 'hr',
			'strong', 'em', 'small', 'code', 'pre', 'blockquote', 'cite',
			'canvas', 'svg', 'video', 'audio', 'iframe', 'embed', 'object',
			'iconify-icon'
		])
		if (!validHtmlTags.has(normalizedType)) return null

		try {
			const processedProps: any = { ...props }

			// Map string onClick to actual handler
			if (processedProps.onClick && typeof processedProps.onClick === 'string') {
				const fn = handlers[processedProps.onClick];
				processedProps.onClick = typeof fn === 'function'
					? fn
					: () => console.warn(`Missing handler: ${processedProps.onClick}`);
			}

			// Apply classNames directly - no processing needed with Tailwind CDN safelist
			if (processedProps.className) {
				if (isStreaming && !processedProps.className.includes('animate-')) {
					processedProps.className += ' transition-all duration-300 ease-in-out'
				}
			}

			// Defaults
			if (normalizedType === 'input' && !processedProps.type) processedProps.type = 'text'
			if (normalizedType === 'button' && !processedProps.type) processedProps.type = 'button'
			if (normalizedType === 'button' && !processedProps.role) processedProps.role = 'button'

			if (normalizedType === 'input' && processedProps.placeholder && !processedProps['aria-label']) {
				processedProps['aria-label'] = processedProps.placeholder
			}

			if (normalizedType === 'img') {
				processedProps.src ??= 'https://via.placeholder.com/150/cccccc/666666?text=No+Image'
				processedProps.alt ??= 'Generated image'
				processedProps.onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
					(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150/ff6b6b/ffffff?text=Error'
				}
			}

			if (normalizedType === 'form' && !processedProps.onSubmit) {
				processedProps.onSubmit = (e: React.FormEvent) => {
					e.preventDefault()
					handlers.handleSubmit?.(e)
				}
			}

			if (key !== undefined) processedProps.key = key

			// Render children safely
			const renderedChildren = Array.isArray(children)
				? children
					.map((child, i) => {
						if (typeof child === 'string') return child
						const parsed = safeParseComponent(child)
						return parsed ? renderComponent(parsed, `child-${i}`) : null
					})
					.filter(Boolean)
				: []

			const selfClosingTags = new Set([
				'img', 'input', 'br', 'hr', 'meta', 'link', 'area',
				'base', 'col', 'embed', 'source', 'track', 'wbr', 'iconify-icon'
			])
			if (selfClosingTags.has(normalizedType)) {
				// Special handling for iconify-icon custom element
				if (normalizedType === 'iconify-icon') {
					return React.createElement('iconify-icon', {
						...processedProps,
						// Ensure icon attribute is passed correctly
						icon: processedProps.icon || processedProps.iconName
					})
				}
				return React.createElement(normalizedType, processedProps)
			}
			return React.createElement(normalizedType, processedProps, renderedChildren.length ? renderedChildren : null)
		} catch (error) {
			console.error('Render error:', error, 'Component:', component)
			return null
		}
	}

	if (!schema) return null

	try {
		const normalizedSchema = (schema as any)?.object ?? schema
		const parsed = safeParseComponent(normalizedSchema)
		if (!parsed) return null
		// return <div className="generated-ui">{renderComponent(parsed)}</div>
		return React.createElement(
			'div',
			{ className: 'generated-ui' },
			renderComponent(parsed)
		)
	} catch (error) {
		console.error('UIRenderer top-level error:', error)
		return null
	}
}

export default UIRenderer