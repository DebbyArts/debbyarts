"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type OptionListInputProps = {
  defaultValue?: readonly string[]
  description?: string
  disabled?: boolean
  id: string
  label: string
  name: string
  placeholder?: string
}

function OptionListInput({
  defaultValue = [],
  description,
  disabled = false,
  id,
  label,
  name,
  placeholder,
}: OptionListInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [options, setOptions] = React.useState(() =>
    defaultValue.map((value) => value.trim()).filter(Boolean)
  )
  const [value, setValue] = React.useState("")
  const [message, setMessage] = React.useState("")

  function addOption() {
    const option = value.trim()

    if (!option) {
      setMessage("Enter an option before adding it.")
      inputRef.current?.focus()
      return
    }
    if (options.includes(option)) {
      setMessage("That option is already listed.")
      inputRef.current?.focus()
      return
    }

    setOptions((current) => [...current, option])
    setValue("")
    setMessage("")
    inputRef.current?.focus()
  }

  function removeOption(option: string) {
    setOptions((current) => current.filter((currentOption) => currentOption !== option))
    setMessage("")
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={80}
          onChange={(event) => {
            setValue(event.target.value)
            if (message) setMessage("")
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addOption()
            }
          }}
          aria-describedby={message ? `${id}-message` : undefined}
        />
        <Button type="button" onClick={addOption} disabled={disabled}>
          Add
        </Button>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <p id={`${id}-message`} aria-live="polite" className="sr-only">
        {message}
      </p>
      {options.length > 0 ? (
        <ol className="flex flex-col gap-2">
          {options.map((option, index) => (
            <li
              key={option}
              className="flex min-h-11 items-center justify-between gap-3 rounded-sm border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="font-bold tabular-nums text-muted-foreground">
                  {index + 1}.
                </span>
                <span>{option}</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => removeOption(option)}
                aria-label={`Remove ${option}`}
              >
                Remove
              </Button>
              <input type="hidden" name={name} value={option} disabled={disabled} />
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-xs leading-[1.125rem] text-muted-foreground">
          No options added yet.
        </p>
      )}
    </Field>
  )
}

export { OptionListInput }
