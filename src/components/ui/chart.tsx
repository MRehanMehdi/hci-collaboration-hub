"use client";

import * as React from "react";
import * as Recharts from "recharts";
import { cn } from "./utils";

// Themes
const THEMES = { light: "", dark: ".dark" } as const;

// Config type
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// Context
type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context)
    throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

// ------------------------------
// Chart Container
// ------------------------------
interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ReactNode;
  id?: string;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ------------------------------
// Chart Styles (Dynamic Colors / Themes)
// ------------------------------
interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

const ChartStyle = ({ id, config }: ChartStyleProps) => {
  const colorConfig = Object.entries(config).filter(
    ([_, cfg]) => cfg.theme || cfg.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// ------------------------------
// Chart Tooltip
// ------------------------------
const ChartTooltip = Recharts.Tooltip;

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (value: any, payload?: any[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (...args: any[]) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel = false,
  hideIndicator = false,
  color,
  nameKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn("bg-background border px-2 py-1 rounded shadow", className)}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.name || item.dataKey || "value";
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        const indicatorColor = color || item.payload?.fill || item.color;

        return (
          <div key={index} className="flex items-center gap-2">
            {!hideIndicator && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: indicatorColor }}
              />
            )}
            {!hideLabel && <span>{itemConfig?.label || item.name}</span>}
            {item.value != null && <span>{item.value}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ------------------------------
// Chart Legend
// ------------------------------
const ChartLegend = Recharts.Legend;

interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: any[];
  verticalAlign?: "top" | "bottom" | "middle";
  nameKey?: string;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.dataKey || "value";
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={index}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// ------------------------------
// Helper
// ------------------------------
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
) {
  if (!payload || typeof payload !== "object") return undefined;

  const payloadInner =
    "payload" in payload && typeof payload.payload === "object"
      ? payload.payload
      : undefined;
  const labelKey =
    key in payload && typeof payload[key] === "string"
      ? payload[key]
      : payloadInner?.[key] || key;

  return config[labelKey] || config[key];
}

// ------------------------------
// Exports
// ------------------------------
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
