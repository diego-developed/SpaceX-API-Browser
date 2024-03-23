import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, CardMedia, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import noImage from '../assets/no-image.svg';

function ShipDetails() {
  const { id } = useParams();
  const [shipDetails, setShipDetails] = useState(null);
  const [associatedLaunches, setAssociatedLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShipDetails = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/ships/${id}`);
        setShipDetails(response.data);

        const launchPromises = response.data.launches.map(launchId =>
          axios.get(`https://api.spacexdata.com/v4/launches/${launchId}`)
        );
        const launchResponses = await Promise.all(launchPromises);
        const launchesData = launchResponses.map(res => res.data);
        setAssociatedLaunches(launchesData);

        setError(false);
      } catch (error) {
        console.error("Failed to fetch ship details", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShipDetails();
  }, [id]);

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading ship details...</Typography>;
  }

  if (error || !shipDetails) {
    return <Typography gutterBottom variant="h6" component="div">Ship not found.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardMedia
        component="img"
        image={shipDetails.image || noImage}
        alt={`${shipDetails.name}`}
        sx={{ height: 300, objectFit: 'contain' }}
      />
      <CardContent>
        <ul>
        <Typography gutterBottom variant="h5" component="div">
          <li>{shipDetails.name}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Type: {shipDetails.type || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Home Port: {shipDetails.home_port || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Latitude: {shipDetails.latitude || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>Longitude: {shipDetails.longitude || "N/A"}</li>
        </Typography>
        <li>{associatedLaunches.length > 0 && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="associated-launches-content"
              id="associated-launches-header"
            >
              <Typography>Associated Launches</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {associatedLaunches.map((launch, index) => (
                <React.Fragment key={launch.id}>
                <Link to={`/launches/${launch.id}`} style={{ textDecoration: 'none' }}>{launch.name}</Link>
                {index < associatedLaunches.length - 1 ? <span className="boldComma"> , </span> : ''}
              </React.Fragment>
              ))}
            </AccordionDetails>
          </Accordion>
        )}</li>
        <li>{shipDetails.link && (
          <Typography>
            <Link to={shipDetails.link} target="_blank" rel="noopener noreferrer">Learn More</Link>
          </Typography>
        )}</li>
        <li><Button variant="contained" component={Link} to="/ships/page/0" style={{ marginTop: '20px' }}>
          Back to all ships
        </Button></li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default ShipDetails;
