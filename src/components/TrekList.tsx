
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mountain, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface TrekListProps {
  onTrekSelect: (trek: Trek) => void;
}

const TrekList: React.FC<TrekListProps> = ({ onTrekSelect }) => {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const { data, error } = await supabase
        .from('treks')
        .select('*')
        .limit(10);

      if (error) throw error;
      setTreks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading treks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'easy-moderate':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficult':
        return 'bg-orange-100 text-orange-800';
      case 'very difficult':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Mountain className="h-8 w-8" />
          Top Treks in India
        </h2>
        <p className="text-gray-600">Discover the most breathtaking trekking destinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((trek) => (
          <Card key={trek.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-48 overflow-hidden">
              <img 
                src={trek.image_url} 
                alt={trek.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{trek.name}</CardTitle>
                <Badge className={getDifficultyColor(trek.difficulty_level)}>
                  {trek.difficulty_level}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {trek.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">{trek.description}</p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {trek.duration_days} days
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {trek.best_season}
                </div>
              </div>

              <Button 
                onClick={() => onTrekSelect(trek)}
                className="w-full"
                variant="outline"
              >
                View Details & Comments
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrekList;
