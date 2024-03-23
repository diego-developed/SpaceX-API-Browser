import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import noImage from '../assets/no-image.svg';

function ShipsPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [ships, setShips] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const currentPage = parseInt(page, 10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/ships`);
        const paginatedShips = response.data.slice(currentPage * 10, (currentPage * 10) + 10);
        setShips(paginatedShips);
        setHasNext(response.data.length > ((currentPage + 1) * 10));
        setNotFound(paginatedShips.length === 0);
      } catch (error) {
        console.error("Failed to fetch ships", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShips();
  }, [currentPage]);

  const handlePrevious = () => {
    navigate(`/ships/page/${currentPage - 1}`);
  };

  const handleNext = () => {
    navigate(`/ships/page/${currentPage + 1}`);
  };

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading all Ships...</Typography>;
  }

  if (notFound) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography gutterBottom variant="h6" component="div">Error (404): Ships not found.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography gutterBottom variant="h5" component="div">
        SpaceX Ships
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {ships.map((ship) => (
          <Card 
            key={ship.id} 
            sx={{ 
              maxWidth: 300,
              mb: 2, 
              flex: '1 0 18%' 
            }}
          >
            <CardMedia
              component="img"
              image={ship.image || noImage}
              alt={ship.name}
              sx={{ height: 140, objectFit: 'contain' }} 
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {ship.name}
              </Typography>
              <Link to={`/ships/${ship.id}`} style={{ textDecoration: 'none' }}>
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

export default ShipsPage;
