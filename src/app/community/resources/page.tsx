"use client";

import { useState } from "react";
import { mockResources } from "@/lib/mock-data";
import { Resource } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Video,
  FileText,
  Wrench,
  GraduationCap,
  Heart,
  Bookmark,
  Clock,
  Crown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "tool":
        return <Wrench className="h-5 w-5" />;
      case "course":
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesDifficulty =
      selectedDifficulty === "all" || resource.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Discover curated resources to help you build better habits and achieve your goals.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="tool">Tools</SelectItem>
            <SelectItem value="course">Courses</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge
                    variant={resource.difficulty === "beginner" ? "default" : 
                            resource.difficulty === "intermediate" ? "secondary" : "destructive"}
                  >
                    {resource.difficulty}
                  </Badge>
                </div>
                {resource.isPremium && (
                  <Badge variant="premium" className="bg-yellow-500/10 text-yellow-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {resource.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {resource.likes}
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  {resource.saves}
                </div>
              </div>
              <Button variant="secondary" size="sm">
                View Resource
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
