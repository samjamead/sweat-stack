import { ActivityList } from "../components/activity-list";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-20 pt-12">
      <ActivityList />
    </div>
  );
}
