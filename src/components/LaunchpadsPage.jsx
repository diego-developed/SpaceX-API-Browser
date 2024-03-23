import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import noImage from '../assets/no-image.svg';

function LaunchpadsPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [launchpads, setLaunchpads] = useState([]);
  const [hasNext, setHasNext] = useState(false); // Assuming less than 10 launchpads initially
  const [notFound, setNotFound] = useState(false);
  const currentPage = parseInt(page, 10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunchpads = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/launchpads`);
        const paginatedLaunchpads = response.data.slice(currentPage * 10, (currentPage + 1) * 10);
        setLaunchpads(paginatedLaunchpads);
        setHasNext(response.data.length > ((currentPage + 1) * 10));
        setNotFound(paginatedLaunchpads.length === 0);
      } catch (error) {
        console.error("Failed to fetch launchpads", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchpads();
  }, [currentPage]);

  const handlePrevious = () => {
    navigate(`/launchpads/page/${currentPage - 1}`);
  };

  const handleNext = () => {
    navigate(`/launchpads/page/${currentPage + 1}`);
  };

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading Launch Pads...</Typography>;
  }

  if (notFound) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography gutterBottom variant="h6" component="div">Error (404): Launch Pads not found.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography gutterBottom variant="h5" component="div">
        SpaceX Launch Pads
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {launchpads.map((launchpad) => (
          <Card 
            key={launchpad.id} 
            sx={{ 
              maxWidth: 300,
              mb: 2, 
              flex: '1 0 18%'
            }}
          >
            <CardMedia
              component="img"
              image={launchpad.images?.large[0] || noImage} 
              alt={launchpad.name}
              sx={{ height: 140, objectFit: 'contain' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {launchpad.name}
              </Typography>
              <Link to={`/launchpads/${launchpad.id}`} style={{ textDecoration: 'none' }}>
                <Button size="small">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {currentPage > 0 && (
          <Button onClick={handlePrevious} variant="contained" color="primary">
            Previous
          </Button>
        )}
        {!hasNext && currentPage !== 0 && (
          <Button onClick={handleNext} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
            Next
          </Button>
        )}
      </div>
    </div>
  );  
}

export default LaunchpadsPage;
