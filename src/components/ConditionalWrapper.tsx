import type { ReactNode } from "react";

type Props = {
  condition: boolean;
  children: ReactNode | ReactNode[];
  wrap1: (children: ReactNode | ReactNode[]) => JSX.Element;
  wrap2: (children: ReactNode | ReactNode[]) => JSX.Element;
};

const ConditionalWrapper = ({ condition, children, wrap1, wrap2 }: Props) => {
  return condition ? wrap1(children) : wrap2(children);
};

export default ConditionalWrapper;
