import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import noImage from '../assets/no-image.svg';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function RocketDetails() {
  const { id } = useParams();
  const [rocketDetails, setRocketDetails] = useState(null);
  const [associatedLaunches, setAssociatedLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRocketDetails = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/rockets/${id}`);
        setRocketDetails(response.data);
        const launchesResponse = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
          query: { rocket: id },
          options: { pagination: false } 
        });
        
        setAssociatedLaunches(launchesResponse.data.docs); 
        setError(false);
      } catch (error) {
        console.error("Failed to fetch rocket details", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRocketDetails();
  }, [id]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: true
  };

  if (loading) {
    return <Typography gutterBottom variant="h6" component="div">Loading rocket details...</Typography>;
  }

  if (error || !rocketDetails) {
    return <Typography gutterBottom variant="h6" component="div">Rocket not found.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      {rocketDetails.flickr_images.length > 0 ? (
        <Slider {...settings}>
          {rocketDetails.flickr_images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`${rocketDetails.name} image #${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))}
        </Slider>
      ) : (
        <img src={noImage} style={{ width: '100%', height: 'auto' }} />
      )}
      <CardContent>
        <ul>
        <Typography gutterBottom variant="h5" component="div">
         <li>{rocketDetails.name}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <li>{rocketDetails.description}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Height: {rocketDetails.height?.meters} meters</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Mass: {rocketDetails.mass?.kg} kg</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Number of Engines: {rocketDetails.engines?.number}</li>
        </Typography>
        {associatedLaunches.length > 0 && (
          <li><Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="associated-launches-content"
              id="associated-launches-header"
            >
              <Typography>Associated Launches</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {associatedLaunches.map((launch, index) => (
                  <React.Fragment key={launch.id}>
                    <Link to={`/launches/${launch.id}`} style={{ textDecoration: 'none' }}>{launch.name}</Link>
                    {index < associatedLaunches.length - 1 ? <span className="boldComma"> , </span> : ''}
                  </React.Fragment>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
          </li>
        )}

        <li><Link to={rocketDetails.wikipedia} target="_blank" rel="noopener noreferrer">Wikipedia</Link></li>
        
        <li><Button variant="contained" component={Link} to="/rockets/page/0" style={{ marginTop: '20px' }}>
          Back to all rockets
        </Button>
        </li>

        </ul>
      </CardContent>
    </Card>
  );
}

export default RocketDetails;