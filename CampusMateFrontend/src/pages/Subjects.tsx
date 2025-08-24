import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Users, Clock, Calendar, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const subjects = [
    {
      id: 1,
      code: "CS301",
      name: "Data Structures & Algorithms",
      department: "Computer Science",
      credits: 6,
      semester: "Fall",
      year: "3rd Year",
      professor: "Dr. Nagy László",
      description: "Comprehensive study of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Advanced algorithms for searching, sorting, and optimization.",
      prerequisites: ["CS201 - Programming Fundamentals", "MATH201 - Discrete Mathematics"],
      topics: ["Arrays & Linked Lists", "Trees & Graphs", "Sorting Algorithms", "Dynamic Programming", "Graph Algorithms"],
      difficulty: "Advanced",
      rating: 4.6,
      enrolledStudents: 156
    },
    {
      id: 2,
      code: "CS302",
      name: "Database Management Systems",
      department: "Computer Science",
      credits: 5,
      semester: "Fall",
      year: "3rd Year",
      professor: "Dr. Kovács Anna",
      description: "Design and implementation of database systems. Covers relational model, SQL, normalization, transactions, and database security.",
      prerequisites: ["CS201 - Programming Fundamentals"],
      topics: ["Relational Model", "SQL Queries", "Database Design", "Normalization", "Transactions", "Security"],
      difficulty: "Intermediate",
      rating: 4.4,
      enrolledStudents: 134
    },
    {
      id: 3,
      code: "MATH201",
      name: "Advanced Mathematics",
      department: "Mathematics",
      credits: 8,
      semester: "Fall",
      year: "2nd Year",
      professor: "Dr. Szabó Péter",
      description: "Linear algebra, calculus, and mathematical analysis essential for computer science applications. Includes eigenvalues, derivatives, and optimization theory.",
      prerequisites: ["MATH101 - Calculus I"],
      topics: ["Linear Algebra", "Multivariable Calculus", "Eigenvalues & Eigenvectors", "Optimization Theory"],
      difficulty: "Advanced",
      rating: 4.2,
      enrolledStudents: 89
    },
    {
      id: 4,
      code: "CS401",
      name: "Software Engineering",
      department: "Computer Science",
      credits: 6,
      semester: "Spring",
      year: "4th Year",
      professor: "Dr. Molnár Katalin",
      description: "Software development lifecycle, project management, and engineering best practices. Team projects and real-world applications.",
      prerequisites: ["CS301 - Data Structures", "CS302 - Database Systems"],
      topics: ["SDLC", "Agile Methodologies", "Testing", "Documentation", "Team Collaboration", "Project Management"],
      difficulty: "Advanced",
      rating: 4.8,
      enrolledStudents: 112
    },
    {
      id: 5,
      code: "PHYS201",
      name: "Physics for Engineers",
      department: "Physics",
      credits: 6,
      semester: "Spring",
      year: "2nd Year",
      professor: "Dr. Tóth Balázs",
      description: "Classical mechanics, thermodynamics, and electromagnetism with engineering applications. Laboratory sessions included.",
      prerequisites: ["MATH101 - Calculus I", "PHYS101 - General Physics"],
      topics: ["Classical Mechanics", "Thermodynamics", "Electromagnetism", "Wave Physics", "Laboratory Work"],
      difficulty: "Intermediate",
      rating: 4.1,
      enrolledStudents: 78
    },
    {
      id: 6,
      code: "BUS301",
      name: "Business Analytics",
      department: "Business",
      credits: 5,
      semester: "Fall",
      year: "3rd Year",
      professor: "Dr. Horváth Zsuzsanna",
      description: "Statistical analysis and data-driven decision making in business. Covers regression analysis, forecasting, and business intelligence.",
      prerequisites: ["STAT201 - Statistics", "BUS201 - Business Fundamentals"],
      topics: ["Statistical Analysis", "Regression Models", "Forecasting", "Business Intelligence", "Data Visualization"],
      difficulty: "Intermediate",
      rating: 4.3,
      enrolledStudents: 92
    }
  ];

  const departments = ["all", "Computer Science", "Mathematics", "Physics", "Business", "Engineering"];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || subject.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Subject Information</h1>
            <p className="text-xl text-muted-foreground">
              Detailed information about all university subjects and courses
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-card rounded-lg border shadow-card">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search subjects, codes, or professors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject List */}
          <div className="space-y-6">
            {filteredSubjects.map(subject => (
              <Card key={subject.id} className="hover:shadow-elegant transition-all duration-300 border border-border">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-sm font-mono">
                          {subject.code}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(subject.difficulty)}`}>
                          {subject.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{subject.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{subject.name}</CardTitle>
                      <CardDescription>
                        {subject.professor} • {subject.department}
                      </CardDescription>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{subject.enrolledStudents} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{subject.credits} credits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{subject.semester} • {subject.year}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="topics">Topics</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {subject.description}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="topics" className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map(topic => (
                          <Badge key={topic} variant="outline" className="text-sm">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Prerequisites:</h4>
                        {subject.prerequisites.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                            {subject.prerequisites.map(prereq => (
                              <li key={prereq}>{prereq}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No prerequisites required</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end mt-6">
                    <Button variant="outline">
                      View Course Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No subjects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;