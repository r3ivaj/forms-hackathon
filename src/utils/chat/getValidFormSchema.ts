export function getValidFormSchema(messages: any[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    for (const part of msg.parts) {
      if (
        part.type === 'tool-validateFormSchema' &&
        part.state === 'output-available' &&
        part.output?.isValid
      ) {
        return part.output.schema
      }
    }
  }
  return null
}
