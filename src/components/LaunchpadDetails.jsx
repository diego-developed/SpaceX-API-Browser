import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, CardMedia, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import noImage from '../assets/no-image.svg';

function LaunchpadDetails() {
  const { id } = useParams();
  const [launchpadDetails, setLaunchpadDetails] = useState(null);
  const [associatedLaunches, setAssociatedLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLaunchpadDetails = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/launchpads/${id}`);
        setLaunchpadDetails(response.data);
        const launchPromises = response.data.launches.map(launchId =>
            axios.get(`https://api.spacexdata.com/v4/launches/${launchId}`)
          );
          const launchResponses = await Promise.all(launchPromises);
          const launchesData = launchResponses.map(res => res.data);
          setAssociatedLaunches(launchesData);
        setError(false);
      } catch (error) {
        console.error("Failed to fetch launchpad details", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunchpadDetails();
  }, [id]);

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading launchpad details...</Typography>;
  }

  if (error || !launchpadDetails) {
    return <Typography gutterBottom variant="h6" component="div">Launchpad not found.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardMedia
        component="img"
        image={launchpadDetails.images?.large[0] || noImage}
        alt={`${launchpadDetails.name}`}
        sx={{ height: 300, objectFit: 'contain' }}
      />
      <CardContent>
        <ul>
        <Typography gutterBottom variant="h5" component="div">
          <li>{launchpadDetails.full_name} ({launchpadDetails.name})</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>{launchpadDetails.details || "No details available."}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Location: {launchpadDetails.locality}, {launchpadDetails.region}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Status: {launchpadDetails.status}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Launch Attempts: {launchpadDetails.launch_attempts}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Launch Successes: {launchpadDetails.launch_successes}</li>
        </Typography>
        {associatedLaunches.length > 0 && (
          <>
          <li><Accordion>
          <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="associated-launches-content"
              id="associated-launches-header"
            >
            <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
              Associated Launches:
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {associatedLaunches.map((launch, index) => (
                <React.Fragment key={launch.id}>
                <Link to={`/launches/${launch.id}`}>{launch.name}</Link>
                {index < associatedLaunches.length - 1 ? <span className="boldComma"> , </span> : ''}
                </React.Fragment>
              ))}
            </AccordionDetails>
            </Accordion>
            </li>
          </>
        )}
        <li><Button variant="contained" component={Link} to="/launchpads/page/0" style={{ marginTop: '20px' }}>
          Back to all launchpads
        </Button></li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default LaunchpadDetails;
