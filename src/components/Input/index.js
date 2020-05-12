import React from 'react'
import Input from './Input'

export const FormInput = ({ input, meta, ...props }) => (
  <Input
    {...props}
    value={input.value}
    onChangeText={input.onChange}
    onFocus={input.onFocus}
    onBlur={input.onBlur}
    touched={meta.touched}
    error={meta.error}
  />
)

export default Input
