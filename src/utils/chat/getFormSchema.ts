export function getFormSchema(messages: any[]) {
  const assistantMessages = messages.filter((msg) => msg.role === 'assistant')

  for (let i = assistantMessages.length - 1; i >= 0; i--) {
    const msg = assistantMessages[i]
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
