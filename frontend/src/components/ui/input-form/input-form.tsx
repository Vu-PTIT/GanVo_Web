import React, { forwardRef } from 'react'
import './input-form.css'

type SelectOption = { value: string; label: string; disabled?: boolean }

type InputProps =
	React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement> &
	React.SelectHTMLAttributes<HTMLSelectElement> & {
		/** Optional label shown above the input */
		label?: string
		/** Optional error message shown below the input */
		error?: string
		/** Optional icon node rendered inside input container */
		icon?: React.ReactNode
		/** Extra classes for the wrapper */
		wrapperClassName?: string
		/** Element type to render */
		as?: 'input' | 'textarea' | 'select'
		/** Options for select (ignored when children provided) */
		options?: SelectOption[]
		/** Children for custom select content */
		children?: React.ReactNode
	}

const InputForm = forwardRef<any, InputProps>(
	(
		{
			label,
			error,
			icon,
			wrapperClassName,
			className,
			as = 'input',
			options,
			children,
			...props
		},
		ref
	) => {
		const wrapperCls = `input-form-box ${wrapperClassName ?? ''} ${error ? 'has-error' : ''}`.trim()

		const inputEl = (() => {
			if (as === 'textarea') {
				return (
					<textarea
						ref={ref}
						className={`input ${className ?? ''}`.trim()}
						{...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
					/>
				)
			}

			if (as === 'select') {
				return (
					<select
						ref={ref}
						className={`input ${className ?? ''}`.trim()}
						{...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
					>
						{children
							? children
							: options?.map(opt => (
								<option key={opt.value} value={opt.value} disabled={opt.disabled}>
									{opt.label}
								</option>
							))}
					</select>
				)
			}

			return <input ref={ref} className={`input ${className ?? ''}`.trim()} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
		})()

		return (
			<div className={wrapperCls}>
				{label && (
					<label className="input-label" htmlFor={(props as any).id}>
						{label}
					</label>
				)}

				{icon && <span className="input-icon">{icon}</span>}
				{inputEl}

				{error && <div className="input-error">{error}</div>}
			</div>
		)
	}
)

InputForm.displayName = 'InputForm'

export default InputForm
export { InputForm }
