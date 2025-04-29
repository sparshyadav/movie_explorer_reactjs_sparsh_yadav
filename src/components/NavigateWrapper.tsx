import { useNavigate } from 'react-router-dom';
import { ComponentType, useContext } from 'react';
import UserContext from '../context/UserContext';
import MovieContext from '../context/MoviesContext';

function NavigateWrapper(Component: ComponentType<any>) {

    function NewComponent(props: any){
        const navigate = useNavigate();
        const context=useContext(UserContext);
        const movieContext=useContext(MovieContext);

        return <Component {...props} navigate={navigate} userContext={context} movieContext={movieContext} /> 
    }

    return NewComponent
}

export default NavigateWrapper;
