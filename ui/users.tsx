"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SqlEditor } from "@/modules/platform-kit/ui/sql-editor";
import { UsersGrowthChart } from "@/modules/platform-kit/ui/users-growth-chart";
import { useState } from "react";

export function UsersManager({ projectRef }: { projectRef: string }) {
  const [timeRange, setTimeRange] = useState(90);
  const defaultSql = `SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 100;`;

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between p-6 pt-4 lg:p-8 lg:pt-8">
        <div className="flex-1">
          <h1 className="text-base font-semibold lg:text-xl">Users</h1>
          <p className="text-muted-foreground mt-1 hidden text-sm lg:block lg:text-base">
            View user signups over time
          </p>
        </div>
        <Select
          value={String(timeRange)}
          onValueChange={(value) => setTimeRange(Number(value))}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">
              Last 90 days
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="px-8">
        <UsersGrowthChart projectRef={projectRef} timeRange={timeRange} />
      </div>
      <SqlEditor
        hideChartOption
        projectRef={projectRef}
        initialSql={defaultSql}
        initialNaturalLanguageMode={true}
        label="Recent users"
        hideSql={true}
        readOnly={true}
        runAutomatically={true}
      />
    </div>
  );
}
