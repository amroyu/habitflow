"use client";

import { useState, useEffect } from "react";
import { ResourceHub } from "@/types/resources";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Filter,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export interface ResourcesSectionProps {
  resources: ResourceHub[];
}

export function ResourcesSection({ resources: initialResources }: ResourcesSectionProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [resources, setResources] = useState<ResourceHub[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const getTypeIcon = (type: ResourceHub["type"]) => {
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
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: ResourceHub["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500";
      case "advanced":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredResources = resources
    .filter((resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((resource) => (selectedType === "all" ? true : resource.type === selectedType));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedType("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("article")}>
                Articles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("video")}>
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("book")}>
                Books
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("tool")}>
                Tools
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("course")}>
                Courses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge variant="secondary">{resource.type}</Badge>
                  {resource.isPremium && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={getDifficultyColor(resource.difficulty)}
                >
                  {resource.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <img
                  src={resource.author.avatar}
                  alt={resource.author.name}
                  className="h-6 w-6 rounded-full"
                />
                <span>{resource.author.name}</span>
                {resource.author.credentials?.map((credential, index) => (
                  <Badge key={index} variant="outline">
                    {credential}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {resource.likes}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  {resource.saves}
                </Button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {resource.readTime}
                </div>
              </div>
              <Button variant="default" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  View Resource
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredResources.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No resources found matching your search.
        </div>
      )}
    </div>
  );
}
