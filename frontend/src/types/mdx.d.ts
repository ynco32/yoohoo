declare module "*.mdx" {
  import type { ComponentProps, ReactElement } from "react";

  interface MDXProps extends ComponentProps<"div"> {
    children?: ReactElement | ReactElement[];
  }

  let MDXComponent: (props: MDXProps) => ReactElement;
  export default MDXComponent;
}
