import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddMovieWrapper = (WrappedComponent: React.ComponentType<{ id?: string }>) => {
    const ComponentWithParams = () => {
        const { id } = useParams<{ id: string }>();
        const navigate = useNavigate();

        return <WrappedComponent id={id} navigate={navigate} />;
    };

    return ComponentWithParams;
};

export default AddMovieWrapper;
