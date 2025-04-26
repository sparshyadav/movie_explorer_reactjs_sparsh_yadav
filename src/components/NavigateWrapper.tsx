import { useNavigate } from 'react-router-dom';
import { ComponentType, useContext } from 'react';
import UserContext from '../context/UserContext';

function NavigateWrapper(Component: ComponentType<any>) {

    function NewComponent(props: any){
        const navigate = useNavigate();
        const context=useContext(UserContext);

        return <Component {...props} navigate={navigate} userContext={context} /> 
    }

    return NewComponent
}

export default NavigateWrapper;
