import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";
import { Milestone } from "../types";
import { motion, AnimatePresence } from "framer-motion";

import { ScrollArea } from "./ui/scroll-area";

interface TimelineProps {
  milestones: Milestone[];
  onCreateMilestone: (milestone: Partial<Milestone>) => void;
}

export function Timeline({ milestones, onCreateMilestone }: TimelineProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    week: 1,
    status: "pending" as "completed" | "inprogress" | "pending" | "overdue",
  });

  const currentWeek = 5; // Mock current week
  const totalWeeks = 10;

  const handleCreateMilestone = () => {
    if (newMilestone.title && newMilestone.week) {
      onCreateMilestone({
        ...newMilestone,
        projectId: "1",
      });
      setIsCreateModalOpen(false);
      setNewMilestone({ title: "", week: 1, status: "pending" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "inprogress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "inprogress":
        return "bg-blue-600";
      case "overdue":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getProgressPercentage = () => {
    const completedMilestones = milestones.filter(
      (m) => m.status === "completed"
    ).length;
    return (completedMilestones / milestones.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Project Timeline</h1>
          <p className="text-gray-400">Track milestones and project phases</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
              <DialogDescription>
                Add a new milestone to track your project progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Milestone Title</Label>
                <Input
                  placeholder="Enter milestone title"
                  value={newMilestone.title}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, title: e.target.value })
                  }
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Week</Label>
                  <Select
                    value={newMilestone.week.toString()}
                    onValueChange={(value) =>
                      setNewMilestone({
                        ...newMilestone,
                        week: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                        (week) => (
                          <SelectItem key={week} value={week.toString()}>
                            Week {week}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newMilestone.status}
                    onValueChange={(value: any) =>
                      setNewMilestone({ ...newMilestone, status: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleCreateMilestone}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Create Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1">Overall Progress</h3>
              <p className="text-gray-400">
                {milestones.filter((m) => m.status === "completed").length} of{" "}
                {milestones.length} milestones completed
              </p>
            </div>
            <div className="text-3xl text-teal-400">
              {Math.round(getProgressPercentage())}%
            </div>
          </div>
          <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-teal-600 to-blue-600"
            />
          </div>
        </div>
      </Card>

      {/* Timeline Visualization */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Week Headers */}
            <div className="flex mb-8">
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                (week) => (
                  <div
                    key={week}
                    className={`flex-1 text-center pb-2 border-b-2 ${
                      week === currentWeek
                        ? "border-teal-500 text-teal-400"
                        : week < currentWeek
                        ? "border-gray-600 text-gray-400"
                        : "border-gray-700 text-gray-500"
                    }`}
                  >
                    <div className="text-sm">Week {week}</div>
                    {week === currentWeek && (
                      <Badge className="mt-1 bg-teal-600 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const position = ((milestone.week - 1) / totalWeeks) * 100;

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-16"
                  >
                    <div
                      className="absolute top-0 h-full flex items-center"
                      style={{ left: `${position}%` }}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(milestone.status)}
                        <Card className="bg-gray-900 border-gray-700 px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="text-sm">{milestone.title}</h4>
                              <Badge
                                className={`${getStatusColor(
                                  milestone.status
                                )} text-xs mt-1`}
                              >
                                {milestone.status}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* Milestone List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-gray-800 border-gray-700 p-4 hover:border-teal-600 transition-all">
              <div className="flex items-start gap-3">
                {getStatusIcon(milestone.status)}
                <div className="flex-1">
                  <h4 className="mb-1">{milestone.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      Week {milestone.week}
                    </span>
                    <Badge
                      className={`${getStatusColor(milestone.status)} text-xs`}
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
