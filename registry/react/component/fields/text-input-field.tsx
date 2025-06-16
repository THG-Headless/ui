import React from "react";
import type { InputHTMLAttributes } from "react";
import TextInput from "@registry/react/ui/text-input";
import InputWrapper from "@registry/react/component/field-wrapper";
import type { FieldProps } from "@registry/react/component/field-wrapper";

type TextInputFieldProps = FieldProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id" | "name" | "placeholder" | "disabled" | "required" | "aria-invalid"
  >;

const TextInputField: React.FC<TextInputFieldProps> = ({
  id,
  name,
  label,
  helperText,
  errorMessage,
  placeholder,
  required = false,
  "aria-invalid": ariaInvalid = false,
  disabled = false,
  maxlength,
  ...restProps
}) => {
  return (
    <div className="w-full">
      <InputWrapper
        id={id}
        name={name}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        placeholder={placeholder}
        required={required}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        maxlength={maxlength}
      >
        <TextInput {...restProps} />
      </InputWrapper>
    </div>
  );
};

export default TextInputField;
