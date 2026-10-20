declare module 'mjml' {
  const render: (source: string) => { html: string; errors: unknown[] }
  export default render
}
