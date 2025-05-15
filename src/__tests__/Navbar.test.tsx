import { render, screen, waitFor } from '@testing-library/react';
import Navbar from '../components/Navbar/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import * as API from '../API';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
    get: jest.fn()
}));

jest.mock('../API', () => ({
    getSubscriptionStatus: jest.fn()
}));

jest.mock('../components/ProfileMenu', () => () => <div data-testid="profile-menu">ProfileMenu</div>);

const setup = () => {
    return render(
        <Router>
            <Navbar />
        </Router>
    );
};

describe('Navbar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the site title', () => {
        setup();
        const title = screen.getByText(/BINGE/i);
        expect(title).toBeInTheDocument();
    });

    it('renders ProfileMenu', () => {
        setup();
        expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
    });

    it('renders search and subscribe icons', () => {
        setup();
        const icons = document.querySelectorAll('.search-icon');
        expect(icons.length).toBeGreaterThanOrEqual(2);
    });


    it('calls getSubscriptionStatus when token exists and sets user plan to premium', async () => {
        (Cookies.get as jest.Mock).mockReturnValue('dummy-token');
        (API.getSubscriptionStatus as jest.Mock).mockResolvedValue({ plan_type: 'premium' });

        setup();

        await waitFor(() => {
            expect(API.getSubscriptionStatus).toHaveBeenCalledWith('dummy-token');
        });

        expect(localStorage.getItem('userPlan')).toBe('premium');
    });

    it('does not call getSubscriptionStatus when token is missing', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        setup();

        await waitFor(() => {
            expect(API.getSubscriptionStatus).not.toHaveBeenCalled();
        });
    });

    //   it('navigates on icon clicks', async () => {
    //     const mockNavigate = jest.fn();
    //     jest.mock('react-router-dom', () => ({
    //       ...jest.requireActual('react-router-dom'),
    //       useNavigate: () => mockNavigate,
    //     }));

    //     // Re-import the component after mocking navigate
    //     const { default: NavbarWithMockNavigate } = await import('../components/Navbar/Navbar');

    //     render(
    //       <Router>
    //         <NavbarWithMockNavigate />
    //       </Router>
    //     );

    //     const icons = screen.getAllByRole('img', { hidden: true });
    //     fireEvent.click(icons[0]); // First icon (Premium or Search)

    //     // Can’t assert the navigate path directly without context injection
    //     // But you could mock and spy `useNavigate()` as shown above in integration
    //   });
});
