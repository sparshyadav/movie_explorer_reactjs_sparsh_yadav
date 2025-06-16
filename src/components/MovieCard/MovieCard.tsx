import React from 'react';
import './MovieCard.scss';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Pencil, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface ShowCardProps {
    id: string;
    title: string;
    posterImage: string;
    rating: number;
    premium: boolean;
    onAddToWatchlist?: (id: string, isAdded: boolean) => void;
}

const MovieCard: React.FC<ShowCardProps> = ({
    id,
    title,
    posterImage,
    rating,
    premium,
}) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleDetails = () => {
        const userPlan = localStorage.getItem('userPlan');
        const token = Cookies.get('authToken');
        if (!token) {
            toast.error("Please Login First");
            navigate('/login');
            return;
        }

        if (userPlan !== 'premium' && premium) {
            toast.error("Please Take Premium for Premium Movies!")
            navigate('/subscribe');
            return;
        }

        navigate(`/movie-details/${id}`)
        scrollToTop();
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Box className="netflix-show-card">
            <Box className="poster-container" onClick={handleDetails}>
                <img src={posterImage} alt={`${title} poster`} className="poster-image" />
                {
                    premium && (
                        <Box className="crown-badge">
                            <Crown />
                        </Box>
                    )
                }

                {role === 'supervisor' ? (
                    <Box className="poster-actions">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-movie/${id}`);
                            }}
                            className="edit-btn admin-btn"
                        >
                            <Pencil />
                        </button>
                    </Box>
                ) : (
                    <></>
                )}
            </Box>

            <Box className="show-info">
                <Box className="rating-container">
                    <Box className='rating-info'>
                        <span className="star-icon">★</span>
                        <span className="rating">{rating.toFixed(1)}</span>
                    </Box>
                </Box>

                <Box className="title-row">
                    <span className="title">{title}</span>
                </Box>

                <button className="watch-options-btn">More Info</button>
            </Box>
        </Box>
    );
};

export default MovieCard;