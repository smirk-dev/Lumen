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
import { UserManagement } from "./UserManagement";
import {
  Search,
  Download,
  BarChart3,
  FileText,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "../ui/use-mobile";
import type { User, Activity, AdminDashboardProps } from "../../types";

export function AdminDashboard({
  activities,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showExportDialog, setShowExportDialog] =
    useState(false);
  const isMobile = useIsMobile();

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
    <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Comprehensive view of verified student achievements
          and activities.
        </p>
      </div>

      {/* Quick Stats */}
      <AdminStats activities={activities} />

      {/* Analytics Charts */}
      <AdminAnalytics activities={activities} />

      {/* Filters and Search - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Filter & Search Activities
          </CardTitle>
          <CardDescription className="text-sm">
            Filter and search through approved student
            activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Input
                placeholder={isMobile ? "Search..." : "Search students, activities..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
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
                className="w-full h-10"
                disabled={filteredActivities.length === 0}
                size={isMobile ? "sm" : "default"}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export ({filteredActivities.length})</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs - Mobile Optimized */}
      <Tabs defaultValue="activities" className="space-y-4 sm:space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 sm:gap-0 min-w-max sm:min-w-0">
            <TabsTrigger value="activities" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Activities</span>
              <span className="sm:hidden">Data</span>
              ({filteredActivities.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">User Management</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="activities">
          <div className="space-y-3 sm:space-y-4">
            {filteredActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    No activities found
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
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
                      size={isMobile ? "sm" : "default"}
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

        <TabsContent value="users">
          <UserManagement
            users={users}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
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