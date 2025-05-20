import { Component, createRef } from 'react'
import './BornToday.scss'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { ChevronRight } from 'lucide-react';
import Box from '@mui/material/Box';

interface Celeb {
    id: number;
    name: string;
    age: number;
    image: string;
    link?: string;
}

interface BornTodayState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
}

export class BornToday extends Component<object, BornTodayState> {
    carouselRef = createRef<HTMLDivElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    celebrities: Celeb[] = [
        {
            id: 1,
            name: 'Shah Rukh Khan',
            age: 58,
            image: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/08/Shah-Rukh-Khan-Final-Getty-H-2024.jpg?w=1296&h=730&crop=1',
            link: 'https://www.imdb.com/name/nm0451321/'
        },
        {
            id: 4,
            name: 'Deepika Padukone',
            age: 38,
            image: 'https://www.livemint.com/lm-img/img/2024/02/14/original/Deepika_Padukone_BAFTA_2024_Presenter_1707897095641.jpg',
            link: 'https://www.imdb.com/name/nm2138653/?ref_=nv_sr_srsg_1_tt_6_nm_1_in_0_q_deepika%2520padukone'
        },
        {
            id: 5,
            name: 'Priyanka Chopra',
            age: 43,
            image: 'https://www.aljazeera.com/wp-content/uploads/2022/10/2021-02-10T000000Z_1391928561_RC2RPL9ASHTD_RTRMADP_3_PEOPLE-PRIYANKA-CHOPRA-JONAS.jpg?resize=1920%2C1440',
            link: 'https://www.imdb.com/name/nm1231899/?ref_=nv_sr_srsg_1_tt_4_nm_3_in_0_q_priyanka%2520chopra'
        },
        {
            id: 7,
            name: 'Leonardo DiCaprio',
            age: 49,
            image: 'https://variety.com/wp-content/uploads/2023/05/GettyImages-1492284655.jpg?w=1024',
            link: 'https://www.imdb.com/name/nm0000138/?ref_=nv_sr_srsg_0_tt_7_nm_1_in_0_q_leonardo%2520dica'
        },
        {
            id: 8,
            name: 'Brad Pitt',
            age: 60,
            image: 'https://variety.com/wp-content/uploads/2022/06/Screen-Shot-2022-06-22-at-10.08.26-AM.png',
            link: 'https://www.imdb.com/name/nm0000093/?ref_=nv_sr_srsg_0_tt_6_nm_2_in_0_q_brad%2520pitt'
        },
        {
            id: 10,
            name: 'Meryl Streep',
            age: 75,
            image: 'https://variety.com/wp-content/uploads/2024/09/Meryl-Streep-e1727449132211.jpg',
            link: 'https://www.imdb.com/name/nm0000658/?ref_=nv_sr_srsg_0_tt_0_nm_8_in_0_q_meryl'
        },
        {
            id: 9,
            name: 'Tom Cruise',
            age: 61,
            image: 'https://www.spectator.co.uk/wp-content/uploads/2022/06/GettyImages-1398214825.jpg',
            link: 'https://www.imdb.com/name/nm0000129/?ref_=nv_sr_srsg_1_tt_5_nm_2_in_0_q_tom%2520cruise'
        },

        {
            id: 11,
            name: 'Scarlett Johansson',
            age: 40,
            image: 'https://fandomwire.com/wp-content/uploads/2021/08/a-scarlett-johansson-oscars-tout.jpg',
            link: 'https://www.imdb.com/name/nm0424060/?ref_=nv_sr_srsg_1_tt_3_nm_4_in_0_q_scarlett%2520johan'
        },
        {
            id: 12,
            name: 'Jennifer Lawrence',
            age: 33,
            image: 'https://people.com/thmb/milnjoq8mVlP6EJPCPF-I7gl1cg=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(739x269:741x271)/Jennifer-lawrence-wwd-honors-new-york-102423_0624-379acb55a9644c3d8825e48f5edf764a.jpg',
            link: 'https://www.imdb.com/name/nm2225369/?ref_=nv_sr_srsg_1_tt_4_nm_3_in_0_q_jennifer%2520lawrence'
        }
    ];


    constructor(props: object) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false
        };
    }

    componentDidMount(): void {
        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
        }
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
        const celeb = this.celebrities.find(c => c.id === id);
        if (celeb?.link) {
            window.location.href = celeb.link!;
        }
    }

    render() {
        const { scrollPosition, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = scrollPosition < (this.celebrities.length - this.visibleCards) * this.cardWidth;

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
                            {this.celebrities.map((celeb) => (
                                <Box className="carousel-item" key={celeb.id} onClick={() => this.handleClick(celeb.id)}>
                                    <img className='celeb-image' src={celeb.image} alt={celeb.name} />
                                    <p className='celeb-name'>{celeb.name}</p>
                                    <p className='celeb-age'>{celeb.age}</p>
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

export default BornToday;
