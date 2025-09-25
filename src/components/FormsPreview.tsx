export function FormsPreview({ formSchema }: { formSchema: any }) {
  return (
    <div>
      <h1>FormsPreview</h1>
      <pre>{JSON.stringify(formSchema, null, 2)}</pre>
    </div>
  )
}
