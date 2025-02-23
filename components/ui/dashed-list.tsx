export const DashedList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="flex flex-col gap-2 pl-4">{children}</ul>;
};

export const DashedListItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="list-['–'] pl-2">{children}</li>;
};
