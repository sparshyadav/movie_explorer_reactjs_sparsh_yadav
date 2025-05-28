import { Component, createRef } from 'react'
import './BornToday.scss'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { ChevronRight } from 'lucide-react';
import Box from '@mui/material/Box';
import { getCelebsAPI } from '../../API';
import NavigateWrapper from '../NavigateWrapper';
import ShimmerCircle from '../ShimmerCircle/ShimmerCircle';

interface Celeb {
    id: number;
    name: string;
    age: number;
    image_url: string;
    link?: string;
}

interface BornTodayState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
    celebrities: Celeb[];
}

interface BornTodayProps {
    navigate: (path: string) => void;
}

export class BornToday extends Component<BornTodayProps, BornTodayState> {
    carouselRef = createRef<HTMLDivElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    constructor(props: BornTodayProps) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false,
            celebrities: [],
        };
    }

    componentDidMount(): void {
        const fetchCelebs = async () => {
            const response = await getCelebsAPI();
            this.setState({ celebrities: response });
        }

        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
        }

        fetchCelebs();
    }

    componentWillUnmount(): void {
        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.removeEventListener('scroll', this.updateScrollPosition);
        }
    }

    updateScrollPosition = () => {
        const carousel = this.carouselRef.current;
        if (carousel) {
            const newPosition = carousel.scrollLeft;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            this.setState({
                scrollPosition: newPosition,
                maxScrollReached: newPosition >= maxScroll - 20
            })
        }
    }

    handleScroll = (direction: 'left' | 'right') => {
        const { scrollPosition } = this.state;
        const carousel = this.carouselRef.current;

        if (carousel) {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            let newPosition;

            if (direction === 'left') {
                newPosition = Math.max(scrollPosition - this.scrollAmount, 0);
            } else {
                newPosition = Math.min(scrollPosition + this.scrollAmount, maxScroll);
            }

            carousel.scrollTo({
                left: newPosition,
                behavior: 'smooth',
            });
        }
    };

    handleClick = (id: number) => {
        this.props.navigate(`/celeb/${id}`)
    }


    render() {
        const { scrollPosition, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = scrollPosition < ((this.state.celebrities?.length ?? 0) - this.visibleCards) * this.cardWidth;

        return (
            <Box className='celeb-main-container'>
                <Box
                    className="celeb-card-carousel"
                    onMouseEnter={() => this.setState({ showControls: true })}
                >
                    <h2 className="celeb-title">Born Today <span className='title-icon'><ChevronRight className='next-icon' /></span></h2>

                    <Box className="carousel-container">
                        {showControls && canScrollLeft && (
                            <button
                                className="carousel-control left-control"
                                onClick={() => this.handleScroll('left')}
                                aria-label="Scroll left"
                            >
                                <ArrowBackIos />
                            </button>
                        )}

                        <Box className="carousel-track" ref={this.carouselRef}>
                            {this.state.celebrities.length === 0
                                ? Array.from({ length: this.visibleCards }).map((_, idx) => (
                                    <ShimmerCircle key={idx} />
                                ))
                                : this.state.celebrities.map((celeb) => (
                                    <Box
                                        className="carousel-item"
                                        key={celeb.id}
                                        onClick={() => this.handleClick(celeb.id)}
                                    >
                                        <img className="celeb-image" src={celeb.image_url} alt={celeb.name} />
                                        <p className="celeb-name">{celeb.name}</p>
                                        <p className="celeb-age">{celeb.age}</p>
                                    </Box>
                                ))}
                        </Box>


                        {showControls && canScrollRight && (
                            <button
                                className="carousel-control right-control"
                                onClick={() => this.handleScroll('right')}
                                aria-label="Scroll right"
                            >
                                <ArrowForwardIos />
                            </button>
                        )}
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default NavigateWrapper(BornToday);
