import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import noImage from '../assets/no-image.svg';

function RocketsPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [rockets, setRockets] = useState([]);
  const [hasNext, setHasNext] = useState(false); // Initially false, since less than 10 rockets
  const [notFound, setNotFound] = useState(false);
  const currentPage = parseInt(page, 10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRockets = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/rockets`);
        const paginatedRockets = response.data.slice(currentPage * 10, (currentPage * 10) + 10);
        setRockets(paginatedRockets);
        setHasNext(response.data.length > ((currentPage + 1) * 10));
        setNotFound(paginatedRockets.length === 0);
      } catch (error) {
        console.error("Failed to fetch rockets", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRockets();
  }, [currentPage]);

  const handlePrevious = () => {
    navigate(`/rockets/page/${currentPage - 1}`);
  };

  const handleNext = () => {
    navigate(`/rockets/page/${currentPage + 1}`);
  };

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading all Rockets...</Typography>;
  }

  if (notFound) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography gutterBottom variant="h6" component="div">Error (404): Rockets not found.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography gutterBottom variant="h5" component="div">
        SpaceX Rockets
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {rockets.map((rocket) => (
          <Card 
            key={rocket.id} 
            sx={{ 
              maxWidth: 300,
              mb: 2, 
              flex: '1 0 18%'
            }}
          >
            <CardMedia
              component="img"
              image={rocket.flickr_images[0] || noImage}
              alt={`${rocket.name}`}
              sx={{ height: 140, objectFit: 'contain' }} 
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {rocket.name}
              </Typography>
              <Link to={`/rockets/${rocket.id}`}style={{ textDecoration: 'none' }}>
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
        {hasNext && (
          <Button onClick={handleNext} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
            Next
          </Button>
        )}
      </div>
    </div>
  );  
}

export default RocketsPage;
