import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  DollarSign,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as XLSX from "xlsx";
import AdminashboardSkeleton from "../components/skeleton/AdminDashboardSkeleton";
import {
  useRestaurantsPerformanceQuery,
  useRestaurantsQuery,
  useRestaurantStatisticsQuery,
  useStatisticsQuery,
  useTotalSellingItemsQuery,
} from "../store/apiSlice/apiSlice";

// --- دالة مساعدة محدثة لتصدير البيانات مع دعم عدة أوراق عمل ---
const exportToExcelMultiSheet = (sheets, fileName) => {
  const wb = XLSX.utils.book_new();
  for (const sheetName in sheets) {
    const ws = XLSX.utils.json_to_sheet(sheets[sheetName]);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

function AdminDashboard() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const { data: statistics, isError, isLoading } = useStatisticsQuery();
  const {
    data: restaurantsPerformance,
    isError: restaurantsPerformanceIsError,
    isLoading: restaurantsPerformanceIsLoading,
  } = useRestaurantsPerformanceQuery();
  const {
    data: totalSellingItems,
    isError: totalSellingItemsIsError,
    isLoading: totalSellingItemsIsLoading,
  } = useTotalSellingItemsQuery();
  const { data: allRestaurants } = useRestaurantsQuery();
  const {
    data: restaurantStatistics,
    isError: restaurantStatisticsIsError,
    isLoading: restaurantStatisticsIsLoading,
  } = useRestaurantStatisticsQuery(selectedRestaurant, {
    skip: selectedRestaurant === "all",
  });

  const restaurantName =
    selectedRestaurant !== "all"
      ? allRestaurants?.find((r) => r.id === selectedRestaurant)?.name
      : "";

  console.log(restaurantStatistics);

  if (
    isLoading ||
    restaurantsPerformanceIsLoading ||
    totalSellingItemsIsLoading ||
    restaurantStatisticsIsLoading
  ) {
    return <AdminashboardSkeleton />;
  }

  if (
    isError ||
    restaurantsPerformanceIsError ||
    totalSellingItemsIsError ||
    restaurantStatisticsIsError
  ) {
    return <div>Error fetching statistics.</div>;
  }

  const {
    activeRestaurants ,
    averageSatisfaction,
    total_orders,
    total_revenue,
  } = statistics;

  const {
    branches_stats,
    average_rating: restaurantSatisfaction,
    total_orders: restaurantTotal_orders,
    total_revenue: restaurantTotal_revenue,
    packageStats,
  } = restaurantStatistics || {};

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    orders: { label: "Orders", color: "hsl(var(--chart-2))" },
  };

  const topRestaurants =
    selectedRestaurant !== "all"
      ? [
          {
            name: restaurantName,
            revenue: restaurantTotal_revenue,
            orders: restaurantTotal_orders,
          },
        ]
      : restaurantsPerformance?.data.map((restaurant) => {
          return {
            name: restaurant.RestaurantName,
            revenue: restaurant.TotalRevenue,
            orders: restaurant.TotalOrders,
          };
        });

  const topItems =
    selectedRestaurant !== "all"
      ? packageStats.map((item) => {
          return {
            name: item.package_name,
            orders: item.total_orders,
            revenue: item.total_revenue,
          };
        })
      : totalSellingItems?.data.map((item) => {
          return {
            name: item.PackageName,
            orders: item.TotalOrders,
            revenue: item.TotalRevenue,
          };
        });

  const isSystemView = selectedRestaurant === "all";
  const title = isSystemView
    ? "Admin Dashboard"
    : `${restaurantName} Performance`;
  const kpiTitle = isSystemView ? "System" : "Restaurant";
  const performanceTitle = isSystemView
    ? "Top Restaurants Performance"
    : "Restaurant Performance";
  const performanceDescription = isSystemView
    ? "Comparison of top-performing restaurants."
    : "Comparison of restaurant performance.";
  const branchesOrRestaurantsLabel = isSystemView
    ? "Active Restaurants"
    : "Active Branches";

  const handleExportAll = () => {
    if (!allRestaurants) return;

    const viewType = isSystemView
      ? "system-wide"
      : allRestaurants
          .find((r) => r.id === selectedRestaurant)
          ?.name.replace(/\s+/g, "-");
    const fileName = `full-report-${viewType}-${new Date()
      .toISOString()
      .slice(0, 10)}`;

    // 1. تنسيق البيانات لكل ورقة عمل
    const summarySheet = [
      {
        Metric: `Total ${kpiTitle} Revenue (SAR)`,
        Value: selectedRestaurant ? restaurantTotal_revenue : total_revenue,
      },
      {
        Metric: `Total ${kpiTitle} Orders`,
        Value: selectedRestaurant ? restaurantTotal_orders : total_orders,
      },
      {
        Metric: branchesOrRestaurantsLabel,
        Value: selectedRestaurant ? branches_stats.length : activeRestaurants,
      },
      {
        Metric: "Average Satisfaction",
        Value: selectedRestaurant
          ? restaurantSatisfaction
          : averageSatisfaction,
      },
    ];

    const performanceSheet = topRestaurants.map((item) => ({
      [isSystemView ? "Restaurant" : "Branch"]: item.name,
      "Revenue (SAR)": item.revenue,
      Orders: item.orders,
    }));

    const topItemsSheet = topItems.map((item) => ({
      "Item Name": item.name,
      "Number of Orders": item.orders,
      "Total Revenue (SAR)": item.revenue,
    }));

    // 2. تجميع أوراق العمل في كائن واحد
    const sheets = {
      Summary: summarySheet,
      Performance: performanceSheet,
      "Top Selling Items": topItemsSheet,
    };

    // 3. استدعاء دالة التصدير
    exportToExcelMultiSheet(sheets, fileName);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-(--primaryFont)">{title}</h1>
          <div className="flex gap-2">
            <Select
              value={selectedRestaurant}
              onValueChange={setSelectedRestaurant}
              className="text-(--primaryFont)"
            >
              <SelectTrigger className="w-full md:w-[220px]  text-(--primaryFont)">
                <SelectValue placeholder="Select a Restaurant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Restaurants</SelectItem>
                {allRestaurants?.map((restaurant) => (
                  <SelectItem
                    key={restaurant.id}
                    value={restaurant.id}
                    className="text-(--primaryFont)"
                  >
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportAll}
              variant="outline"
              className="text-(--primaryFont)"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export Full Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Total {kpiTitle} Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--secondaryFont)">
                SAR{" "}
                {selectedRestaurant !== "all"
                  ? restaurantTotal_revenue
                  : total_revenue}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Total {kpiTitle} Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--secondaryFont)">
                {selectedRestaurant !== "all"
                  ? restaurantTotal_orders
                  : total_orders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                {branchesOrRestaurantsLabel}
              </CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--secondaryFont)">
                {selectedRestaurant !== "all"
                  ? branches_stats.length
                  : activeRestaurants}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Average Satisfaction
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--secondaryFont)">
                {selectedRestaurant !== "all"
                  ? restaurantSatisfaction
                  : averageSatisfaction}{" "}
                / 5.0
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-(--primaryFont)">
              {performanceTitle}
            </CardTitle>
            <CardDescription>{performanceDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <BarChart
                data={topRestaurants}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-(--secondaryFont)"
                  // The 'stroke' prop for XAxis text color is inherited from the className
                />
                <YAxis
                  yAxisId="left"
                  stroke="var(--primary)" // CORRECT: Use CSS variable for the axis line/tick color
                  tickFormatter={(value) => `${value / 1000}k`}
                  className="text-(--secondaryFont)"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--secondary)" // CORRECT: Use a different color for the second axis
                  className="text-(--secondaryFont)"
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="var(--primary)" // CORRECT: Use CSS variable for the bar fill color
                  radius={4}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="var(--secondary)" // CORRECT: Use a different color for the second bar
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-(--primaryFont)">
              Top Selling Items
            </CardTitle>
            <CardDescription>
              The most popular items{" "}
              {isSystemView
                ? "across the entire system"
                : "for this restaurant"}
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-(--primaryFont)">Item</TableHead>
                  <TableHead className="text-center text-(--primaryFont)">
                    Number of Orders
                  </TableHead>
                  <TableHead className="text-right text-(--primaryFont)">
                    Total Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-(--secondaryFont)">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center text-(--secondaryFont)">
                      {item.orders}
                    </TableCell>
                    <TableCell className="text-right text-(--secondaryFont)">
                      SAR {item.revenue?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default AdminDashboard;
