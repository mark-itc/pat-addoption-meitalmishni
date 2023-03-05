import { useEffect, useState, useContext } from 'react';
import { getAWSimage } from '../../Helpers/api';
import './PetCard.css'
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'
import { PetContext } from '../../context/PetContext';


export function PetCard({ pet }) {

    const navigate = useNavigate();
    const [image, setimage] = useState('');
    const { petId, setPetId } = useContext(PetContext);


    useEffect(() => {

        const img = getAWSimage(pet.picture);
        setimage(img);

    }, []);

    function handlePetPage(petId) {
        setPetId(petId);
        navigate('/pet');
    }

    return (

        <Card key={pet.id} sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {pet.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {pet.adoption_status}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => { handlePetPage(pet.id) }}>More Details</Button>
            </CardActions>
        </Card>
    );
}