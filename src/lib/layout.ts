// lib/layouts.ts
export const DemoRegistry = {
  dashboard1: {
    type: "div",
    props: { className: "p-6 space-y-4" },
    children: [
      {
        type: "card",
        props: { title: "Sales Report", description: "Monthly sales" },
        children: [
          {
            type: "chart",
            props: {
              type: "bar",
              data: [
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
              ],
            },
          },
        ],
      },
      {
        type: "table",
        props: {
          columns: ["Month", "Revenue"],
          data: [
            ["Jan", 400],
            ["Feb", 300],
          ],
        },
      },
    ],
  },

  dashboard2: {
    type: "div",
    props: { className: "grid grid-cols-2 gap-4 p-6" },
    children: [
      {
        type: "card",
        props: { title: "User Growth", description: "Active users trend" },
        children: [
          {
            type: "chart",
            props: {
              type: "line",
              data: [
                { name: "Week 1", value: 200 },
                { name: "Week 2", value: 350 },
              ],
            },
          },
        ],
      },
      {
        type: "table",
        props: {
          columns: ["User", "Status"],
          data: [
            ["Alice", "Active"],
            ["Bob", "Inactive"],
          ],
        },
      },
    ],
  },

  dashboard3: {
    type: "card",
    props: { title: "Revenue Breakdown", description: "By Product" },
    children: [
      {
        type: "chart",
        props: {
          type: "pie",
          data: [
            { name: "Product A", value: 300 },
            { name: "Product B", value: 200 },
          ],
        },
      },
    ],
  },

  dashboard4: {
    type: "div",
    props: { className: "grid grid-cols-3 gap-6 p-6" },
    children: [
      {
        type: "card",
        props: { title: "Sessions" },
        children: [
          {
            type: "chart",
            props: {
              type: "line",
              data: [
                { name: "Mon", value: 120 },
                { name: "Tue", value: 150 },
              ],
            },
          },
        ],
      },
      {
        type: "card",
        props: { title: "Conversions" },
        children: [
          {
            type: "chart",
            props: {
              type: "bar",
              data: [
                { name: "Week 1", value: 50 },
                { name: "Week 2", value: 70 },
              ],
            },
          },
        ],
      },
    ],
  },
};

export async function getLayout(layoutId: any) {
  return DemoRegistry[layoutId as keyof typeof DemoRegistry] || null;
}
