import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import '../styles/gradients.css';
import { Link } from 'react-router-dom';

// Updated event data for April 30th (single day event) with Google Drive links
const events = [
  {
    id: 1,
    title: "Crack the Penguin",
    club: "LUG",
    date: "April 30, 2025",
    time: "8:45 AM - 10:15 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 2,
    title: "F1 Reaction Time",
    club: "AOEE",
    date: "April 30, 2025",
    time: "8:45 AM - 10:15 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 3,
    title: "Spark Quest",
    club: "IEEE",
    date: "April 30, 2025",
    time: "8:45 AM - 10:15 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 4,
    title: "Marshmallow Tower Challenge",
    club: "SKYLINE",
    date: "April 30, 2025",
    time: "8:45 AM - 10:15 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 5,
    title: "Skribbl.bio",
    club: "CHIMERA",
    date: "April 30, 2025",
    time: "8:45 AM - 10:15 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 6,
    title: "Escape the Matrix",
    club: "ACM",
    date: "April 30, 2025",
    time: "9:00 AM - 10:30 AM",
    venue: "333",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 7,
    title: "STEMSteps",
    club: "SWE",
    date: "April 30, 2025",
    time: "9:15 AM - 10:30 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 8,
    title: "Space Docking",
    club: "SUPERNOVA",
    date: "April 30, 2025",
    time: "10:00 AM - 11:00 AM",
    venue: "Ground Station",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 9,
    title: "Gears & Gadgets",
    club: "ASME",
    date: "April 30, 2025",
    time: "10:00 AM - 10:30 AM",
    venue: "Mech Block",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 10,
    title: "Debate Competition",
    club: "EXPRESSIONS",
    date: "April 30, 2025",
    time: "10:30 AM - 11:30 AM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 11,
    title: "No Code Triwizard Hackathon",
    club: "MTC",
    date: "April 30, 2025",
    time: "10:45 AM - 12:15 PM",
    venue: "332",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 12,
    title: "Fizz Quiz",
    club: "IEI",
    date: "April 30, 2025",
    time: "11:30 AM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 13,
    title: "Hydro Purity Quest",
    club: "AICHE",
    date: "April 30, 2025",
    time: "11:30 AM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 14,
    title: "The Engineers Riddle Road",
    club: "WIE",
    date: "April 30, 2025",
    time: "11:30 AM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 15,
    title: "QR n FONT",
    club: "OH CROP",
    date: "April 30, 2025",
    time: "11:30 PM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 16,
    title: "Tech Taboo",
    club: "ACM-W",
    date: "April 30, 2025",
    time: "11:30 PM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 17,
    title: "Hunter AI",
    club: "Google Developers Group",
    date: "April 30, 2025",
    time: "11:30 PM - 12:15 PM",
    venue: "Auditorium",
    type: "Competition",
    driveLink: "/events"
  },
  {
    id: 18,
    title: "Satellite Tracking",
    club: "MAHASAT",
    date: "April 30, 2025",
    time: "TBA",
    venue: "Ground Station",
    type: "Competition",
    driveLink: "/events"
  }
];


// Event types for filtering
const eventTypes = ["All", "Hackathon", "Workshop", "Competition", "Presentation"];

// Helper function to convert time string to minutes for sorting
const timeToMinutes = (timeStr) => {
  // Handle TBA case
  if (timeStr.includes("TBA")) {
    return Number.MAX_SAFE_INTEGER; // Put TBA events at the end
  }
  
  // Extract start time (format: "HH:MM AM/PM - HH:MM AM/PM")
  const startTime = timeStr.split(" - ")[0];
  const [hourMin, period] = startTime.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);
  
  // Convert to 24-hour format for easier comparison
  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Sort events by starting time and apply filters
  const filteredEvents = useMemo(() => {
    // First sort the events by starting time
    const sortedEvents = [...events].sort((a, b) => {
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
    
    // Then apply the filters
    return sortedEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.club.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || event.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  // Function to handle card click
  const handleCardClick = (driveLink) => {
    window.open(driveLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="scanline fixed top-0 left-0 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-heading">
          <span className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-heading">CLUB EVENTS</span>
        </h1>
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Discover the exciting lineup of parallel sessions happening on April 30, 2025 from 8:45 AM to 12:15 PM.
        </p>
        
        {/* Search and Filter Section */}
        <div className="mb-12 glass-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <Input
                placeholder="Search events or clubs..."
                className="pl-10 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-neon-purple" />
              <select 
                className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {eventTypes.map(type => (
                  <option key={type} value={type} className="bg-black text-white">{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="relative h-full">
                <Card 
                  className="glass-card transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] overflow-hidden group h-full flex flex-col cursor-pointer"
                  onClick={() => handleCardClick(event.driveLink)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-white">{event.title}</CardTitle>
                        <CardDescription className="text-white/70">{event.club}</CardDescription>
                      </div>
                      <div className="relative z-10">
                        <a 
                          href={event.driveLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-neon-purple hover:text-neon-blue transition-colors"
                          title="View event details"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Calendar size={14} className="text-neon-blue" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin size={14} className="text-neon-green" />
                      <span>{event.venue}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-white/70">No events match your search criteria</p>
              <Button 
                variant="outline" 
                className="mt-4 border-white/20 hover:bg-white/5"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Single Register Button */}
        {filteredEvents.length > 0 && (
          <div className="mt-12 text-center">
            <Button asChild className="neon-button px-8 py-3 text-lg">
              <Link to="/registration">Register Now</Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
