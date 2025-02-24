import { ActivityList } from "@/components/activity-list";
import { ActivitySummary } from "@/components/activity-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-20 pt-8">
      <Tabs defaultValue="summary">
        <TabsList className="mb-8">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <ActivitySummary />
        </TabsContent>
        <TabsContent value="activities">
          <ActivityList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
