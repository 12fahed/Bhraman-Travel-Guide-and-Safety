import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ActivityDestinationFilter = () => {
    const [activities, setActivities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async (endpoint, params) => {
        const queryString = new URLSearchParams({ ...params, page }).toString();
        const response = await fetch(`http://127.0.0.1:5000/${endpoint}?${queryString}`);
        return response.json();
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            const activityData = await fetchData('activities', filters);
            const destinationData = await fetchData('destinations', filters);
            setActivities(activityData?.items || []);
            setDestinations(destinationData?.items || []);
            setTotalPages(Math.max(activityData?.totalPages || 1, destinationData?.totalPages || 1));
        } catch (error) {
            console.error('Error fetching data:', error);
            setActivities([]);
            setDestinations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters(); // Initial fetch or page change
    }, [page]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Activity & Destination Finder</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Input placeholder="Destination" onChange={(e) => handleFilterChange('destination', e.target.value)} />
                <Input placeholder="Country" onChange={(e) => handleFilterChange('country', e.target.value)} />
                <Input placeholder="Time of Day" onChange={(e) => handleFilterChange('timeOfDay', e.target.value)} />
                <Input placeholder="Tags" onChange={(e) => handleFilterChange('tags', e.target.value)} />
                <Button onClick={() => { setPage(1); applyFilters(); }}>Apply Filters</Button>
            </div>

            {loading ? (
                <p className="text-center text-lg">Loading...</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-3">Activities</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {activities.length > 0 ? activities.map((activity, index) => (
                            <Card key={index}>
                                <img src={activity.imageUrl} alt={activity.name} className="w-full h-48 object-cover" />
                                <CardContent>
                                    <h3 className="text-lg font-bold">{activity.name}</h3>
                                    <p>{activity.description}</p>
                                </CardContent>
                            </Card>
                        )) : <p>No activities found.</p>}
                    </div>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Destinations</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {destinations.length > 0 ? destinations.map((destination, index) => (
                            <Card key={index}>
                                <img src={destination.imageUrl} alt={destination.name} className="w-full h-48 object-cover" />
                                <CardContent>
                                    <h3 className="text-lg font-bold">{destination.name}</h3>
                                    <p>{destination.knownFor}</p>
                                </CardContent>
                            </Card>
                        )) : <p>No destinations found.</p>}
                    </div>
                </>
            )}

            <div className="flex justify-between items-center mt-6">
                <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </Button>
                <span>{`Page ${page} of ${totalPages}`}</span>
                <Button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ActivityDestinationFilter;
