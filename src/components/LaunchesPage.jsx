import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Button, TextField } from '@mui/material';
import noImage from '../assets/no-image.svg';

function LaunchesPage() {
  const { page = 0 } = useParams();
  const currentPage = Math.max(0, parseInt(page, 10)); 
  const navigate = useNavigate();
  const [launches, setLaunches] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRouteValid, setIsRouteValid] = useState(true);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
          query: searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {},
          options: {
            limit: 10,
            page: currentPage + 1,
          },
        });

        const totalDocs = response.data.totalDocs; 
        const totalPages = Math.ceil(totalDocs / 10); 
        setTotalPages(totalPages);

        if (response.data.docs.length === 0) {
          setErrorMessage('No results found.');
        } else {
          setErrorMessage('');
        }
        setLaunches(response.data.docs);
        setHasNext(response.data.hasNextPage);
      } catch (error) {
        console.error("Failed to fetch launches", error);
        setErrorMessage('Failed to fetch launches.');
      } finally {
        setLoading(false);
      }
    };

    if (isNaN(currentPage)) {
      setIsRouteValid(false);
      setErrorMessage('Error (404): Launches not found.');
    } else {
      setIsRouteValid(true);
      fetchLaunches();
    }
  }, [currentPage, searchQuery]);

  const handleSearchChange = (event) => {
    setTempSearchQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(tempSearchQuery);
      navigate(`/launches/page/0`); 
    }
  };

  const handlePrevious = () => navigate(`/launches/page/${currentPage - 1}`);
  const handleNext = () => navigate(`/launches/page/${currentPage + 1}`);

  if (!isRouteValid || currentPage >= totalPages) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography gutterBottom variant="h6" component="div">Error (404): Launches not found.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography gutterBottom variant="h5" component="div">
        SpaceX Launches
      </Typography>
      <TextField
        label="Search Launches"
        variant="outlined"
        value={tempSearchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyPress}
        sx={{
          '& .MuiInputBase-root': { color: 'white' }, 
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#487547' }, 
            '&:hover fieldset': { borderColor: '#a35596' }, 
            '&.Mui-focused fieldset': { borderColor: 'white' }, 
          }, 
          '& label.Mui-focused': { color: '#9e9e9e' }, 
          '& label': { color: '#9e9e9e' },
          marginBottom: '20px',
          width: '500px',
          mt: 2,
        }}
      />
      {loading ? (
        <Typography gutterBottom variant="h6" component="div">Loading all Launches...</Typography>
      ) : errorMessage ? (
        <Typography>
          <ul>
          <li>{errorMessage}</li>
          <li><Button
            variant="contained"
            onClick={() => {
              setTempSearchQuery('');
              setSearchQuery('');
              navigate('/launches/page/0');
            }}
            style={{ marginTop: '20px' }}
          >
            Back to all launches
          </Button></li>
           </ul>
        </Typography>
          
      ) : (
      <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {launches.map((launch) => (
          <Card 
            key={launch.id} 
            sx={{ 
              maxWidth: 300,
              mb: 2, 
              flex: '1 0 18%'
            }}>
            <CardMedia
              component="img"
              image={launch.links.patch.small || noImage}
              alt={`${launch.name} launch patch`}
              sx={{ height: 140, objectFit: 'contain' }} 
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {launch.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Flight Number: {launch.flight_number}
              </Typography>
              <Link to={`/launches/${launch.id}`} style={{ textDecoration: 'none' }}>
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
    </>
      )}
    </div>
  );  
  };

export default LaunchesPage;