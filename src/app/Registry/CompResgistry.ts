// componentRegistry.ts
import { Card } from "@/app/RuntimeComponents/Card";
import { Table } from "@/app/RuntimeComponents/Table";
import { Chart } from "@/app/RuntimeComponents/Chart";

export const componentRegistry: Record<string, React.ComponentType<any>> = {
  card: Card,
  table: Table,
  chart: Chart,
};
