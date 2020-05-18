declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element // eslint-disable-line @typescript-eslint/no-explicit-any
  export default MDXComponent
}
