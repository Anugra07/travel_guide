
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TripResult {
  id: string;
  from_location: string;
  to_location: string;
  transport_options: any;
  homestays: any;
  eateries: any;
}

const TripPlanner = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripResult, setTripResult] = useState<TripResult | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Mock data for demonstration - in a real app, you'd call external APIs
      const mockTripData = {
        from_location: fromLocation,
        to_location: toLocation,
        transport_options: [
          { type: 'Train', price: '₹500-800', duration: '8-12 hours', provider: 'Indian Railways' },
          { type: 'Bus', price: '₹300-600', duration: '10-14 hours', provider: 'State Transport' },
          { type: 'Flight', price: '₹3000-8000', duration: '1-2 hours', provider: 'Various Airlines' }
        ],
        homestays: [
          { name: 'Mountain View Homestay', price: '₹1200/night', rating: 4.5, contact: '+91-9876543210' },
          { name: 'Local Family Stay', price: '₹800/night', rating: 4.2, contact: '+91-9876543211' },
          { name: 'Heritage Home', price: '₹1500/night', rating: 4.7, contact: '+91-9876543212' }
        ],
        eateries: [
          { name: 'Local Dhaba', cuisine: 'North Indian', price: '₹100-200', rating: 4.3 },
          { name: 'Mountain Cafe', cuisine: 'Continental', price: '₹200-400', rating: 4.1 },
          { name: 'Street Food Corner', cuisine: 'Local', price: '₹50-150', rating: 4.6 }
        ]
      };

      // Save to database
      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          from_location: fromLocation,
          to_location: toLocation,
          transport_options: mockTripData.transport_options,
          homestays: mockTripData.homestays,
          eateries: mockTripData.eateries,
        })
        .select()
        .single();

      if (error) throw error;

      setTripResult(data);
      toast({
        title: "Trip planned successfully!",
        description: `Found travel options from ${fromLocation} to ${toLocation}`,
      });
    } catch (error: any) {
      toast({
        title: "Error planning trip",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Plan Your Journey
          </CardTitle>
          <CardDescription>
            Find the best travel options, homestays, and local eateries for your destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="From (e.g., Delhi, Mumbai)"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                required
              />
              <Input
                placeholder="To (e.g., Manali, Goa)"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search Travel Options'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {tripResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transport Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tripResult.transport_options?.map((option: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-semibold">{option.type}</h4>
                  <p className="text-sm text-gray-600">Price: {option.price}</p>
                  <p className="text-sm text-gray-600">Duration: {option.duration}</p>
                  <p className="text-sm text-gray-600">Provider: {option.provider}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Homestays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tripResult.homestays?.map((stay: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-semibold">{stay.name}</h4>
                  <p className="text-sm text-gray-600">Price: {stay.price}</p>
                  <p className="text-sm text-gray-600">Rating: {stay.rating}/5</p>
                  <p className="text-sm text-gray-600">Contact: {stay.contact}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Eateries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tripResult.eateries?.map((eatery: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-semibold">{eatery.name}</h4>
                  <p className="text-sm text-gray-600">Cuisine: {eatery.cuisine}</p>
                  <p className="text-sm text-gray-600">Price: {eatery.price}</p>
                  <p className="text-sm text-gray-600">Rating: {eatery.rating}/5</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
