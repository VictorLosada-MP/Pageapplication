import type { ReactNode } from 'react'

const inputClass =
  'w-full rounded-md border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15'

export function FieldShell({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={htmlFor}
        className="text-[0.95rem] font-medium leading-relaxed text-foreground text-pretty"
      >
        {label}
      </label>
      {hint ? (
        <p className="-mt-1 text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  )
}

export function TextField({
  id,
  name,
  label,
  hint,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: {
  id: string
  name: string
  label: string
  hint?: string
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </FieldShell>
  )
}

export function TextAreaField({
  id,
  name,
  label,
  hint,
  placeholder,
  required,
}: {
  id: string
  name: string
  label: string
  hint?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        name={name}
        rows={4}
        required={required}
        placeholder={placeholder}
        className={`${inputClass} resize-y leading-relaxed`}
      />
    </FieldShell>
  )
}

export function RadioGroupField({
  name,
  label,
  hint,
  options,
  required,
}: {
  name: string
  label: string
  hint?: string
  options: string[]
  required?: boolean
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex flex-col gap-2.5">
        {options.map((option, i) => {
          const id = `${name}-${i}`
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card px-4 py-3 text-[0.95rem] leading-relaxed text-foreground shadow-sm transition-colors hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:ring-2 has-[:checked]:ring-accent/15"
            >
              <input
                id={id}
                name={name}
                type="radio"
                value={option}
                required={required}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="text-pretty">{option}</span>
            </label>
          )
        })}
      </div>
    </FieldShell>
  )
}
