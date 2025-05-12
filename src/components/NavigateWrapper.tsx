import { useNavigate } from 'react-router-dom';
import { ComponentType } from 'react';

function NavigateWrapper(Component: ComponentType<any>) {

    function NewComponent(props: any){
        const navigate = useNavigate();

        return <Component {...props} navigate={navigate} /> 
    }

    return NewComponent
}

export default NavigateWrapper;
