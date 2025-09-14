import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminStats } from "./AdminStats";
import { AdminAnalytics } from "./AdminAnalytics";
import { ApprovedActivityCard } from "./ApprovedActivityCard";
import { ExportDialog } from "./ExportDialog";
import {
  Search,
  Download,
  BarChart3,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import type { User, Activity } from "../../App";

interface AdminDashboardProps {
  user: User;
  activities: Activity[];
}

export function AdminDashboard({
  user,
  activities,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showExportDialog, setShowExportDialog] =
    useState(false);

  // Get unique activity types for filter
  const activityTypes = Array.from(
    new Set(activities.map((a) => a.type)),
  );

  // Memoize filtered activities to prevent unnecessary recalculations
  const filteredActivities = useMemo(() => {
    if (!activities || activities.length === 0) {
      return [];
    }

    return activities.filter((activity) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        (activity.title &&
          activity.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (activity.studentName &&
          activity.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (activity.type &&
          activity.type
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Type filter
      const matchesType =
        typeFilter === "all" || activity.type === typeFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all" && activity.date) {
        try {
          const activityDate = new Date(activity.date);
          const now = new Date();

          if (!isNaN(activityDate.getTime())) {
            switch (dateFilter) {
              case "this-month":
                matchesDate =
                  activityDate.getMonth() === now.getMonth() &&
                  activityDate.getFullYear() ===
                    now.getFullYear();
                break;
              case "last-month":
                const lastMonth = new Date(
                  now.getFullYear(),
                  now.getMonth() - 1,
                  1,
                );
                matchesDate =
                  activityDate.getMonth() ===
                    lastMonth.getMonth() &&
                  activityDate.getFullYear() ===
                    lastMonth.getFullYear();
                break;
              case "this-year":
                matchesDate =
                  activityDate.getFullYear() ===
                  now.getFullYear();
                break;
              case "last-year":
                matchesDate =
                  activityDate.getFullYear() ===
                  now.getFullYear() - 1;
                break;
            }
          }
        } catch (error) {
          console.warn(
            "Invalid date in activity:",
            activity.date,
          );
          matchesDate = false;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [activities, searchTerm, typeFilter, dateFilter]);

  const handleExport = async (format: "csv" | "pdf") => {
    if (filteredActivities.length === 0) {
      toast.error(
        "No activities to export. Please ensure there are approved activities to include in the report.",
      );
      setShowExportDialog(false);
      return;
    }

    try {
      toast.info(
        `Generating ${format.toUpperCase()} export...`,
      );

      if (format === "csv") {
        exportToCSV(filteredActivities);
        toast.success(
          `CSV export completed! Downloaded ${filteredActivities.length} activities.`,
        );
      } else {
        await exportToPDF(filteredActivities);
        toast.success(
          `PDF export completed! Downloaded ${filteredActivities.length} activities.`,
        );
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(
        `Failed to export ${format.toUpperCase()}. Please try again.`,
      );
    }
    setShowExportDialog(false);
  };

  const exportToCSV = (data: Activity[]) => {
    try {
      const headers = [
        "Student Name",
        "Student ID",
        "Activity Title",
        "Type",
        "Date",
        "Description",
        "Submitted Date",
        "Reviewed Date",
        "Reviewed By",
      ];

      const csvContent = [
        headers.join(","),
        ...data.map((activity) =>
          [
            `"${activity.studentName || ""}"`,
            activity.studentId || "",
            `"${activity.title || ""}"`,
            activity.type || "",
            activity.date || "",
            `"${(activity.description || "").replace(/"/g, '""')}"`,
            activity.submittedAt
              ? new Date(
                  activity.submittedAt,
                ).toLocaleDateString()
              : "",
            activity.reviewedAt
              ? new Date(
                  activity.reviewedAt,
                ).toLocaleDateString()
              : "",
            `"${activity.reviewedBy || ""}"`,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `student-activities-${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(
          "Browser does not support file downloads",
        );
      }
    } catch (error) {
      console.error("CSV export failed:", error);
      throw error;
    }
  };

  const exportToPDF = async (data: Activity[]) => {
    try {
      const doc = new jsPDF();

      // Add header
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Student Activities Report", 20, 30);

      // Add metadata
      doc.setFontSize(12);
      doc.setTextColor(80);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        20,
        45,
      );
      doc.text(`Total Activities: ${data.length}`, 20, 55);

      // Prepare table data
      const tableData = data.map((activity) => [
        activity.studentName,
        activity.studentId,
        activity.title,
        activity.type,
        new Date(activity.date).toLocaleDateString(),
        activity.reviewedBy || "N/A",
      ]);

      // Add table
      autoTable(doc, {
        head: [
          [
            "Student Name",
            "Student ID",
            "Activity Title",
            "Type",
            "Date",
            "Reviewed By",
          ],
        ],
        body: tableData,
        startY: 70,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 70, left: 20, right: 20 },
      });

      // Save the PDF
      const fileName = `student-activities-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.warning(
        "PDF generation failed. Downloading as text file instead.",
      );
      // Fallback to simple text-based export if jsPDF fails
      fallbackTxtExport(data);
    }
  };

  const fallbackTxtExport = (data: Activity[]) => {
    const content = [
      "STUDENT ACTIVITIES REPORT",
      "=".repeat(50),
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Total Activities: ${data.length}`,
      "",
      ...data.map((activity, index) =>
        [
          `${index + 1}. ${activity.title}`,
          `   Student: ${activity.studentName} (${activity.studentId})`,
          `   Type: ${activity.type}`,
          `   Date: ${new Date(activity.date).toLocaleDateString()}`,
          `   Reviewed by: ${activity.reviewedBy || "N/A"}`,
          `   Description: ${activity.description}`,
          "",
        ].join("\n"),
      ),
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `student-activities-${new Date().toISOString().split("T")[0]}.txt`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive view of verified student achievements
          and activities.
        </p>
      </div>

      {/* Quick Stats */}
      <AdminStats activities={activities} />

      {/* Analytics Charts */}
      <AdminAnalytics activities={activities} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter & Search Activities
          </CardTitle>
          <CardDescription>
            Filter and search through approved student
            activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search students, activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="this-month">
                    This Month
                  </SelectItem>
                  <SelectItem value="last-month">
                    Last Month
                  </SelectItem>
                  <SelectItem value="this-year">
                    This Year
                  </SelectItem>
                  <SelectItem value="last-year">
                    Last Year
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                onClick={() => setShowExportDialog(true)}
                className="w-full"
                disabled={filteredActivities.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export ({filteredActivities.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activities">
            <FileText className="h-4 w-4 mr-2" />
            Activities ({filteredActivities.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No activities found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm ||
                    typeFilter !== "all" ||
                    dateFilter !== "all"
                      ? "No activities match your current filters."
                      : "No approved activities yet."}
                  </p>
                  {(searchTerm ||
                    typeFilter !== "all" ||
                    dateFilter !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setTypeFilter("all");
                        setDateFilter("all");
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredActivities.map((activity) => (
                <ApprovedActivityCard
                  key={activity.id}
                  activity={activity}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalytics
            activities={activities}
            detailed={true}
          />
        </TabsContent>
      </Tabs>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        activityCount={filteredActivities.length}
      />
    </main>
  );
}