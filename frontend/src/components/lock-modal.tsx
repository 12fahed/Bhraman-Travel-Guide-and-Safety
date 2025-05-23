import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface CapsuleLockModalProps {
  capsuleId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CapsuleLockModal: React.FC<CapsuleLockModalProps> = ({
  capsuleId,
  isOpen,
  onOpenChange,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPermanentLock, setIsPermanentLock] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertToIST = (date: string, time: string) => {
    const [year, month, day] = date.split("-"); // Assuming `date` is in YYYY-MM-DD format
    const [hours, minutes] = time.split(":"); // Assuming `time` is in HH:mm format

    // Create a Date object in UTC
    const utcDate = new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        0
      )
    );

    // Adjust to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format IST date to ISO string without the `Z` (because it's not UTC)
    return istDate.toISOString().replace("Z", "");
  };

  const handleSubmit = async () => {
    if (!isPermanentLock && (!date || !time)) {
      toast.error("Provide date/time or select permanent lock");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/capsule/lock-capsule", {
        capsuleId,
        isPermanentLock,
        unlockDate: convertToIST(date, time),
      });

      if (res.data.success) toast.success("Capsule locked successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to lock capsule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lock Capsule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lockDate" className="text-right">
              Date
            </Label>
            <Input
              id="lockDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lockTime" className="text-right">
              Time
            </Label>
            <Input
              id="lockTime"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="permanentLock"
              checked={isPermanentLock}
              onCheckedChange={(checked) => setIsPermanentLock(!!checked)}
            />
            <Label htmlFor="permanentLock">Permanent Lock</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Locking..." : "Lock Capsule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
