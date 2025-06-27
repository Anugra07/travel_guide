
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Map, Mountain } from 'lucide-react';
import TripPlanner from '@/components/TripPlanner';
import TrekList from '@/components/TrekList';
import Comments from '@/components/Comments';

interface Trek {
  id: string;
  name: string;
  location: string;
  difficulty_level: string;
  duration_days: number;
  best_season: string;
  description: string;
  image_url: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);

  const handleTrekSelect = (trek: Trek) => {
    setSelectedTrek(trek);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Travel Planner</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user?.email}</span>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="trip-planner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trip-planner" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Trip Planner
            </TabsTrigger>
            <TabsTrigger value="treks" className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Trek Recommendations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trip-planner" className="mt-6">
            <TripPlanner />
          </TabsContent>
          
          <TabsContent value="treks" className="mt-6">
            {selectedTrek ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedTrek.name}</CardTitle>
                        <CardDescription>{selectedTrek.location}</CardDescription>
                      </div>
                      <Button onClick={() => setSelectedTrek(null)} variant="outline">
                        Back to Treks
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <img 
                          src={selectedTrek.image_url} 
                          alt={selectedTrek.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-700">{selectedTrek.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Difficulty:</strong> {selectedTrek.difficulty_level}
                          </div>
                          <div>
                            <strong>Duration:</strong> {selectedTrek.duration_days} days
                          </div>
                          <div className="col-span-2">
                            <strong>Best Season:</strong> {selectedTrek.best_season}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Comments location={selectedTrek.name} />
              </div>
            ) : (
              <TrekList onTrekSelect={handleTrekSelect} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
