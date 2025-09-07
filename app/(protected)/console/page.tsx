import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-10">
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Welcome to the Admin Dashboard. Here you can manage users, settings, and other administrative tasks.
            </p>
            <p className="text-sm text-muted-foreground">
              This is a placeholder for administrative content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
