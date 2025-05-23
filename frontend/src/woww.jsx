import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function JsonHostingUI() {
  const [activities, setActivities] = useState({ data: [], page: 1, limit: 5, total: 0 });
  const [activityParams, setActivityParams] = useState({ page: 1, limit: 5 });
  const [filters, setFilters] = useState({});

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/activities', { params: activityParams });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activityParams]);

  const handleActivityPageChange = (newPage) => {
    setActivityParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities.data.filter((activity) => {
    return Object.entries(filters).every(([key, value]) => 
      activity[key]?.toString().toLowerCase().includes(value.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Destinations and Activities</h1>

        <section className="mb-12">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter by key..."
              className="p-2 border rounded mr-2"
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by location..."
              className="p-2 border rounded mr-2"
              onChange={(e) => handleFilterChange('locationName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by time of day..."
              className="p-2 border rounded"
              onChange={(e) => handleFilterChange('timeOfDay', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => (
              <Card key={index}>
                <CardContent>
                  <h3 className="text-xl font-semibold">{activity.name}</h3>
                  <img 
                    src={activity.imageUrl} 
                    alt={activity.name} 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                  <p className="mt-2">{activity.description}</p>
                  <p className="mt-2"><strong>Location:</strong> {activity.locationName}</p>
                  <p><strong>Duration:</strong> {activity.duration} hours</p>
                  <p><strong>Price:</strong> {activity.price}/5</p>
                  <p><strong>Time of Day:</strong> {activity.timeOfDay}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button 
              onClick={() => handleActivityPageChange(activityParams.page - 1)} 
              disabled={activityParams.page <= 1}
            >
              Previous
            </Button>
            <span>
              Page {activities.page} of {Math.ceil(activities.total / activities.limit)}
            </span>
            <Button 
              onClick={() => handleActivityPageChange(activityParams.page + 1)} 
              disabled={activities.page >= Math.ceil(activities.total / activities.limit)}
            >
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
