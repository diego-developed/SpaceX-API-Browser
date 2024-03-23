import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Button } from '@mui/material';

function CoreDetails() {
  const { id } = useParams();
  const [coreDetails, setCoreDetails] = useState(null);
  const [associatedLaunches, setAssociatedLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoreDetails = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/cores/${id}`);
        setCoreDetails(response.data);
        const launchPromises = response.data.launches.map(launchId =>
          axios.get(`https://api.spacexdata.com/v4/launches/${launchId}`)
        );  
        const launchesResponses = await Promise.all(launchPromises);
        const launchesData = launchesResponses.map(res => res.data);
        setAssociatedLaunches(launchesData);
        setError(false);
      } catch (error) {
        console.error("Failed to fetch core details", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoreDetails();
  }, [id]);

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading core details...</Typography>;
  }

  if (error || !coreDetails) {
    return <Typography>Core not found.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardContent>
        <ul>
        <Typography gutterBottom variant="h5" component="div">
          <li>Core Serial: {coreDetails.serial}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Status: {coreDetails.status || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Launch Attempts: {coreDetails.asds_attempts || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Launch Successes: {coreDetails.asds_landings || "N/A"}</li>
        </Typography>
        {associatedLaunches.length > 0 && (
          <>
          <li>
            <Typography variant="body2" color="text.secondary">
              Associated Launches:
            </Typography>
              {associatedLaunches.map((launch, index) => (
                <React.Fragment key={launch.id}>
                <Link to={`/launches/${launch.id}`}>{launch.name}</Link>
                {index < associatedLaunches.length - 1 ? <span className="boldComma"> , </span> : ''}
              </React.Fragment>
              ))}
            </li>
          </>
        )}
        <li><Button variant="contained" component={Link} to="/cores/page/0" style={{ marginTop: '20px' }}>
          Back to all cores
        </Button>
        </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default CoreDetails;
