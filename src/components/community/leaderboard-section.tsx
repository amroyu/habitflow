"use client";

import { LeaderboardEntry } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, Award, Crown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export function LeaderboardSection({ entries, currentUserId }: LeaderboardSectionProps) {
  const sortedEntries = [...entries].sort((a, b) => b.points - a.points);
  const top10 = sortedEntries.slice(0, 10);
  const currentUserIndex = sortedEntries.findIndex(entry => entry.userId === currentUserId);
  const currentUserRank = currentUserIndex + 1;

  // Get entries around current user (2 above and 2 below)
  const getUserContext = () => {
    if (currentUserIndex < 0) return [];
    
    const start = Math.max(10, currentUserIndex - 2);
    const end = Math.min(sortedEntries.length, currentUserIndex + 3);
    return sortedEntries.slice(start, end);
  };

  const userContext = getUserContext();

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-yellow-500">1st</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center space-x-2">
            <Medal className="h-5 w-5 text-gray-400" />
            <span className="font-bold text-gray-400">2nd</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center space-x-2">
            <Medal className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-amber-600">3rd</span>
          </div>
        );
      default:
        return <span className="font-medium">{rank}th</span>;
    }
  };

  const renderUserRow = (entry: LeaderboardEntry, index: number) => {
    const rank = sortedEntries.findIndex(e => e.userId === entry.userId) + 1;
    return (
      <TableRow 
        key={entry.userId}
        className={cn(
          entry.userId === currentUserId && "bg-primary/5"
        )}
      >
        <TableCell>{getRankBadge(rank)}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={entry.avatar} alt={entry.username} />
              <AvatarFallback>{entry.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{entry.username}</p>
              {entry.teamId && (
                <Badge variant="outline" className="mt-1">
                  Team Member
                </Badge>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Badge variant="secondary">Level {entry.level}</Badge>
        </TableCell>
        <TableCell className="text-right font-medium">
          {entry.points.toLocaleString()}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-1">
            <Award className="h-4 w-4" />
            <span>{entry.achievements.length}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Top 10 Achievers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Achievements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top10.map((entry) => renderUserRow(entry))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {currentUserRank > 10 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Your Position</CardTitle>
              <div className="text-sm text-muted-foreground">
                Total Players: {sortedEntries.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Achievements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUserIndex > 12 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-2">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <ChevronUp className="h-4 w-4" />
                        <span className="ml-2">{currentUserIndex - 12} more players</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {userContext.map((entry) => renderUserRow(entry))}
                {currentUserIndex < sortedEntries.length - 3 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-2">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <ChevronDown className="h-4 w-4" />
                        <span className="ml-2">{sortedEntries.length - (currentUserIndex + 3)} more players</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
