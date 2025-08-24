import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-university.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/20 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-primary/10 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            Supporting students and tutors in their{" "}
            <span className="text-primary font-bold">academic journey</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
            Access course materials, collaborate on projects, and connect with your academic community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="shadow-button transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/signup" className="flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="shadow-button transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/courses" className="flex items-center gap-2">
                Browse Courses <BookOpen className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-card">
              <BookOpen className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Course Materials</h3>
              <p className="text-muted-foreground text-sm text-center">Access videos, notes, and resources for all your courses</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-card">
              <Users className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Collaboration</h3>
              <p className="text-muted-foreground text-sm text-center">Work together on projects and get help from tutors</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-card">
              <ArrowRight className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Academic Growth</h3>
              <p className="text-muted-foreground text-sm text-center">Connect with mentors and enhance your learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;